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
    own_ban=models.CharField(max_length=20, blank=True)
    opp_ban=models.CharField(max_length=20, blank=True)
    
class Round(models.Model):
    game=models.ForeignKey(Game, on_delete=models.CASCADE, related_name="rounds")
    number=models.IntegerField()
    site=models.CharField(max_length=20)
    side=models.CharField(max_length=20)
    won=models.BooleanField()
    win_condition=models.CharField(max_length=20)
    
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