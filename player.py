from dataclasses import dataclass

@dataclass
class Player:
    """
    Player information
    """
    name: str
    rounds: int
    kills: int = 0
    deaths: int = 0
    assists: int = 0
    entry_kills: int = 0
    entry_deaths: int = 0
    refrags: int = 0
    trades: int = 0
    clutches: int = 0
    multikill: int = 0
    plants: int = 0
    disables: int = 0
    kost: float = 0
