def is_own_team(team):
    """Returns true if team arguments is the team of the recording player"""
    return True if team["name"] == "YOUR TEAM" else False

def is_opp_team(team):
    """Returns true if team arguments is not the team of the recording player"""
    return True if team["name"] == "OPPONENTS" else False