from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class JSONUpload(models.Model):
    file = models.FileField(upload_to="JSON_upload/%Y/%m/%d")
    upload_date = models.DateTimeField(auto_now_add=True)

class Game(models.Model):
    date=models.DateField(auto_now_add=True)
    file=models.ForeignKey(JSONUpload, on_delete=models.SET_NULL, null=True, blank=True)
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="games")
    map=models.CharField(max_length=20)
    own_score=models.IntegerField()
    opp_score=models.IntegerField()
    own_atk_ban=models.CharField(max_length=20, blank=True)
    own_def_ban=models.CharField(max_length=20, blank=True)
    opp_atk_ban=models.CharField(max_length=20, blank=True)
    opp_def_ban=models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return f"#{self.id} - {self.user.username} - {self.map}"
    
    @property
    def score(self):
        return f"{self.own_score}-{self.opp_score}"
    
    @property
    def bans(self):
        return f"{self.own_atk_ban}/{self.own_def_ban} & {self.opp_atk_ban}/{self.opp_def_ban}"
    
class Round(models.Model):
    game=models.ForeignKey(Game, on_delete=models.CASCADE, related_name="rounds")
    number=models.IntegerField()
    site=models.CharField(max_length=20)
    side=models.CharField(max_length=20)
    won=models.BooleanField()
    win_condition=models.CharField(max_length=20)
    
    def __str__(self):
        return f"#{self.number} [{'WIN' if self.won else 'LOSS'}] {self.side} {self.site}"
    
class Player(models.Model): 
    game=models.ForeignKey(Game, on_delete=models.CASCADE, related_name="stats")
    name=models.CharField(max_length=20)
    rounds=models.IntegerField()
    kills=models.IntegerField()
    deaths=models.IntegerField()
    headshots=models.IntegerField()
    entry_kills=models.IntegerField()
    entry_deaths=models.IntegerField()
    clutches=models.IntegerField()
    multikills=models.IntegerField()
    plants=models.IntegerField()
    disables=models.IntegerField()
    kost=models.FloatField()
    rating=models.FloatField()
    
    @property
    def entry_diff(self):
        return self.entry_kills - self.entry_deaths
    
    @property
    def kpr(self):
        return self.kills / self.rounds
    
    @property
    def kd_ratio(self):
        return self.kills / self.deaths
    
    @property
    def srv(self):
        return (self.rounds - self.deaths) / self.rounds
    
    @property
    def kd_diff(self):
        return self.kills - self.deaths
    
    @property
    def hs_percentage(self):
        return f"{(self.headshots / self.rounds) * 100}%"