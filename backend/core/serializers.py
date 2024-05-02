from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import RoundReplay, Replay, Vod


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


class PlayerStatsSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    rounds = serializers.IntegerField(min_value=0)
    kills = serializers.IntegerField(min_value=0)
    deaths = serializers.IntegerField(min_value=0, max_value=rounds)
    kd_diff = serializers.IntegerField()
    kd_ratio = serializers.CharField(max_length=50)
    kpr = serializers.CharField(max_length=50)
    assists = serializers.IntegerField(min_value=0, max_value=kills)
    headshots = serializers.IntegerField(min_value=0, max_value=kills)
    hs_percentage = serializers.CharField(max_length=50)
    kost = serializers.CharField(max_length=50)
    opening_kills = serializers.IntegerField(min_value=0, max_value=rounds)
    opening_deaths = serializers.IntegerField(min_value=0, max_value=rounds)
    opening_diff = serializers.IntegerField()
    entry_kills = serializers.IntegerField(min_value=0, max_value=rounds)
    entry_deaths = serializers.IntegerField(min_value=0, max_value=rounds)
    entry_diff = serializers.IntegerField()
    refrags = serializers.IntegerField(min_value=0, max_value=kills)
    trades = serializers.IntegerField(min_value=0, max_value=deaths)
    plants = serializers.IntegerField(min_value=0)
    disables = serializers.IntegerField(min_value=0)
    multikills = serializers.IntegerField(min_value=0, max_value=rounds)
    survival_rate = serializers.CharField(max_length=50)


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
    wins = serializers.IntegerField(read_only=True, max_value=plays)


class TeamStatsSerializer(serializers.Serializer):
    sites = SiteSerializer(many=True, read_only=True)


class IndividualStatsSerializer(serializers.Serializer):
    individual = serializers.DictField(child=PlayerStatsSerializer(many=True))


class StatsSerializer(serializers.Serializer):
    team = serializers.DictField(child=TeamStatsSerializer())
    individual = serializers.DictField(child=PlayerStatsSerializer(many=True))


class GameListSerializer(serializers.Serializer):
    match_id = serializers.CharField(max_length=50)
    won = serializers.BooleanField()
    map = serializers.CharField(max_length=50)
    date = serializers.DateTimeField()
    score = ScoreSerializer()
    bans = BansSerializer(many=True, read_only=True)


class GameDetailSerializer(serializers.Serializer):
    match_id = serializers.CharField(max_length=50)
    won = serializers.BooleanField()
    map = serializers.CharField(max_length=50)
    date = serializers.DateTimeField()
    score = ScoreSerializer()
    bans = BansSerializer(many=True, read_only=True)
    stats = StatsSerializer()
    rounds = RoundSerializer(many=True, read_only=True)


class IndividualSerializer(serializers.Serializer):
    general = serializers.DictField(child=PlayerStatsSerializer(many=True))
    maps = serializers.DictField(child=IndividualStatsSerializer())


class RoundListSerializer(serializers.Serializer):
    plays = serializers.IntegerField(min_value=0)
    wins = serializers.IntegerField(min_value=0, max_value=plays)
    player_stats = serializers.DictField(child=PlayerStatsSerializer(many=True))
    maps = serializers.DictField(child=StatsSerializer())


class VodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vod
        fields = ("url", "notes", "against",)


class VodListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vod
        fields = "__all__"
