"""Main file"""
import argparse
import json
import os
from dataclasses import asdict
from pprint import pprint
from player import Player
from game import Match
from round import Round


def main():
    """Main function"""
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
        
def stats(data):
    """calculate match stats"""
    map = data["rounds"][0]["map"]["name"]
    starting_side = get_starting_side(data)
    print(starting_side)
    team_players = get_team_players(data["rounds"][0], starting_side)
    rounds = []
    players = {x: Player(name=x, rounds=len(data["rounds"])) for x in team_players}
    calculate_kda(data["stats"], players)
    for i in players.values():
        pprint(i)
    

def get_starting_side(src):
    """Returns starting side of the team of the recording player"""
    def aux(team):
       return True if team["name"] == "YOUR TEAM" else False
    try:
        return list(filter(aux, src["rounds"][0]["teams"]))[0]["role"]
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
    
if __name__ == "__main__":
    main()
