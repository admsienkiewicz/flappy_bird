from django.db.models import fields
from rest_framework import serializers

from .models import Scores

class ScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scores
        fields = ('user' , 'score')