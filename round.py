from dataclasses import dataclass

@dataclass
class Round:
    """
    Round information
    """
    map: str
    number: int
    site: str
    side: str
    won: bool
    win_condition: str
    