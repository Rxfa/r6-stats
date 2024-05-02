from django.db import IntegrityError
from rest_framework import mixins
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import RoundReplay, Vod
from core.selectors import (
    list_games,
    retrieve_game,
    replay_list_queryset,
    replay_exists, list_rounds, game_exists, vod_exists, list_vods, list_individual_stats
)
from core.serializers import (
    RoundListUploadSerializer,
    ReplaySerializer,
    GameDetailSerializer,
    RoundListSerializer, VodSerializer, VodListSerializer, GameListSerializer, IndividualSerializer
)
from core.services.replays import ReplayService, GameService
from core.services.round_replays import RoundReplayService
from core.services.vods import VodService


class GameViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    lookup_field = 'match_id'

    def list(self, request, *args, **kwargs):
        queryset = list_games(self.request.user)
        serializer = GameListSerializer(queryset, many=True)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        match_id = self.kwargs['match_id']
        user = self.request.user
        if game_exists(user, match_id):
            queryset = retrieve_game(match_id)
            serializer = GameDetailSerializer(queryset, many=False)
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_200_OK)
        return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        uuid = self.kwargs["match_id"]
        user = self.request.user
        if game_exists(user, uuid):
            try:
                GameService(user, uuid).destroy()
                return Response("Game deleted successfully", status=status.HTTP_200_OK)
            except:
                return Response({"error": "Replay could not be deleted"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)


class RoundViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = list_rounds(self.request.user)
        serializer = RoundListSerializer(queryset)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)


class IndividualViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = list_individual_stats(self.request.user)
        serializer = IndividualSerializer(queryset, many=False)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)


class VodViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin
):
    queryset = Vod.objects.all()
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def list(self, request, *args, **kwargs):
        queryset = list_vods(self.request.user)
        serializer = VodListSerializer(queryset, many=True)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = VodSerializer(data=request.data)
        if serializer.is_valid():
            try:
                VodService(self.request.user).create(serializer.data)
            except IntegrityError:
                return Response({"error": "Vod already exists"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response(
                    {"error": "Failed to save files", "description": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response({"message": "Vod uploaded successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        id = kwargs.get("id")
        user = self.request.user
        if vod_exists(user, id):
            serializer = VodSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    VodService(user).update(id, serializer.data)
                    return Response("Vod updated successfully", status=status.HTTP_200_OK)
                except:
                    return Response({"error": "Vod could not be updated"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Vod not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        id = kwargs.get("id")
        user = self.request.user
        if vod_exists(user, id):
            try:
                VodService(user).destroy(id)
                return Response(status=status.HTTP_204_NO_CONTENT)
            except:
                return Response({"error": "Vod could not be deleted"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": "Vod not found"}, status=status.HTTP_404_NOT_FOUND)


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
