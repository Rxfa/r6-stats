from dataclasses import dataclass

@dataclass
class Round:
    """
    Round information
    """
    number: int
    map: str
    site: str
    side: str
    won: bool
    win_condition: str
    