import json
from collections import namedtuple


class ReplayToJsonService:
    def __init__(self, file):
        self.file = file

    def transform(self):
        json_file = json.loads(self.file)
        return Round(json_file)


Score = namedtuple("Score", "own opp")


class Round:

    def __init__(self, data):
        if len(data["players"]) != 10:
            raise Exception("Round must be started with a full lobby(10 players)!")
        self.dateTime: str = data["timestamp"]
        self.match_id: str = data["matchID"]
        self.number: int = data["roundNumber"]
        self.recordingPlayerId: str = data["recordingProfileID"]
        self.map: str = data["map"]["name"]
        self.site: str = data["site"]
        self.teams: list = [Team(data, idx) for idx, _ in enumerate(data["teams"])]
        self.score: Score = Score(
            own=data["teams"][0]["score"],
            opp=data["teams"][1]["score"]
        )
        self.own_bans: str | None = None  # Not possible to get as of August 18th 2023
        self.opp_bans: str | None = None  # Not possible to get as of August 18th 2023


class Team:
    def __init__(self, round_data, team_idx):
        self.own_team: bool = (team_idx == 0)
        self.score: int = round_data["teams"][team_idx]["score"]
        self.won: bool = round_data["teams"][team_idx]["won"]
        self.win_condition: str | None = round_data["teams"][team_idx]["winCondition"] if self.won else None
        self.side: str = round_data["teams"][team_idx]["role"]
        self.players: dict = self._get_players(round_data, team_idx)
        self._get_individual_stats(round_data)

    def _get_players(self, data, team_idx) -> dict:
        players = dict()
        for idx, player in enumerate(data["players"]):
            if player["teamIndex"] == team_idx:
                players[player["username"]] = Player(data["stats"][idx], player)
        return players

    def _get_individual_stats(self, round_data) -> None:
        self._get_entries(round_data)
        self._get_openings(round_data)
        self._get_objective_plays(round_data)
        return

    def _get_entries(self, data) -> None:
        # TODO: Reduce the number of if statements and simplify this
        is_entry_kill: bool = True
        is_entry_death: bool = True
        for event in data["matchFeedback"]:
            if not is_entry_kill and not is_entry_death:
                return
            if event["type"]["name"] == "Death":
                if event["target"] in self.players and is_entry_death:
                    is_entry_death = False
                    self.players[event["username"]].entry_death = True
            if event["type"]["name"] == "Kill":
                if event["username"] in self.players and is_entry_kill:
                    is_entry_kill = False
                    self.players[event["username"]].entry_kill = True
                if event["target"] in self.players and is_entry_death:
                    is_entry_death = False
                    self.players[event["target"]].entry_death = True

    def _get_openings(self, data) -> None:
        # TODO: Simplify this
        is_opening_kill: bool = True
        is_opening_death: bool = True
        for event in data["matchFeedback"]:
            if event["type"]["name"] == "Death" and event["target"] in self.players and is_opening_death:
                is_opening_death = False
                self.players[event["target"]].opening_death = True
            if event["type"]["name"] == "Kill":
                if event["username"] in self.players and is_opening_kill:
                    is_opening_kill = False
                    self.players[event["username"]].opening_kill = True
                if event["target"] in self.players and is_opening_death:
                    is_opening_death = False
                    self.players[event["target"]].opening_death = True
            if not is_opening_death and not is_opening_death:
                return

    def _get_refrags_and_trades(self, data) -> None:
        killed_player: str | None = None
        time_of_death: int | None = None
        for event in data["matchFeedback"]:
            event_type = event["type"]["name"]
            if event_type == "Kill":
                if event["target"] in self.players and event["username"] not in self.players:
                    killed_player = event["target"]
                    time_of_death = event["timeInSeconds"]
                if (
                        event["username"] in self.players and
                        event["target"] not in self.players and
                        self._isTrade(time_of_death, event["timeInSeconds"])
                ):
                    self.players[killed_player].traded = True
                    self.players[event["username"]].refragged = True

    def _get_objective_plays(self, data) -> None:
        for event in data["matchFeedback"]:
            event_type = event["type"]["name"]
            if event_type == "DefuserPlantComplete" and event["username"] in self.players:
                player = self.players[event["username"]]
                player.planted = True
                player.time_of_plant = event["timeInSeconds"]
            if event_type == "DefuserDisableComplete" and event["username"] in self.players:
                player = self.players[event["username"]]
                player.disabled = True
                player.time_of_disable = event["timeInSeconds"]

    def _isTrade(self, event1, event2) -> bool:
        REFRAG_TIME_WINDOW: int = 10
        return event1 - event2 <= REFRAG_TIME_WINDOW


class Player:
    def __init__(self, player_scoreboard, player_data):
        self.name: str = player_data["username"]
        self.uid: str = player_data["profileID"]
        self.spawn: str | None = player_data["spawn"] if "spawn" in player_data else None
        self.operator: str = player_data["operator"]["name"]
        self.kills: int = player_scoreboard["kills"]
        self.assists: int = player_scoreboard["assists"]
        self.headshots: int = player_scoreboard["headshots"]
        self.died: bool = player_scoreboard["died"]
        self.opening_kill: bool = False
        self.opening_death: bool = False
        self.entry_kill: bool = False
        self.entry_death: bool = False
        self.traded: bool = False
        self.refragged: bool = False
        self.planted: bool = False
        self.time_of_plant: int | None = None
        self.disabled: bool = False
        self.time_of_disable: int | None = None
        self.kost: bool = (
                self.kills > 0 or (not self.died) or self.planted or self.disabled or self.traded
        )
        self.multikill: bool = self.kills > 0
