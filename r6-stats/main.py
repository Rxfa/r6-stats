"""Main file"""
import argparse
import json
import os
import time
from utils import is_own_team, is_opp_team
from dataclasses import asdict
from pprint import pprint
from player import Player
from game import Match
from round import Round

REFRAG_TIME_WINDOW = 10

KILL_ID = 0
DEATH_ID = 1
DEFUSER_PLANT_START_ID = 2
DEFUSER_PLANTED_ID = 3
DEFUSER_DISABLED_ID = -1 #TODO: Find out the ID
LOCATE_OBJECTIVE_ID = 6
OPERATOR_SWAP_ID = 7
OTHER_ID = 10

def main():
    """Main function"""
    t = time.process_time()
    parser = argparse.ArgumentParser(
        prog="R6 Stats",
        description="R6 Stats",
    )
    parser.add_argument("gameFile", type=str, help="Game data file")
    args = parser.parse_args()
    filename = args.gameFile

    if not os.path.isfile(filename):
        print("File does not exist.")
        return

    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
        print(f"{get_general_info(data)}")
        get_team_stats(data)
        elapsed = time.process_time() - t
        print(f"Time of execution - {elapsed}s")


def get_general_info(data):
    """gets general match stats"""
    own_team_score = list(filter(is_own_team, data["rounds"][-1]["teams"]))[0]["score"]
    opp_team_score = list(filter(is_opp_team, data["rounds"][-1]["teams"]))[0]["score"]
    match = Match(map=data["rounds"][0]["map"]["name"],
                score=(own_team_score, opp_team_score),
                own_bans=None,     #   Not possible to get as of august 18th 2023
                op_bans=None    #   Not possible to get as of august 18th 2023
                )
    return match

def get_team_stats(data):
    """gets team stats"""   
    starting_side = get_side(data["rounds"])
    team_players = get_team_players(data["rounds"][0], starting_side)
    rounds = dict()
    players = {x: Player(name=x, rounds=len(data["rounds"])) for x in team_players}
    get_kd(data["stats"], players)
    loop_round_by_round(data["rounds"], rounds, players)
    print(rounds)
    for i in players.values():
        pprint(i)


def get_side(src, number=0):
    """Returns side of the team of the recording player"""
    try:
        return list(filter(is_own_team, src[number]["teams"]))[0]["role"]
    except IndexError as err:
        print("Runtime error:", err)


def get_team_players(src, side):
    """Returns list of players in the same team as the recording player"""
    if side == "Attack":
        return [x["username"] for x in src["players"][5:]]
    return [x["username"] for x in src["players"][:5]]


def get_kd(src, players):
    """Updates Kills and Deaths for every player on the same team as the recording player"""
    for i in src:
        if i["username"] in players.keys():
            player = players[i["username"]]
            player.rounds = i["rounds"]
            player.kills = i["kills"]
            player.deaths = i["deaths"]
            player.headshots = i["headshots"]


def loop_round_by_round(src, rounds, players):
    """Loops through every round to extract information"""
    for count, round in enumerate(src):
        team = (
            round["teams"][0]
            if round["teams"][0]["name"] == "YOUR TEAM"
            else round["teams"][1]
        )
        rounds[count] = Round(
            number=round["roundNumber"],
            map=round["map"]["name"],
            site="0", #site=round["site"]
            side=get_side(src, round["roundNumber"]),
            won=team["won"],
            win_condition=get_win_condition(round),
        )
        get_match_feedback(round, players)
    get_KOST(src, players)


def get_win_condition(rnd):
    """Returns the condition in which the round was won(Elimination, Time Limit Reached, Defuser Planted, Defuser Disabled)"""
    if "winCondition" in rnd["teams"][0]:
        return rnd["teams"][0]["winCondition"]
    return rnd["teams"][1]["winCondition"]

def get_match_feedback(round, players):
    """Goes over the match feedback to calculate KOST, Entry engagements, plants, disables, multikills, 1vXs"""
    get_entry_engagements(round["matchFeedback"], players)
    get_multikills(round["stats"], players)
    get_clutches(round, players)
    get_plants(round["matchFeedback"], players)
    get_disables(round["matchFeedback"], players)

def get_entry_engagements(events, players):
    """Calculate entry kills and entry deaths"""
    entry_kill = True
    entry_death = True
    for event in events:
        if event["type"]["id"] == KILL_ID:
            if event["username"] in players and entry_kill:
                player = players[event["username"]]
                player.entry_kills += 1
                entry_kill = False
                
            if event["target"] in players and entry_death:
                player = players[event["target"]]
                player.entry_deaths += 1
                entry_death = False

def get_multikills(stats_table, players):
    """Calculate multikills"""
    for stat in stats_table:
        if stat["username"] in players and stat["kills"] >= 2:
            player = players[stat["username"]]
            player.multikills += 1

def get_plants(events, players):
    """Calculate defuser plants"""
    for event in events:
        if event["type"]["id"] == DEFUSER_PLANTED_ID and event["username"] in players:
            player = players[event["username"]]
            player.plants += 1
            
def get_disables(events, players):
    """Calculate defuser disables"""
    for event in events:
        if event["type"]["id"] == DEFUSER_DISABLED_ID and event["username"] in players:
            player = players[event["username"]]
            player.disables += 1

def get_clutches(round, players):
    """Calculates the number of rounds in which the player won after being left in a 1vX situation"""
    """WARNING:Should only be called if team of the recording player wins the round"""
    #players_alive = list(filter(survived, round["stats"]))
    players_alive = [player for player in round["stats"] if survived(round["stats"], player["username"])]
    if len(players_alive) == 1 and players_alive[0]["username"] in players:
        player = players[players_alive[0]["username"]]
        player.clutches += 1
        
def get_KOST(rounds, players):
    """Calculates KOST - number of rounds the player in question got a kill, played for the objective(planted or disabled defuser), 
    survived or got traded. divided by the total number of rounds"""
    kost = 0
    for player in players:
        for round in rounds:
            if was_killed(round["stats"], player) or completed_objective(round["matchFeedback"], player) or survived(round["stats"], player) or was_traded(round["matchFeedback"], players, player):
                kost += 1
        kost /= len(rounds)
        players[player].kost = format(kost, '.2f')
        
def was_killed(stats, player):
    """Returns True if the player got at least a kill"""
    for i in stats:
        if i["username"] == player:
            return False if i["kills"] == 0 else True
    return False

def completed_objective(events, player):
    """Returns True if the player planted or disabled the defuser"""
    for event in events:
        if (event["type"]["id"] == DEFUSER_DISABLED_ID or event["type"]["id"] == DEFUSER_PLANTED_ID) and event["username"] == player:
            return True
    return False

def survived(stats, player):
    """Returns True if the player survived the whole round"""
    for i in stats:
        if i["username"] == player:
            return False if i["died"] else True
    return False

def was_traded(events, players, player):
    """Returns True if the player got traded"""
    time = -1
    for event in events:
        if event["type"]["id"] == KILL_ID and event["target"] == player:
            time = event["timeInSeconds"]
            continue
        
        delta = time - event["timeInSeconds"]
        if not (event["type"]["id"] == KILL_ID and event["username"] in players):
            if delta > REFRAG_TIME_WINDOW:
                return False
            continue
    return True if delta <= REFRAG_TIME_WINDOW else False

if __name__ == "__main__":
    main()
