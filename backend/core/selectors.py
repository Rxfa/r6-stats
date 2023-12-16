from django.contrib.auth.models import User
from django.db.models import QuerySet
import django_filters

from .models import Round, RoundReplay, Team, Player


def rounds_list(fetched_by: User):
    return round_list_queryset(fetched_by)


def rounds_retrieve(fetched_by: User, match_id):
    return round_get_queryset(fetched_by, match_id)


def replay_list_queryset(fetched_by: User) -> QuerySet:
    return RoundReplay.objects.filter(uploaded_by=fetched_by)


def round_list_queryset(fetched_by: User) -> QuerySet:
    return Round.objects.filter(replay__in=replay_list_queryset(fetched_by))


def round_list_by_map_queryset(fetched_by: User, maps: list[str]) -> QuerySet:
    return round_list_queryset(fetched_by) & Round.objects.filter(map__in=maps)


def round_list_by_result_queryset(fetched_by: User, is_win: bool) -> QuerySet:
    ids = Team.objects.filter(is_own=True, won=is_win).values_list('round', flat=True)
    return round_list_queryset(fetched_by) & Round.objects.filter(replay_id__in=ids)


def round_get_queryset(fetched_by: User, match_id) -> QuerySet:
    return round_list_queryset(fetched_by) & Round.objects.filter(match_id=match_id)


def own_team_players_list_queryset(fetched_by: User) -> QuerySet:
    return Player.objects.filter(team__in=Team.objects.filter(is_own=True))


def own_team_players_get_queryset(fetched_by: User, match_id) -> QuerySet:
    team = (
            Team.objects.filter(round__in=Round.objects.filter(match_id=match_id)) &
            Team.objects.filter(is_own=True)
    )
    return Player.objects.filter(team=team)


def own_team_player_get_queryset(fetched_by: User, player_uid) -> QuerySet:
    return own_team_players_list_queryset(fetched_by) & Player.objects.filter(uid=player_uid)
