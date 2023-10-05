from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Game, Round, Player, JSONUpload

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [
            "id", "name", "rating", "rounds", "kills", "deaths", "kd_diff","kd_ratio", "kpr", 
            "headshots", "hs_percentage","entry_kills", "entry_deaths", "entry_diff", "clutches",
            "multikills", "plants", "disables", "kost", "srv"
            ]
    
class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ["number", "site", "side", "won", "win_condition"]
        
class GameSerializer(serializers.ModelSerializer):
    rounds = RoundSerializer(many=True)
    stats = PlayerSerializer(many=True)
    class Meta:
        model = Game
        fields = ["id", "map", "score", "own_atk_ban", "own_def_ban", "opp_atk_ban", "opp_def_ban", "rounds", "stats"]

class UploadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = JSONUpload
        fields = ["id", "url"]
        
class UserSerializer(serializers.HyperlinkedModelSerializer):
    games = GameSerializer(many=True)
    class Meta:
        model = User
        fields = ["url", "username", "email", "games"]
