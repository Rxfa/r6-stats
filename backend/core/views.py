from datetime import timezone

from django.db import transaction
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from .models import RoundReplay, Round, Team, Player
from .serializers import (
    RoundListUploadSerializer, RoundSerializer, TeamSerializer, PlayerSerializer
)
from .services.RoundReplayService import RoundReplayService


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Round.objects.all()
    lookup_field = 'match_id'
    serializer_class = RoundSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["map", "own_atk_ban", "own_def_ban", "opp_atk_ban", "opp_def_ban", "dateTime"]

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

    def create(self, request, *args, **kwargs):
        serializer = RoundListUploadSerializer(data=request.data)
        if serializer.is_valid():
            try:
                RoundReplayService(self.request.user, serializer.validated_data).create()
            except:
                return Response(
                    {"error": "Failed to save files",},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
