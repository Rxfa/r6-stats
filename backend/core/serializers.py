from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Round, Team, Player, RoundReplay, Replay


class ScoreSerializer(serializers.Serializer):
    own = serializers.IntegerField(min_value=0)
    opp = serializers.IntegerField(min_value=0)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['username'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Incorrect username or password.')
        if not user.is_active:
            raise serializers.ValidationError('User is disabled.')
        return {'user': user}


class RoundUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundReplay
        fields = ("file",)


class ReplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Replay
        fields = "__all__"


class RoundListUploadSerializer(serializers.Serializer):
    rounds = serializers.ListField(child=serializers.FileField(allow_empty_file=False))


class PlayerSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    spawn = serializers.CharField(max_length=50)
    operator = serializers.CharField(max_length=50)
    kills = serializers.IntegerField(min_value=0, max_value=5)
    assists = serializers.IntegerField(min_value=0, max_value=kills)
    headshots = serializers.IntegerField(min_value=0, max_value=kills)
    died = serializers.BooleanField()
    opening_kill = serializers.BooleanField()
    opening_death = serializers.BooleanField()
    entry_kill = serializers.BooleanField()
    entry_death = serializers.BooleanField()
    refragged = serializers.BooleanField()
    traded = serializers.BooleanField()
    planted = serializers.BooleanField()
    time_of_plant = serializers.IntegerField(min_value=0, max_value=180)
    disabled = serializers.BooleanField()
    time_of_disable = serializers.IntegerField(min_value=0, max_value=180)
    kost = serializers.BooleanField()
    multikill = serializers.BooleanField()


class RoundSerializer(serializers.Serializer):
    number = serializers.IntegerField(min_value=0)
    score = ScoreSerializer(read_only=True)
    won = serializers.BooleanField(read_only=True)
    win_condition = serializers.CharField(max_length=50, read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    site = serializers.CharField(max_length=50, read_only=True)
    players = PlayerSerializer(many=True, read_only=True)


class BansSerializer(serializers.Serializer):
    is_own = serializers.BooleanField()
    ATK = serializers.CharField(max_length=50)
    DEF = serializers.CharField(max_length=50)

class SiteSerializer(serializers.Serializer):
    site = serializers.CharField(max_length=50, read_only=True)
    plays = serializers.IntegerField(read_only=True)
    wins = serializers.IntegerField(read_only=True, min_value=plays)

class TeamStatsSerializer(serializers.Serializer):
    sites = SiteSerializer(many=True, read_only=True)


class StatsSerializer(serializers.Serializer):
    team = serializers.DictField(read_only=True, child=TeamStatsSerializer())


class GameSerializer(serializers.Serializer):
    won = serializers.BooleanField()
    map = serializers.CharField(max_length=50)
    date = serializers.DateTimeField()
    score = ScoreSerializer()
    bans = BansSerializer(many=True, read_only=True)
    stats = StatsSerializer()
    rounds = RoundSerializer(many=True, read_only=True)


class GamesSerializer(serializers.Serializer):
    games = GameSerializer(many=True, read_only=True)
