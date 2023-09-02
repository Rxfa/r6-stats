from collections import namedtuple
from utils import is_own_team, is_opp_team, get_side, ID
from player import Player
from round import Round

REFRAG_TIME_WINDOW = 10
 
Score = namedtuple("Score", "own opp")

class Matchclass:
    def __init__(self, src):
        self.map = src["rounds"][0]["map"]["name"]
        self.score = Score(
            own=list(filter(is_own_team, src["rounds"][-1]["teams"]))[0]["score"],
            opp=list(filter(is_opp_team, src["rounds"][-1]["teams"]))[0]["score"]
        )
        self.own_bans = None #   Not possible to get as of august 18th 2023
        self.op_bans = None #   Not possible to get as of august 18th 2023
        self.rounds = []
        self.starting_side = get_side(src)     
        self.players = {x: Player(name=x, rounds=len(src["rounds"])) for x in self.get_team_players(src)}
        
        self.do_kd(src)
        self.do_KOST(src)
        self.do_round_history(src)
        
    def get_team_players(self, src):
        if self.starting_side == "Attack":
            return [x["username"] for x in src["stats"][5:]]
        return [x["username"] for x in src["stats"][:5]]
    
    def do_kd(self, src):
        for i in src["stats"]:
            if i["username"] in self.players.keys():
                player = self.players[i["username"]]
                player.rounds = i["rounds"]
                player.kills = i["kills"]
                player.deaths = i["deaths"]
                player.headshots = i["headshots"]
                
    def do_round_history(self, src):
        for count, rnd in enumerate(src):
            self.rounds[count] = Round(
                number=rnd["roundNumber"],
                map=rnd["map"]["name"],
                site="0", #site=round["site"]
                side=get_side(src, rnd["roundNumber"]),
                won=self.team_won(rnd),
                win_condition=self.determine_win_condition(rnd),
            )
            self.do_individual_stats(rnd)
        
    def team_won(self, rnd):
        if rnd["teams"][0]["name"] == "YOUR TEAM":
            return rnd["teams"][0]["won"]
        return rnd["teams"][1]["won"]
        
    
    def do_KOST(self, rnds):
        kost = 0
        for player in self.players:
            for rnd in rnds:
                if self.kost(rnd, player):
                    kost += 1
            kost /= len(rnds)
            self.players[player].kost = format(kost, '.2f')
    
    def kost(self, rnd, player):
        return (
            self.got_kills(rnd["stats"], player) or
            self.planted_or_disabled_defuser(rnd["matchFeedback"], player) or
            self.survived(rnd["stats"], player) or
            self.was_traded(rnd["matchFeedback"], player)
        )
    
    def do_individual_stats(self, rnd):
        self.get_entry_engagements(rnd["matchFeedback"])
        self.do_multikills(rnd["stats"])
        self.do_defuser_plants(rnd["matchFeedback"])
        self.do_defuser_disables(rnd["matchFeedback"])
        if self.team_won(rnd):
            self.do_clutches(rnd["stats"])
        
    def get_entry_engagements(self, events):
        entry_kill = True
        entry_death = True
        for event in events:
            if event["type"]["id"] == ID.KILL_ID.value:
                entry_kill = self.add_entry_kill(entry_kill, event)
                entry_death = self.add_entry_death(entry_death, event)
                    
    def add_entry_kill(self, entry_kill, event):
        if event["username"] in self.players and entry_kill:
            player = self.players[event["username"]]
            player.entry_kills += 1
            return False
        
    def add_entry_death(self, entry_death, event):
        if event["target"] in self.players and entry_death:
            player = self.players[event["target"]]
            player.entry_deaths += 1
            return False
                    
    def do_multikills(self, stats_table):
        for stat in stats_table:
            if stat["username"] in self.players and stat["kills"] > 1:
                player = self.players[stat["username"]]
                player.multikills += 1
                
    def do_defuser_plants(self, events):
        for event in events:
            if event["type"]["id"] == ID.DEFUSER_PLANTED_ID.value and event["username"] in self.players:
                player = self.players[event["username"]]
                player.plants += 1
                
    def do_defuser_disables(self, events):
        for event in events:
            if event["type"]["id"] == ID.DEFUSER_DISABLED_ID.value and event["username"] in self.players:
                player = self.players[event["username"]]
                player.disables += 1    
                
    def do_clutches(self, round_stats):
        players_alive = [
            player for player in round_stats if self.survived(round_stats, player["username"])
            ]
        if len(players_alive) == 1 and players_alive[0]["username"] in self.players:
            player = self.players[players_alive[0]["username"]]
            player.clutches += 1                  
            
    def got_kills(self, stats, player):
        for i in stats:
            if i["username"] == player:
                return False if i["kills"] == 0 else True
        return False
    
    def planted_or_disabled_defuser(self, events, player):
        for event in events:
            if (event["type"]["id"] == ID.DEFUSER_DISABLED_ID.value or 
                event["type"]["id"] == ID.DEFUSER_PLANTED_ID.value) and event["username"] == player:
                return True
        return False
    
    def survived(self, round_stats, player):
        for i in round_stats:
            if i["username"] == player:
                return False if i["died"] else True
        return False
    
    def was_traded(self, events, player):
        death_time = -1
        for event in events:
            if event["type"]["id"] == ID.KILL_ID.value and event["target"] == player:
                death_time = event["timeInSeconds"]
                continue

            if not (event["type"]["id"] == ID.KILL_ID.value and event["username"] in self.players):
                if not self.isTrade(death_time, event["timeInSeconds"]):
                    return False
        return True if self.isTrade(death_time, event["timeInSeconds"]) else False
    
    def isTrade(self, death_time, refrag_time):
        return ((death_time - refrag_time) <= REFRAG_TIME_WINDOW)
    
    def determine_win_condition(self, rnd):
        if "winCondition" in rnd["teams"][0]:
            return rnd["teams"][0]["winCondition"]
        return rnd["teams"][1]["winCondition"]
    