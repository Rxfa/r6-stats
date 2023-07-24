"""Main file"""
import argparse
import json
import os
import time
from dataclasses import asdict
from pprint import pprint
from player import Player
from game import Match
from round import Round


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
        stats(data)
        elapsed = time.process_time() - t
        print(f"Time of execution - {elapsed}s")


def stats(data):
    """calculate match stats"""
    played_map = data["rounds"][0]["map"]["name"]
    starting_side = get_side(data["rounds"])
    team_players = get_team_players(data["rounds"][0], starting_side)
    rounds = dict()
    players = {x: Player(name=x, rounds=len(data["rounds"])) for x in team_players}
    calculate_kda(data["stats"], players)
    round_by_round(data["rounds"], rounds, players)
    for i in players.values():
        pprint(i)


def get_side(src, number=0):
    """Returns starting side of the team of the recording player"""

    def check_team(team):
        """Returns true if team arguments is the team of the recording player"""
        return True if team["name"] == "YOUR TEAM" else False

    try:
        return list(filter(check_team, src[number]["teams"]))[0]["role"]
    except IndexError as err:
        print("Runtime error:", err)


def get_team_players(src, side):
    """Returns list of players in the same team as the recording player"""
    if side == "Attack":
        return [x["username"] for x in src["players"][5:]]
    return [x["username"] for x in src["players"][:5]]


def calculate_kda(src, players):
    """Updates Kills, Deaths and Assists for every player on the same team as the recording player"""
    for i in src:
        if i["username"] in players.keys():
            player = players[i["username"]]
            player.rounds = i["rounds"]
            player.kills = i["kills"]
            player.deaths = i["deaths"]
            player.assists = i["assists"]


def round_by_round(src, rounds, players):
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
            site=round["site"],
            side=get_side(src, round["roundNumber"]),
            won=team["won"],
            win_condition=win_condition(round),
        )
        match_feedback(round["matchFeedback"], players)


def win_condition(rnd):
    """Returns the condition in which the round was won(Elimination, Time Limit Reached, Defuser Planted, Defuser Disabled)"""
    if "winCondition" in rnd["teams"][0]:
        return rnd["teams"][0]["winCondition"]
    return rnd["teams"][1]["winCondition"]

def match_feedback(events, players):
    """Goes over the match feedback to calculate KOST, Entry engagements, plants, disables, multikills, 1vXs"""
    KILL_ID = 0
    DEATH_ID = 1
    DEFUSER_PLANT_START_ID = 2
    DEFUSER_PLANTED_ID = 3
    DEFUSER_DISABLED_ID = -1 #TODO: Find out the ID
    LOCATE_OBJECTIVE_ID = 6
    OPERATOR_SWAP_ID = 7
    OTHER_ID = 10
    entry_kill = True
    entry_death = True
    time = -1
    for idx, event in enumerate(events):
        if event["type"]["id"] == KILL_ID:
            
            if event["username"] in players:
                player = players[event["username"]]
                if entry_kill:
                    player.entry_kills += 1
                    entry_kill = False
                else:
                    player.multikills += 1
                
            if event["target"] in players:
                player = players[event["target"]]
                if entry_death:
                    player.entry_deaths += 1
                    entry_death = False
                #to calculate trades and refrags
                #time = event["timeInSeconds"]
                
        if event["type"]["id"] == DEFUSER_PLANTED_ID and event["username"] in players:
            player = players[event["username"]]
            player.plants += 1
            
        if event["type"]["id"] == DEFUSER_DISABLED_ID and event["username"] in players:
            player = players[event["username"]]
            player.disables += 1
    return None

def calculate_KOST():
    """Calculates KOST - number of rounds the player in question got a kill, played for the objective(planted or disabled defuser), 
    survived or got traded. divided by the total number of rounds"""
    #TODO
    return None

def calculate_clutches(round, players):
    """Calculates the number of rounds in which the player won after being left in a 1vX situation"""
    
    """WARNING:Should only be called if team of the recording player wins the round"""
    players_alive = list(filter(survived, round["stats"]))
    if len(players_alive) == 1:
        player = players[players_alive[0]["username"]]
        player.clutches += 1

def survived(player):
    """Returns True if the player survived the whole round"""
    return False if player["died"] else True

if __name__ == "__main__":
    main()
