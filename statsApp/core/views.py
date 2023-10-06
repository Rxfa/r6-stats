import json
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from urllib.parse import urlparse
import statsScript.main as statsScript
from .serializers import UserSerializer, GameSerializer, UploadSerializer, RoundSerializer, OperatorSerializer, MapSerializer
from .models import Game, JSONUpload, Round, Player, Map, Operator
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.prefetch_related("games").order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class GameViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows games to be added.
    """
    #TODO: Change the queryset to return only games played by the user
    queryset = Game.objects.prefetch_related("rounds", "stats")
    serializer_class = GameSerializer
    permissions_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["date", "id", "map", "own_score", "opp_score", "own_atk_ban", "own_def_ban", "opp_atk_ban", "opp_def_ban"]
    ordering_fields = ["date", "id", "map"]
    ordering = "date"

class UploadViewSet(viewsets.ModelViewSet):
    queryset = JSONUpload.objects.all().order_by("-upload_date")
    serializer_class = UploadSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
        file_path = f".{urlparse(serializer.data['file']).path}"
        json_obj = json.loads(statsScript.main(file_path))
        self.create_game(json_obj)
        
    def create_game(self, obj):
        print(obj["map"])
        game = Game(
            user=self.request.user,
            map=obj["map"],
            own_score=obj["score"][0],
            opp_score=obj["score"][1],
            #TODO: Change when it becomes possible to know the bans
            own_atk_ban="",
            own_def_ban="",
            opp_atk_ban="",
            opp_def_ban="",
        )
        game.save()
        self.create_rounds(obj, game)
        self.create_stats(obj, game)
    
    def create_rounds(self, obj, game):
        for i in obj["rounds"]:
            round = Round(
                game=game,
                number=i["number"],
                site=i["site"],
                side=i["side"],
                won=i["won"],
                win_condition=i["win_condition"]
            )
            round.save()
            
    def create_stats(self, obj, game):
        for i in obj["players"].values():
            player = Player(
                game=game,
                name=i["name"],
                rounds=i["rounds"],
                kills=i["kills"],
                deaths=i["deaths"],
                headshots=i["headshots"],
                entry_kills=i["entry_kills"],
                entry_deaths=i["entry_deaths"],
                clutches=i["clutches"],
                multikills=i["multikills"],
                plants=i["plants"],
                disables=i["disables"],
                kost=i["kost"],
                rating=i["rating"],
            )
            player.save()
            
class OperatorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Operator.objects.all()
    serializer_class = OperatorSerializer
    permissions_classes = [permissions.IsAuthenticated]

class MappoolViewSet(viewsets.ModelViewSet):
    queryset = Map.objects.all().order_by("-name")
    serializer_class =  MapSerializer
    permissions_classes = [permissions.IsAuthenticated]