# Generated by Django 4.2.5 on 2023-12-23 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_round_replay'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='kost',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='player',
            name='multikill',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]