from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator


# Create your models here.
class JSONUpload(models.Model):
    file = models.FileField(upload_to="media/JSON_upload/%Y/%m/%d")
    upload_date = models.DateTimeField(auto_now_add=True)


class Map(models.Model):
    name = models.CharField(max_length=50)


class Operator(models.Model):
    class OperatorSide(models.TextChoices):
        ATK = "ATK"
        DEF = "DEF"

    name = models.CharField(max_length=50)
    icon = models.ImageField(
        upload_to="media/operators", validators=[FileExtensionValidator(["png", "jpg"])]
    )
    side = models.CharField(
        max_length=3, choices=OperatorSide.choices, default=OperatorSide.ATK
    )


class Game(models.Model):
    date = models.DateField(auto_now_add=True)
    file = models.ForeignKey(
        JSONUpload, on_delete=models.SET_NULL, null=True, blank=True
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="games")
    map = models.CharField(max_length=20)
    own_score = models.IntegerField()
    opp_score = models.IntegerField()
    own_atk_ban = models.CharField(max_length=20, blank=True)
    own_def_ban = models.CharField(max_length=20, blank=True)
    opp_atk_ban = models.CharField(max_length=20, blank=True)
    opp_def_ban = models.CharField(max_length=20, blank=True)
    """
    Bans are not FK because as of Oct 5 2023, 
    it's not possible to know the operator bans from the game replay file.
    """

    def __str__(self):
        return f"#{self.id} - {self.user.username} - {self.map}"

    @property
    def score(self):
        return f"{self.own_score}-{self.opp_score}"

    @property
    def bans(self):
        return f"{self.own_atk_ban}/{self.own_def_ban} & {self.opp_atk_ban}/{self.opp_def_ban}"


class Round(models.Model):
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="rounds")
    number = models.IntegerField()
    site = models.CharField(max_length=20)
    side = models.CharField(max_length=20)
    won = models.BooleanField()
    win_condition = models.CharField(max_length=20)

    def __str__(self):
        return (
            f"#{self.number} [{'WIN' if self.won else 'LOSS'}] {self.side} {self.site}"
        )


class Player(models.Model):
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="stats")
    name = models.CharField(max_length=20)
    rounds = models.IntegerField()
    kills = models.IntegerField()
    deaths = models.IntegerField()
    headshots = models.IntegerField()
    entry_kills = models.IntegerField()
    entry_deaths = models.IntegerField()
    clutches = models.IntegerField()
    multikills = models.IntegerField()
    plants = models.IntegerField()
    disables = models.IntegerField()
    kost = models.FloatField()
    rating = models.FloatField()

    @property
    def entry_diff(self):
        """Entry differential"""
        return (self.entry_kills - self.entry_deaths)

    @property
    def kpr(self):
        """Kills per round"""
        kpr = (self.kills / self.rounds)
        return f"{kpr:.2f}"

    @property
    def kd_ratio(self):
        """Kill/Death ratio"""
        kd = self.kills / self.deaths
        return f"{kd:.2f}"

    @property
    def srv(self):
        """Survival rate"""
        srv_ratio = (self.rounds - self.deaths) / self.rounds
        return f"{srv_ratio:.0%}"

    @property
    def kd_diff(self):
        """Kill/Death differential"""
        return self.kills - self.deaths

    @property
    def hs_percentage(self):
        """Headshot percentage"""
        hs_ratio = (self.headshots / self.rounds)
        return f"{hs_ratio:.0%}"
