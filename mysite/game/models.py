from enum import Enum

from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse
from datetime import datetime
import base64
import hashlib


# Create your models here.
class Room(models.Model):

    class StatusType(models.TextChoices):
        ORGANIZE = 'organize'
        PLAYING = 'playing'
        END = 'END'

    HASH_SALT = 'HELLO'

    created_at = models.DateTimeField(auto_now_add=True)
    players = models.ManyToManyField(User, blank=True)
    status = models.CharField(max_length=8, choices=StatusType.choices, default=StatusType.ORGANIZE)
    permanent_url = models.CharField(max_length=6, default='______')

    def save(self, *args, **kwargs):
        if self.permanent_url == '______':
            new_id = str(datetime.now)
            while True:
                new_id = base64.b64encode(hashlib.md5((new_id + self.HASH_SALT).encode('utf-8')).digest(),
                                          altchars=b"ab")[:6].decode("utf-8")
                if not Room.objects.filter(permanent_url=new_id).exists():
                    break
            self.permanent_url = new_id
        else:
            pass
        super().save(*args, **kwargs)  # Call the "real" save() method.

    def get_absolute_url(self):
        return reverse('game:room', args=[self.permanent_url])

    def __str__(self):
        return f'{self.permanent_url}'
