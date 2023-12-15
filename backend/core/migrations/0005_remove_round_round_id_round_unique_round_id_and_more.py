# Generated by Django 4.2.5 on 2023-12-15 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_round_round_id'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='round',
            name='round_id',
        ),
        migrations.AddConstraint(
            model_name='round',
            constraint=models.UniqueConstraint(fields=('match_id', 'number'), name='unique_round_id'),
        ),
        migrations.AddConstraint(
            model_name='team',
            constraint=models.UniqueConstraint(fields=('round', 'is_own'), name='team_id'),
        ),
    ]
