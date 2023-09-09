from dataclasses import dataclass

@dataclass
class Round:
    number: int
    map: str
    site: str
    side: str
    won: bool
    win_condition: str
