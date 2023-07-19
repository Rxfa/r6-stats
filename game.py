from dataclasses import dataclass

class Match:
    """Match information"""
    map: str
    score: tuple
    own_bans: tuple
    op_bans: tuple