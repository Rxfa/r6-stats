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
        self.players: dict = dict()
        self._get_players(round_data, team_idx)
        self._get_individual_stats(round_data)

    def _get_players(self, data, team_idx) -> dict:
        players = dict()
        for idx, player in enumerate(data["players"]):
            if player["teamIndex"] == team_idx:
                players[player["username"]] = Player(data["stats"][idx], player)
        self.players = players

    def _get_individual_stats(self, round_data) -> None:
        self._get_entries(round_data)
        self._get_openings(round_data)
        self._get_refrags_and_trades(round_data)
        self._get_objective_plays(round_data)
        return

    def _get_entries(self, data) -> None:
        # TODO: Reduce the number of if statements and simplify this
        is_entry_kill = True
        is_entry_death = True
        for event in data["matchFeedback"]:
            if not is_entry_kill and not is_entry_death:
                return
            if event["type"]["name"] == "Death":
                if self._is_teammate_death(event) and is_entry_death:
                    is_entry_death = False
                    self.players[event["username"]].entry_death = True
            if event["type"]["name"] == "Kill":
                if self._is_teammate_kill(event) and is_entry_kill:
                    is_entry_kill = False
                    self.players[event["username"]].entry_kill = True
                if self._is_teammate_death(event) and is_entry_death:
                    is_entry_death = False
                    self.players[event["target"]].entry_death = True

    def _get_openings(self, data) -> None:
        # TODO: Simplify this
        is_opening_kill = True
        is_opening_death = True
        for event in data["matchFeedback"]:
            if event["type"]["name"] == "Death" and self._is_teammate_death(event) and is_opening_death:
                is_opening_death = False
                self.players[event["target"]].opening_death = True
            if event["type"]["name"] == "Kill":
                if self._is_teammate_kill(event) and is_opening_kill:
                    is_opening_kill = False
                    self.players[event["username"]].opening_kill = True
                if self._is_teammate_death(event) and is_opening_death:
                    is_opening_death = False
                    self.players[event["target"]].opening_death = True
            if not is_opening_death and not is_opening_death:
                return

    def _get_refrags_and_trades(self, data) -> None:
        killed_player: str | None = None
        time_of_death: int | None = None
        for event in data["matchFeedback"]:
            if event["type"]["name"] == "Kill":
                if self._is_enemy_kill(event) and self._is_teammate_death(event):
                    killed_player = event["target"]
                    time_of_death = event["timeInSeconds"]
                if (
                        self._is_teammate_kill(event) and
                        self._is_enemy_death(event) and
                        _is_trade(time_of_death, event["timeInSeconds"])
                ):
                    self.players[killed_player].traded = True
                    self.players[event["username"]].refragged = True
                    killed_player = None
                    time_of_death = None

    def _is_teammate_kill(self, event) -> bool:
        return event["username"] in self.players

    def _is_teammate_death(self, event) -> bool:
        return event["target"] in self.players

    def _is_enemy_kill(self, event) -> bool:
        return event["username"] not in self.players

    def _is_enemy_death(self, event) -> bool:
        return event["target"] not in self.players

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


def _is_trade(event1_time, event2_time) -> bool:
    # Time goes from 180 to 0 seconds, so event1 that happened before event2 actually has a higher time
    if event1_time is None or event2_time is None:
        return False
    if event1_time < event2_time:
        raise ValueError("Event 1 must happen before event 2")
    refrag_time_window: int = 10
    return (event1_time - event2_time) <= refrag_time_window
