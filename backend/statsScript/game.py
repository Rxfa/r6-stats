from collections import namedtuple
from round import Round

Score = namedtuple("Score", "own opp")


class Game:
    def __init__(self, data):
        if len(data["rounds"][0]["players"]) != 10:
            raise Exception("Game must be started with a full lobby(10 players)!")

        self.game_mode: str = data["rounds"][0]["gamemode"]["name"]
        self.map: str = data["rounds"][0]["map"]["name"]
        self.score: Score = Score(
            own=data["rounds"][-1]["teams"][0]["score"],
            opp=data["rounds"][-1]["teams"][1]["score"]
        )
        self.own_bans: str | None = None  # Not possible to get as of august 18th 2023
        self.opp_bans: str | None = None  # Not possible to get as of august 18th 2023
        self.rounds: list = [Round(rnd) for rnd in data["rounds"]]
