import uuid

from django.contrib.auth.models import User
from django.db.models import QuerySet, Sum, Count, Q, FloatField, F

from .models import Team, Player, Round, Replay


def get_games(user):
    return [
        GameSelector(match_id) for match_id in
        set(
            Round.objects
            .filter(replay__replay__uploaded_by=user)
            .values_list("match_id", flat=True)
        )
    ]


class PlayerRoundStatsSelector:
    def __init__(self, player):
        self.name = player.name
        self.spawn = player.spawn
        self.operator = player.operator
        self.kills = player.kills
        self.assists = player.assists
        self.headshots = player.headshots
        self.died = player.died
        self.opening_kill = player.opening_kill
        self.opening_death = player.opening_death
        self.entry_kill = player.entry_kill
        self.entry_death = player.entry_death
        self.refragged = player.refragged
        self.traded = player.traded
        self.planted = player.planted
        self.time_of_plant = player.time_of_plant
        self.disabled = player.disabled
        self.time_of_disable = player.time_of_disable
        self.kost = player.kost
        self.multikill = player.multikill


class RoundSelector:
    def __init__(self, round):
        team = Team.objects.filter(round=round, is_own=True).first()
        self.number = round.number
        self.score = ScoreSelector(round)
        self.won = team.won
        self.win_condition = team.win_condition
        self.timestamp = round.timestamp
        self.site = round.site
        self.players = [PlayerRoundStatsSelector(player) for player in Player.objects.filter(team=team)]


class BansSelector:
    def __init__(self, is_own, ATK, DEF):
        self.is_own: bool = is_own
        self.ATK: str = ATK
        self.DEF: str = DEF


class ScoreSelector:
    def __init__(self, queryset: QuerySet):
        self.own: int = queryset.own_score
        self.opp: int = queryset.opp_score


class PlayerStatsSelector:
    def __init__(self, player, data: tuple):
        (stats, rounds, kost, multikills) = data
        self.name: str = player.name
        self.rounds = rounds
        self.kills: int = stats["kills"]
        self.deaths: int = stats["deaths"]
        self.kd_diff: int = self.kills - self.deaths
        self.kd_ratio: float = self.kills / self.deaths
        self.kpr: float = self.kills / self.rounds
        self.assists: int = stats["assists"]
        self.headshots: int = stats["headshots"]
        self.hs_ratio: float = self.headshots / self.kills
        self.kost: float = kost
        self.opening_kills: int = stats["opening_kills"]
        self.opening_deaths: int = stats["opening_deaths"]
        self.opening_diff: int = self.opening_kills - self.opening_deaths
        self.entry_kills: int = stats["entry_kills"]
        self.entry_deaths: int = stats["entry_deaths"]
        self.entry_diff: int = self.entry_kills - self.entry_deaths
        self.refrags: int = stats["refrags"]
        self.trades: int = stats["trades"]
        self.plants: int = stats["plants"]
        self.disables: int = stats["disables"]
        self.multikills: int = multikills
        self.srv: float = (self.rounds - self.deaths) / self.rounds


class TeamStatsSelector:
    def __init__(self, team_stats: QuerySet):
        self.sites: list[SiteStatsSelector] = [SiteStatsSelector(*i) for i in team_stats]


class SiteStatsSelector:
    def __init__(self, site: str, plays: int, wins: int):
        self.site: str = site
        self.plays: int = plays
        self.wins: int = wins


def player_stats_aggregate(player: QuerySet) -> (dict, int, int, int):
    # len(team) also represents the number of rounds since every team object has a round as its FK
    rounds: int = len(player)
    kost: float = 0
    multikills: int = 0
    for i in player:
        kost += i.kost
        multikills += i.multikill
    return (
        (
            player
            .aggregate(
                kills=Sum("kills"),
                assists=Sum("assists"),
                deaths=Count("died", only=Q(died=True)),
                headshots=Sum("headshots"),
                opening_kills=Count("opening_kill", only=Q(opening_kill=True)),
                opening_deaths=Count("opening_death", only=Q(opening_death=True)),
                entry_kills=Count("entry_kill", only=Q(entry_kill=True)),
                entry_deaths=Count("entry_death", only=Q(entry_death=True)),
                refrags=Count("refragged", only=Q(refragged=True)),
                trades=Count("traded", only=Q(traded=True)),
                plants=Count("planted", only=Q(planted=True)),
                disables=Count("disabled", only=Q(disabled=True)),
            )
        ), rounds, kost, multikills
    )


