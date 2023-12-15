from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Round, Team, Player, RoundReplay


class RoundUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundReplay
        fields = ("file", )


class RoundListUploadSerializer(serializers.Serializer):
    rounds = serializers.ListField(child=serializers.FileField(allow_empty_file=False))


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = (
            "name", "uid", "spawn", "operator", "kills", "assists", "headshots", "died",
            "opening_kill", "opening_death", "entry_kill", "entry_death", "refragged",
            "traded", "planted", "time_of_plant", "disabled", "time_of_disable", "kost",
            "multikill"
        )


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)

    class Meta:
        model = Team
        fields = ("is_own", "score", "won", "win_condition", "side", "players")


class RoundSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True)

    class Meta:
        model = Round
        fields = ("number", "timestamp", "site", "teams")



