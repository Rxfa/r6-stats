from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Game, Round, Player, JSONUpload

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [
            "name",
            "rounds",
            "kills",
            "deaths",
            "headshots",
            "entry_kills",
            "entry_deaths",
            "clutches",
            "multikills",
            "plants",
            "disables",
            "kost"
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
        fields = "__all__"

class UploadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = JSONUpload
        fields = ["url", "file"]
        
class UserSerializer(serializers.HyperlinkedModelSerializer):
    games = GameSerializer(many=True)
    class Meta:
        model = User
        fields = ["url", "username", "email", "games"]
