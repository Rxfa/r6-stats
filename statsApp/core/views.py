import json
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from urllib.parse import urlparse
import statsScript.main as statsScript
from .serializers import UserSerializer, GameSerializer, UploadSerializer, RoundSerializer
from .models import Game, JSONUpload, Round, Player
class UserViewSet(viewsets.ModelViewSet):
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

class UploadViewSet(viewsets.ModelViewSet):
    queryset = JSONUpload.objects.all().order_by("-upload_date")
    serializer_class = UploadSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
        print("This the data\n\n\n")
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
            own_ban="",
            opp_ban=""
        )
        game.save()
        self.create_rounds(obj["rounds"], game)
        self.create_stats(obj["players"], game)
    
    def create_rounds(self, rounds, game):
        for i in rounds:
            round = Round(
                game=game,
                number=i["number"],
                site=i["site"],
                side=i["side"],
                won=i["won"],
                win_condition=i["win_condition"]
            )
            round.save()
            
    def create_stats(self, players, game):
        for i in players.values():
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