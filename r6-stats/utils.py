import functools
import time
from enum import Enum
    
class ID(Enum):
    KILL_ID = 0
    DEATH_ID = 1
    DEFUSER_PLANT_START_ID = 2
    DEFUSER_PLANTED_ID = 3
    DEFUSER_DISABLED_ID = -1 #TODO: Find out the ID
    LOCATE_OBJECTIVE_ID = 6
    OPERATOR_SWAP_ID = 7
    OTHER_ID = 10

def timer(func):
    @functools.wraps(func)
    def wrapper_timer(*args, **kwargs):
        start_time = time.perf_counter()
        value = func(*args, **kwargs)
        end_time = time.perf_counter()
        run_time = end_time - start_time
        print(f"Finished {func.__name__!r} in {run_time:.4f} secs")
        return value
    return wrapper_timer

def is_own_team(team):
    """Returns true if team arguments is the team of the recording player"""
    return True if team["name"] == "YOUR TEAM" else False

def is_opp_team(team):
    """Returns true if team arguments is not the team of the recording player"""
    return True if team["name"] == "OPPONENTS" else False

def get_side(src, number=0):
    """Returns side of the team of the recording player"""
    try:
        return list(filter(is_own_team, src["rounds"][number]["teams"]))[0]["role"]
    except IndexError as err:
        print("Runtime error:", err)
