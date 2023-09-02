# Generated by Django 4.1.1 on 2023-09-02 04:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("map", models.CharField(max_length=20)),
                ("own_score", models.IntegerField()),
                ("opp_score", models.IntegerField()),
                ("own_ban", models.CharField(max_length=20)),
                ("opp_ban", models.CharField(max_length=20)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Player",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=20)),
                ("rounds", models.IntegerField()),
                ("kills", models.IntegerField()),
                ("deaths", models.IntegerField()),
                ("headshots", models.IntegerField()),
                ("entry_kills", models.IntegerField()),
                ("entry_deaths", models.IntegerField()),
                ("clutches", models.IntegerField()),
                ("multikills", models.IntegerField()),
                ("disables", models.IntegerField()),
                ("kost", models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name="Stats",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "game",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.game"
                    ),
                ),
                ("players", models.ManyToManyField(to="core.player")),
            ],
        ),
        migrations.CreateModel(
            name="Round",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("number", models.IntegerField()),
                ("site", models.CharField(max_length=20)),
                (
                    "side",
                    models.CharField(
                        choices=[("ATK", "Attack"), ("DEF", "Defense")],
                        default="DEF",
                        max_length=20,
                    ),
                ),
                ("won", models.BooleanField()),
                ("win_condition", models.CharField(max_length=20)),
                (
                    "game",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.game"
                    ),
                ),
            ],
        ),
    ]
