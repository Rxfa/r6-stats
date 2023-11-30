from team import Team


class Round:

    def __init__(self, round_data):
        self.number: int = round_data["roundNumber"]
        self.timestamp: str = round_data["timestamp"]
        self.game_mode: str = round_data["gamemode"]["name"]
        self.site: str = round_data["site"]
        self.teams: list = [Team(round_data, idx) for idx, _ in enumerate(round_data["teams"])]
