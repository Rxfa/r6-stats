# Generated by Django 4.2.5 on 2023-10-06 18:49

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_map_alter_operator_side'),
    ]

    operations = [
        migrations.AlterField(
            model_name='operator',
            name='icon',
            field=models.ImageField(upload_to='media/operators', validators=[django.core.validators.FileExtensionValidator(['svg'])]),
        ),
    ]
