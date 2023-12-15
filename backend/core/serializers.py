from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Round, Team, Player, RoundReplay


class RoundUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundReplay
        fields = ("file",)


class RoundListUploadSerializer(serializers.Serializer):
    rounds = serializers.ListField(child=serializers.FileField(allow_empty_file=False))


class PlayerSerializer(serializers.ModelSerializer):
    kost = serializers.SerializerMethodField()
    multikill = serializers.SerializerMethodField()

    def get_kost(self, obj):
        return obj.kost

    def get_multikill(self, obj):
        return obj.multikill

    class Meta:
        model = Player
        exclude = ["id", "team"]


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        exclude = ["id", "round"]


class RoundSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        exclude = ["replay", "match_id", "timestamp"]


class GameSerializer(serializers.Serializer):
    Rounds = RoundSerializer(many=True, read_only=True)