class StatsSelector:
    def __init__(self, rounds: QuerySet):
        self.roundQuerySet: QuerySet = rounds
        self.team: dict = {
            "general": self.get_team_stats(),
            "atk": self.get_team_stats("attack"),
            "def": self.get_team_stats("defense")
        }
        self.individual: dict = {
            "general": self.get_player_stats(),
            "atk": self.get_player_stats("attack"),
            "def": self.get_player_stats("defense")
        }

    def get_team_stats(self, side: str | None = None) -> TeamStatsSelector | None:
        query: QuerySet = (
            Team.objects.filter(round__in=self.roundQuerySet, is_own=True)
            if side is None else
            Team.objects.filter(side__iexact=side, round__in=self.roundQuerySet, is_own=True)
        )
        if query:
            query: QuerySet = (
                query.values_list("round__site")
                .annotate(plays=Count("round__site"), wins=Count("won", only=Q(won=True)))
            )
            # TODO make it also return stats for win conditions
            obj = TeamStatsSelector(team_stats=query)
            return obj
        return None

    def get_player_stats(self, side: str | None = None) -> list[PlayerStatsSelector]:
        query: QuerySet = (
            Player.objects
            .filter(team__round__in=self.roundQuerySet, team__is_own=True)
            .annotate(
                # kost=(F("died") or F("planted") or F("disabled") or F("kills") or F("traded")),
                # multikills=F("kills"),
                # has to be annotated since it is a computed value
            )
            if not side else
            Player.objects
            .filter(team__round__in=self.roundQuerySet, team__is_own=True, team__side__iexact=side)
            .annotate(
                # kost=(F("died") or F("planted") or F("disabled") or F("kills") or F("traded")),
                # multikills=F("kills"),
                # has to be annotated since it is a computed value
            )
        )
        return [
            PlayerStatsSelector(
                player=Player.objects.filter(uid=player_uid).first(),
                data=player_stats_aggregate(Player.objects.filter(uid=player_uid, team__round__in=self.roundQuerySet))
            ) for player_uid in set(query.values_list("uid", flat=True))
        ]


class GameSelector:
    def __init__(self, game_id: uuid):
        data: QuerySet = Round.objects.filter(match_id=game_id).order_by("number")
        last_round: QuerySet = data.last()
        self.round: int = len(data)
        self.score: ScoreSelector = ScoreSelector(last_round)
        self.won: bool = self.score.own > self.score.opp
        self.draw: bool = self.score.own == self.score.opp
        self.map: str = last_round.map
        self.date: str = last_round.timestamp
        self.bans: list[BansSelector] = [
            BansSelector(is_own=True, ATK=last_round.own_atk_ban, DEF=last_round.own_def_ban),
            BansSelector(is_own=False, ATK=last_round.opp_atk_ban, DEF=last_round.opp_def_ban)
        ]
        self.rounds: list[RoundSelector] = [RoundSelector(round) for round in data]
        self.stats: StatsSelector = StatsSelector(data)


def rounds_list(fetched_by: User):
    return round_list_queryset(fetched_by)


def rounds_retrieve(fetched_by: User, match_id):
    return Round.objects.filter(replay__replay__uploaded_by=fetched_by, match_id=match_id)


def replay_list_queryset(fetched_by: User) -> QuerySet:
    return Replay.objects.filter(uploaded_by=fetched_by)


def replay_retrieve(fetched_by: User, uuid: uuid.UUID) -> QuerySet:
    return Replay.objects.filter(uploaded_by=fetched_by, uuid=uuid)


def replay_exists(fetched_by: User, uuid: uuid.UUID) -> bool:
    return replay_retrieve(fetched_by, uuid).exists()


def replay_destroy_queryset(fetched_by: User, id: uuid.UUID) -> QuerySet:
    return Replay.objects.filter(uploaded_by=fetched_by, uuid=id)


def round_list_queryset(fetched_by: User) -> QuerySet:
    return Round.objects.filter(replay__replay__uploaded_by=fetched_by)
