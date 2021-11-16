# Generated by Django 3.2.9 on 2021-11-16 14:26

from django.db import migrations, models
import django.db.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Scores',
            fields=[
                ('user', models.CharField(max_length=50)),
                ('score', models.IntegerField(default=0)),
                ('id', models.UUIDField(default=django.db.models.fields.UUIDField, editable=False, primary_key=True, serialize=False, unique=True)),
            ],
        ),
    ]