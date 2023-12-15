from collections import namedtuple
from .team import *

Score = namedtuple("Score", "own opp")


class Round:

    def __init__(self, data):
        if len(data["players"]) != 10:
            raise Exception("Round must be started with a full lobby(10 players)!")
        self.dateTime: str = data["timestamp"]
        self.match_id: str = data["matchID"]
        self.number: int = data["roundNumber"]
        self.recordingPlayerId: str = data["recordingPlayerID"]
        self.map: str = data["map"]
        self.site: str = data["site"]
        self.teams: list = [Team(data, idx) for idx, _ in enumerate(data["teams"])]
        self.score: Score = Score(
            own=data["teams"][0]["score"],
            opp=data["teams"][1]["score"]
        )
        self.own_bans: str | None = None  # Not possible to get as of August 18th 2023
        self.opp_bans: str | None = None  # Not possible to get as of August 18th 2023
