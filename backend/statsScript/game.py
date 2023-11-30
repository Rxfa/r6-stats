from collections import namedtuple
from tabulate import tabulate
from utils import is_own_team, is_opp_team, get_side, ID, print3n
from player import Player
from round import Round

Score = namedtuple("Score", "own opp")


class Match:
    def __init__(self, data):
        self.map: str = data["rounds"][0]["map"]["name"]
        self.score: Score = Score(
            own=data["rounds"][-1]["teams"][0]["score"],
            opp=data["rounds"][-1]["teams"][1]["score"]
        )
        self.own_bans: str | None = None  # Not possible to get as of august 18th 2023
        self.opp_bans: str | None = None  # Not possible to get as of august 18th 2023
        self.rounds: list = [Round(rnd) for rnd in data["rounds"]]
