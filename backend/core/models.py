import uuid

from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator


class RoundReplay(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(
        upload_to="replays",
    )


class Game(models.Model):
    match_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


class Round(models.Model):
    replay = models.OneToOneField(RoundReplay, on_delete=models.PROTECT, primary_key=True)
    dateTime = models.DateTimeField()
    match_id = models.ForeignKey(Game, on_delete=models.CASCADE)
    number = models.PositiveIntegerField()
    map = models.CharField(max_length=50)
    own_score = models.PositiveIntegerField()
    opp_score = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)  # Refers to date and time of upload
    site = models.CharField(max_length=50)
    own_atk_ban = models.CharField(max_length=50, blank=True, null=True)
    opp_atk_ban = models.CharField(max_length=50, blank=True, null=True)
    own_def_ban = models.CharField(max_length=50, blank=True, null=True)
    opp_def_ban = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['match_id', 'number'], name="unique_round_id")
        ]


class Team(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name="teams")
    is_own = models.BooleanField()
    score = models.PositiveIntegerField()
    won = models.BooleanField()
    win_condition = models.CharField(max_length=50, blank=True, null=True)
    side = models.CharField(max_length=50)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["round", "is_own"], name="team_id")
        ]


class Player(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="players")
    name = models.CharField(max_length=50)
    uid = models.CharField(max_length=50)
    spawn = models.CharField(max_length=50, blank=True, null=True)
    operator = models.CharField(max_length=50)
    kills = models.PositiveIntegerField()
    assists = models.PositiveIntegerField()
    headshots = models.PositiveIntegerField()
    died = models.BooleanField()
    opening_kill = models.BooleanField()
    opening_death = models.BooleanField()
    entry_kill = models.BooleanField()
    entry_death = models.BooleanField()
    refragged = models.BooleanField()
    traded = models.BooleanField()
    planted = models.BooleanField()
    time_of_plant = models.PositiveIntegerField(null=True, blank=True)
    disabled = models.BooleanField()
    time_of_disable = models.PositiveIntegerField(null=True, blank=True)

    @property
    def kost(self):
        if (
                self.kills > 0 or
                self.planted or
                self.disabled or
                not self.died or
                self.traded
        ):
            return 1
        return 0

    @property
    def multikill(self):
        return self.kills > 1

    def clean(self):
        if self.assists > self.kills:
            raise ValidationError(_("The number of assists cannot be higher than the number of kills"))
        if self.headshots > self.kills:
            raise ValidationError(_("The number of headshots cannot be higher than the number of kills"))
        if self.planted and self.disabled:
            raise ValidationError(_("Player cannot plant and defuse in the same round"))
        if (self.opening_kill and not self.entry_kill) or (self.opening_death and not self.entry_death):
            raise ValidationError(_("Player has opening but no entry"))
        if (
                (self.planted and self.time_of_plant is None) or
                (self.disabled and self.time_of_plant is None)
        ):
            raise ValidationError() #TODO: Write error message
        if (
                (not self.planted and self.time_of_plant is not None) or
                (not self.disabled and self.time_of_plant is not None)
        ):
            raise ValidationError()  # TODO: Write error message
        if self.time_of_plant > 180 or self.time_of_disable > 180:
            raise ValidationError(_("Invalid time for objective play"))
