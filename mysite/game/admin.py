from django.contrib import admin
from .models import GameRoom, PlayerData

# Register your models here.
admin.site.register(GameRoom)
admin.site.register(PlayerData)