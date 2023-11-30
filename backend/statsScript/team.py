from player import Player


class Team:
    def __init__(self, round_data, num):
        self.own_team: bool = (num == 0)
        self.score: int = round_data["teams"][num]["score"]
        self.won: bool = round_data["teams"][num]["won"]
        self.win_condition: str | None = round_data["teams"][num]["winCondition"] if self.won else None
        self.side: str = round_data["teams"][num]["role"]
        self.players: dict = self._get_players(round_data)

        self._get_individual_stats(round_data)

    def _get_players_usernames(self, players) -> list:
        if self.side == "Attack":
            return [i["username"] for i in players[:5]]
        return [i["username"] for i in players[5:]]

    def _get_players(self, data) -> dict:
        usernames: list = self._get_players_usernames(data["players"])
        starting_idx: int = 5 if self.side == "Attack" else 0
        return {
            name: Player(data, (starting_idx + idx)) for idx, name in enumerate(usernames)
        }

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

