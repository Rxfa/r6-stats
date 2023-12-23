from django.db import transaction
from ..models import Player, RoundReplay, Round, Team, Replay
import subprocess

from .ReplayToJsonService import ReplayToJsonService


class RoundReplayService:
    def __init__(self, user):
        self.user = user

    @transaction.atomic
    def create(self, files):
        try:
            with transaction.atomic():
                replay_instance = Replay.objects.create(uploaded_by=self.user)
                for file in files:
                    round_replay_instance = RoundReplay.objects.create(replay=replay_instance, file=file)
                    round_data = r6_dissect(round_replay_instance.file.path)
                    round_instance = create_round(round_replay_instance, round_data)
                    for team in round_data.teams:
                        team_instance = create_team(round_instance, team)
                        for player in team.players.values():
                            create_player(team_instance, player)
        except Exception as e:
            raise e


def r6_dissect(file):
    cmd = subprocess.run(
        ["core/scripts/r6-dissect/r6-dissect", file, "-x", "stdout"],
        capture_output=True,
        text=True
    )
    return ReplayToJsonService(cmd.stdout).transform()


def create_round(round_replay_instance, round_data) -> Round:
    return Round.objects.create(
        replay=round_replay_instance,
        dateTime=round_data.dateTime,
        match_id=round_data.match_id,
        map=round_data.map,
        number=round_data.number,
        own_score=round_data.score.own,
        opp_score=round_data.score.opp,
        site=round_data.site,
    )


def create_team(round_instance, team_data) -> Team:
    return Team.objects.create(
        round=round_instance,
        is_own=team_data.own_team,
        score=team_data.score,
        won=team_data.won,
        win_condition=team_data.win_condition,
        side=team_data.side
    )


def create_player(team_instance, player_data) -> Player:
    return Player.objects.create(
        team=team_instance,
        name=player_data.name,
        uid=player_data.uid,
        spawn=player_data.spawn,
        operator=player_data.operator,
        headshots=player_data.headshots,
        kills=player_data.kills,
        assists=player_data.assists,
        died=player_data.died,
        opening_kill=player_data.opening_kill,
        opening_death=player_data.opening_death,
        entry_kill=player_data.entry_kill,
        entry_death=player_data.entry_death,
        refragged=player_data.refragged,
        traded=player_data.traded,
        planted=player_data.planted,
        time_of_plant=player_data.time_of_plant,
        disabled=player_data.disabled,
        time_of_disable=player_data.time_of_disable,
        kost=player_data.kost,
        multikill=player_data.multikill
    )
