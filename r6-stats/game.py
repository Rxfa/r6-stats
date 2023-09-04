from collections import namedtuple
from utils import is_own_team, is_opp_team, get_side, ID, print3n
from tabulate import tabulate
from player import Player
from round import Round

REFRAG_TIME_WINDOW = 10
 
Score = namedtuple("Score", "own opp")

class Match:
    def __init__(self, src):
        self.map = src["rounds"][0]["map"]["name"]
        self.score = Score(
            own=list(filter(is_own_team, src["rounds"][-1]["teams"]))[0]["score"],
            opp=list(filter(is_opp_team, src["rounds"][-1]["teams"]))[0]["score"]
        )
        self.own_bans = None #   Not possible to get as of august 18th 2023
        self.opp_bans = None #   Not possible to get as of august 18th 2023
        self.rounds = []
        self.starting_side = get_side(src)     
        self.players = {x: Player(name=x, rounds=len(src["rounds"])) for x in self._get_team_players(src)}
        
        self._do_kd(src)
        self._do_KOST(src["rounds"])
        self._do_round_history(src)
        self._calculate_individual_stats()
        
    def __str__(self):
        return f"{self._show()}"
        
    def _show(self):
        self._show_general()
        self._show_rounds()
        self._show_individual_stats()
    
    def _show_general(self):
        headers = ["Map", "Score", "Own ban", "Opp ban"]
        data = [[self.map, f"{self.score.own} - {self.score.opp}", self.own_bans, self.opp_bans],]
        print3n(tabulate(data, headers=headers))
    
    def _show_individual_stats(self):
        headers = [
            "Name", "Rounds", "Rating", "Kills", "Deaths", "KD", "Entry Kills",
            "Entry Deaths", "1vX", "Plants", "Disables", "KOST", "SRV"
        ]
        data = [
            [
                value.name, value.rounds, value.rating, value.kills, value.deaths, value.kd, value.entry_kills,
                value.entry_deaths, value.clutches, value.plants, value.disables, value.kost,
                value.srv
            ] for _, value in self.players.items()
        ]
        print3n(tabulate(data, headers=headers))
        
    def _show_rounds(self):
        headers = ["Number", "Map", "Site", "Side", "Won", "Win Condition"]
        data = [
            [x.number, x.map, x.site, x.side, x.won, x.win_condition] for x in self.rounds
        ]
        print3n(tabulate(data, headers=headers))
        
    def _get_team_players(self, src):
        if self.starting_side == "Attack":
            return [x["username"] for x in src["stats"][5:]]
        return [x["username"] for x in src["stats"][:5]]
    
    def _do_kd(self, src):
        for i in src["stats"]:
            if i["username"] in self.players.keys():
                player = self.players[i["username"]]
                player.rounds = i["rounds"]
                player.kills = i["kills"]
                player.deaths = i["deaths"]
                player.headshots = i["headshots"]
                
    def _do_round_history(self, src):
        for _, rnd in enumerate(src["rounds"]):
            self.rounds.append(
                Round(
                number=rnd["roundNumber"],
                map=rnd["map"]["name"],
                site=rnd["site"],
                side=get_side(src, rnd["roundNumber"]),
                won=self._team_won(rnd),
                win_condition=self._determine_win_condition(rnd),
                )
            )
            self._do_individual_stats(rnd)
            
    def _calculate_individual_stats(self):
        for player in self.players.values():
            player.calculate()
        
    def _team_won(self, rnd):
        if rnd["teams"][0]["name"] == "YOUR TEAM":
            return rnd["teams"][0]["won"]
        return rnd["teams"][1]["won"]
        
    
    def _do_KOST(self, rnds):
        kost = 0
        for player in self.players:
            for rnd in rnds:
                if self._kost(rnd, player):
                    kost += 1
            kost /= len(rnds)
            self.players[player].kost = kost
    
    def _kost(self, rnd, player):
        return (
            self._got_kills(rnd["stats"], player) or
            self._planted_or_disabled_defuser(rnd["matchFeedback"], player) or
            self._survived(rnd["stats"], player) or
            self._was_traded(rnd["matchFeedback"], player)
        )
    
    def _do_individual_stats(self, rnd):
        self._get_entry_engagements(rnd["matchFeedback"])
        self._do_multikills(rnd["stats"])
        self._do_defuser_plants(rnd["matchFeedback"])
        self._do_defuser_disables(rnd["matchFeedback"])
        if self._team_won(rnd):
            self._do_clutches(rnd["stats"])
        
    def _get_entry_engagements(self, events):
        entry_kill = True
        entry_death = True
        for event in events:
            if event["type"]["id"] == ID.KILL_ID.value:
                entry_kill = self._add_entry_kill(entry_kill, event)
                entry_death = self._add_entry_death(entry_death, event)
                    
    def _add_entry_kill(self, entry_kill, event):
        if event["username"] in self.players and entry_kill:
            player = self.players[event["username"]]
            player.entry_kills += 1
            return False
        
    def _add_entry_death(self, entry_death, event):
        if event["target"] in self.players and entry_death:
            player = self.players[event["target"]]
            player.entry_deaths += 1
            return False
                    
    def _do_multikills(self, stats_table):
        for stat in stats_table:
            if stat["username"] in self.players and stat["kills"] > 1:
                player = self.players[stat["username"]]
                player.multikills += 1
                
    def _do_defuser_plants(self, events):
        for event in events:
            if event["type"]["id"] == ID.DEFUSER_PLANTED_ID.value and event["username"] in self.players:
                player = self.players[event["username"]]
                player.plants += 1
                
    def _do_defuser_disables(self, events):
        for event in events:
            if event["type"]["id"] == ID.DEFUSER_DISABLED_ID.value and event["username"] in self.players:
                player = self.players[event["username"]]
                player.disables += 1    
                
    def _do_clutches(self, round_stats):
        players_alive = [
            player for player in round_stats if self._survived(round_stats, player["username"])
            ]
        if len(players_alive) == 1 and players_alive[0]["username"] in self.players:
            player = self.players[players_alive[0]["username"]]
            player.clutches += 1                  
            
    def _got_kills(self, stats, player):
        for i in stats:
            if i["username"] == player:
                return False if i["kills"] == 0 else True
        return False
    
    def _planted_or_disabled_defuser(self, events, player):
        for event in events:
            if (event["type"]["id"] == ID.DEFUSER_DISABLED_ID.value or 
                event["type"]["id"] == ID.DEFUSER_PLANTED_ID.value) and event["username"] == player:
                return True
        return False
    
    def _survived(self, round_stats, player):
        for i in round_stats:
            if i["username"] == player:
                return False if i["died"] else True
        return False
    
    def _was_traded(self, events, player):
        death_time = -1
        for event in events:
            if event["type"]["id"] == ID.KILL_ID.value and event["target"] == player:
                death_time = event["timeInSeconds"]
                continue

            if not (event["type"]["id"] == ID.KILL_ID.value and event["username"] in self.players):
                if not self._isTrade(death_time, event["timeInSeconds"]):
                    return False
        return True if self._isTrade(death_time, event["timeInSeconds"]) else False
    
    def _isTrade(self, death_time, refrag_time):
        return ((death_time - refrag_time) <= REFRAG_TIME_WINDOW)
    
    def _determine_win_condition(self, rnd):
        if "winCondition" in rnd["teams"][0]:
            return rnd["teams"][0]["winCondition"]
        return rnd["teams"][1]["winCondition"]
    