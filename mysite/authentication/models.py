from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    color = models.CharField(blank=True, max_length=120)
# Create your models here.
