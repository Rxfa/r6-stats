from django.db import models
from django.contrib.auth.models import User

# Create your models here.
    
class Game(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    map=models.CharField(max_length=20)
    own_score=models.IntegerField()
    opp_score=models.IntegerField()
    own_ban=models.CharField(max_length=20)
    opp_ban=models.CharField(max_length=20)
    
class Round(models.Model):
    game=models.ForeignKey(Game, on_delete=models.CASCADE)
    number=models.IntegerField()
    site=models.CharField(max_length=20)
    side=models.CharField(max_length=20, choices=[("ATK", "Attack"), ("DEF", "Defense")], default="DEF")
    won=models.BooleanField()
    win_condition=models.CharField(max_length=20)
    
class Player(models.Model): 
    name=models.CharField(max_length=20)
    rounds=models.IntegerField()
    kills=models.IntegerField()
    deaths=models.IntegerField()
    headshots=models.IntegerField()
    entry_kills=models.IntegerField()
    entry_deaths=models.IntegerField()
    clutches=models.IntegerField()
    multikills=models.IntegerField()
    plants=models.IntegerField
    disables=models.IntegerField()
    kost=models.FloatField()
    
class Stats(models.Model):
    game=models.ForeignKey(Game, on_delete=models.CASCADE)
    players=models.ManyToManyField(Player)