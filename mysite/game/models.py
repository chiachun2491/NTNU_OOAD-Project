from enum import Enum

from authentication.models import CustomUser
from django.db import models
from django.urls import reverse
from datetime import datetime
import base64
import hashlib

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# Create your models here.
class GameRoom(models.Model):

    class StatusType(models.TextChoices):
        ORGANIZE = 'organize'
        PLAYING = 'playing'
        END = 'end'

    HASH_SALT = 'HELLO'

    created_at = models.DateTimeField(auto_now_add=True)
    players = models.ManyToManyField(CustomUser, through='PlayerData', through_fields=('room', 'player'), blank=True)
    status = models.CharField(max_length=8, choices=StatusType.choices, default=StatusType.ORGANIZE)
    permanent_url = models.CharField(max_length=6, default='______')
    game_data = models.JSONField(default=dict)

    def save(self, *args, **kwargs):
        if self.permanent_url == '______':
            new_id = str(datetime.now)
            while True:
                new_id = base64.b64encode(hashlib.md5((new_id + self.HASH_SALT).encode('utf-8')).digest(),
                                          altchars=b"ab")[:6].decode("utf-8")
                if not GameRoom.objects.filter(permanent_url=new_id).exists():
                    break
            self.permanent_url = new_id
        else:
            pass
        super().save(*args, **kwargs)  # Call the "real" save() method.

    def get_absolute_url(self):
        return reverse('game:room', args=[self.permanent_url])

    def __str__(self):
        return f'{self.permanent_url}'

    @classmethod
    def room_group_name(cls, room_name):
        return f'game_{room_name}'

    def add_player(self, user):
        self.players.add(user)
        self.save()

        # channel_layer = get_channel_layer()
        # async_to_sync(channel_layer.group_send)(
        #     f'{self.room_group_name(self.permanent_url)}',
        #     {
        #         # TODO: change event type
        #         'type': 'chat_message',
        #         'message': f'{user} join game'
        #     }
        # )

    def remove_player(self, user):
        self.players.remove(user)
        self.save()

        # channel_layer = get_channel_layer()
        # async_to_sync(channel_layer.group_send)(
        #     f'{self.room_group_name(self.permanent_url)}',
        #     {
        #         # TODO: change event type
        #         'type': 'chat_message',
        #         'message': f'{user} leave game'
        #     }
        # )


class PlayerData(models.Model):
    room = models.ForeignKey(GameRoom, on_delete=models.CASCADE)
    player = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    point = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.room} {self.player}'

