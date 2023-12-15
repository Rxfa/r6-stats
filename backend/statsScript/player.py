class Player:
    def __init__(self, round_data, idx):
        self.name: str = round_data["players"][idx]["username"]
        self.uid: str = round_data["players"][idx]["profileID"]
        self.spawn: str | None = round_data["players"][idx]["spawn"] if "spawn" in round_data["players"][idx] else None
        self.operator: str = round_data["players"][idx]["operator"]["name"]
        self.kills: int = round_data["stats"][idx]["kills"]
        self.assists: int = round_data["stats"][idx]["assists"]
        self.headshots: int = round_data["stats"][idx]["headshots"]
        self.died: bool = round_data["stats"][idx]["died"]
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
