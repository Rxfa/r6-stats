from datetime import timezone

from django.db import transaction
from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from itertools import groupby
from .scripts import r6_dissect
from .models import RoundReplay, Round, Team, Player
from .serializers import (
    RoundListUploadSerializer, RoundSerializer, TeamSerializer, PlayerSerializer
)


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Round.objects.all()
    lookup_field = 'match_id'
    serializer_class = RoundSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        rounds_uploaded_by_user = RoundReplay.objects.filter(uploaded_by=self.request.user)
        queryset = self.get_queryset().filter(replay__in=rounds_uploaded_by_user)
        serialized_data = {}
        match_ids = Round.objects.values_list("match_id", flat=True).distinct()
        for id in match_ids:
            rounds = queryset.filter(match_id=id)
            serialized_data[id] = self.serializer_class(rounds, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        match_id = self.kwargs["match_id"]
        rounds_uploaded_by_user = RoundReplay.objects.filter(uploaded_by=self.request.user)
        rounds = (
                self.get_queryset().filter(match_id=match_id) &
                self.get_queryset().filter(replay__in=rounds_uploaded_by_user)
        )
        serialized_data = self.serializer_class(rounds, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)


class FileUploadViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    queryset = RoundReplay.objects.all()
    serializer_class = RoundListUploadSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = RoundListUploadSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    for file in request.FILES.getlist('rounds'):
                        round_replay_instance = RoundReplay.objects.create(uploaded_by=self.request.user, file=file)
                        round_data = r6_dissect.r6_dissect(round_replay_instance.file.path)
                        round_instance = self.create_round(round_replay_instance, round_data)
                        for team in round_data.teams:
                            team_instance = self.create_team(round_instance, team)
                            for player in team.players.values():
                                self.create_player(team_instance, player)
            except Exception as e:
                return Response(
                    {
                        "error": "Failed to save files",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create_round(self, round_replay_instance, round_data):
        rnd = Round.objects.create(
            replay=round_replay_instance, dateTime=round_data.dateTime, match_id=round_data.match_id,
            number=round_data.number, own_score=round_data.score.own, opp_score=round_data.score.opp,
            site=round_data.site,
        )
        return rnd

    def create_team(self, round_instance, team_data):
        team = Team.objects.create(
            round=round_instance, is_own=team_data.own_team, score=team_data.score,
            won=team_data.won, win_condition=team_data.win_condition,
            side=team_data.side
        )
        return team

    def create_player(self, team_instance, player_data):
        Player.objects.create(
            team=team_instance, name=player_data.name, uid=player_data.uid,
            spawn=player_data.spawn,
            operator=player_data.operator,
            headshots=player_data.headshots,
            kills=player_data.kills, assists=player_data.assists, died=player_data.died,
            opening_kill=player_data.opening_kill, opening_death=player_data.opening_death,
            entry_kill=player_data.entry_kill, entry_death=player_data.entry_death,
            refragged=player_data.refragged, traded=player_data.traded,
            planted=player_data.planted, time_of_plant=player_data.time_of_plant,
            disabled=player_data.disabled, time_of_disable=player_data.time_of_disable
        )
