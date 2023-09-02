from .models import *
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ["map", "own_score", "opp_score", "own_ban", "opp_ban"]
    
class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ["number", "site", "side", "won", "win_condition"]
    
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

class StatsSerializer(serializers.ModelSerializer):
    model = Stats
    fields = ["players"]
