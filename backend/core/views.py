from datetime import timezone

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework.views import APIView
from .scripts import r6_dissect
from .models import RoundReplay, GameReplay, Round, Team, Player
from .serializers import RoundListUploadSerializer, RoundUploadSerializer


class FileUploadViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    queryset = RoundReplay.objects.all()
    serializer_class = RoundListUploadSerializer
    parser_classes = (MultiPartParser, FormParser)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = RoundListUploadSerializer(data=request.data)
        if serializer.is_valid():
            files = request.FILES.getlist('rounds')
            try:
                with transaction.atomic():
                    game_obj = GameReplay.objects.create(uploaded_by=self.request.user)
                    for file in files:
                        roundReplay = RoundReplay.objects.create(game=game_obj, file=file)
                        round_obj = r6_dissect.r6_dissect(roundReplay.file.path)
                        round_instance = Round.objects.create(
                            replay=roundReplay,
                            dateTime=round_obj.dateTime,
                            match_id=round_obj.match_id,
                            number=round_obj.number,
                            own_score=round_obj.score.own,
                            opp_score=round_obj.score.opp,
                            site=round_obj.site,
                        )

                        for team in round_obj.teams:
                            team_instance = Team.objects.create(
                                round=round_instance,
                                is_own=team.own_team,
                                score=team.score,
                                won=team.won,
                                win_condition=team.win_condition,
                                side=team.side
                            )

                            for player in team.players.values():
                                Player.objects.create(
                                    team=team_instance,
                                    name=player.name,
                                    uid=player.uid,
                                    spawn=player.spawn,
                                    operator=player.operator,
                                    kills=player.kills,
                                    assists=player.assists,
                                    headshots=player.headshots,
                                    died=player.died,
                                    opening_kill=player.opening_kill,
                                    opening_death=player.opening_death,
                                    entry_kill=player.entry_kill,
                                    entry_death=player.entry_death,
                                    refragged=player.refragged,
                                    traded=player.traded,
                                    planted=player.planted,
                                    time_of_plant=player.time_of_plant,
                                    disabled=player.disabled,
                                    time_of_disable=player.time_of_disable
                                )

            except Exception as e:
                print(e)
                return Response({"error": "Failed to save files"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
