from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Game, Round, Player, JSONUpload, Operator, Map


class MapSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Map
        fields = ["name"]


class OperatorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Operator
        fields = ["icon", "name", "side"]


class PlayerSerializer(serializers.ModelSerializer):
    """Player Serializer"""

    class Meta:
        model = Player
        fields = [
            "id",
            "name",
            "rating",
            "rounds",
            "kills",
            "deaths",
            "kd_diff",
            "kd_ratio",
            "kpr",
            "headshots",
            "hs_percentage",
            "entry_kills",
            "entry_deaths",
            "entry_diff",
            "clutches",
            "multikills",
            "plants",
            "disables",
            "kost",
            "srv",
        ]


class RoundSerializer(serializers.ModelSerializer):
    """Round Serializer"""

    class Meta:
        model = Round
        fields = ["number", "site", "side", "won", "win_condition"]


class GameSerializer(serializers.ModelSerializer):
    """Game Serializer"""

    rounds = RoundSerializer(many=True)
    stats = PlayerSerializer(many=True)

    class Meta:
        model = Game
        fields = [
            "id",
            "map",
            "score",
            "own_atk_ban",
            "own_def_ban",
            "opp_atk_ban",
            "opp_def_ban",
            "rounds",
            "stats",
        ]


class UploadSerializer(serializers.HyperlinkedModelSerializer):
    """JSON file upload Serializer"""

    class Meta:
        model = JSONUpload
        fields = ["id", "url"]


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """User Serializer"""

    games = GameSerializer(many=True)

    class Meta:
        model = User
        fields = ["url", "username", "email", "games"]
