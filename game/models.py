from django.db import models
from django.db.models.fields import UUIDField
import uuid

# Create your models here.
class Scores(models.Model):
    #owner
    user = models.CharField(max_length=50)
    score = models.IntegerField(default=0)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)