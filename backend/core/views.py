from datetime import timezone

from django.db import transaction, IntegrityError
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from rest_framework.viewsets import ModelViewSet

from .models import RoundReplay, Round, Team, Player
from .serializers import (
    RoundListUploadSerializer, RoundSerializer, TeamSerializer, PlayerSerializer,
    RoundFilterSerializer, TeamFilterSerializer
)
from .services.RoundReplayService import RoundReplayService
from .selectors import *

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Round.objects.all()
    lookup_field = 'match_id'
    serializer_class = RoundSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = round_list_queryset(request.user)
        match_ids = Round.objects.all().values_list("match_id", flat=True).distinct()
        serialized_data = {
            i: self.serializer_class(queryset, many=True).data for i in match_ids
        }
        return Response(serialized_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        rounds = rounds_retrieve(self.request.user, self.kwargs["match_id"])
        serialized_data = self.serializer_class(rounds, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

class RoundViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = round_list_queryset(self.request.user)
        serialized_data = self.serializer_class(queryset, many=True).data
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
                RoundReplayService(self.request.user, self.request.FILES.getlist("rounds")).create()
            except IntegrityError:
                return Response(
                    {"error": "Round already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": "Failed to save files", "description": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
