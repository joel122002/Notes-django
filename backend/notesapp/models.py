from django.db import models

# Create your models here.
from django.db import models

# Create your models here.
class Note(models.Model):
    title = models.TextField()
    note = models.TextField()
    username = models.CharField(max_length=200)
    isPinned = models.BooleanField()