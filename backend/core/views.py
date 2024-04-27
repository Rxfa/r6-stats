from django.db import IntegrityError
from rest_framework import mixins
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import RoundReplay
from .selectors import (
    list_games,
    list_games_by_map,
    retrieve_game,
    replay_list_queryset,
    replay_exists, list_rounds
)
from .serializers import (RoundListUploadSerializer, ReplaySerializer, GameSerializer,
                          RoundListSerializer)
from .services.replays import ReplayService, GameService
from .services.round_replays import RoundReplayService


class GameViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    lookup_field = 'match_id'

    def list(self, request, *args, **kwargs):
        map_query = self.request.query_params.get('map')
        queryset = (
            list_games_by_map(self.request.user, map_query)
            if map_query is not None else
            list_games(self.request.user)
        )
        serializer = GameSerializer(queryset, many=True)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        queryset = retrieve_game(self.request.user, self.kwargs['match_id'])
        serializer = GameSerializer(queryset, many=False)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        try:
            GameService(self.request.user, self.kwargs["match_id"]).destroy()
            return Response("Game deleted successfully", status=status.HTTP_200_OK)
        except:
            return Response({"error": "Replay could not be deleted"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RoundViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        map_query: bool = self.request.query_params.get("map") == "true"
        result_query: str = self.request.query_params.get("won")
        queryset = list_rounds(self.request.user, map_query, result_query)
        serializer = RoundListSerializer(queryset)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)


class FileUploadViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin
):
    queryset = RoundReplay.objects.all()
    serializer_class = RoundListUploadSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsAuthenticated]
    lookup_field = "uuid"

    def list(self, request, *args, **kwargs):
        queryset = replay_list_queryset(self.request.user)
        serialized_data = ReplaySerializer(queryset, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = RoundListUploadSerializer(data=request.data)
        if serializer.is_valid():
            try:
                RoundReplayService(self.request.user).create(self.request.FILES.getlist("rounds"))
            except IntegrityError:
                return Response({"error": "Round already exists"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": "Failed to save files", "description": str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"message": "Replays uploaded successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        uuid = kwargs.get("uuid")
        user = self.request.user
        if replay_exists(user, uuid):
            try:
                ReplayService(user).destroy(uuid)
                return Response("Replay deleted successfully", status=status.HTTP_200_OK)
            except:
                return Response({"error": "Replay could not be deleted"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": "Replay not found"}, status=status.HTTP_404_NOT_FOUND)
