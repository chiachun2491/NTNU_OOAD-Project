from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('ws/lobby/', consumers.LobbyConsumer.as_asgi(), name='ws_lobby'),
    path('ws/game/<str:room_name>/', consumers.GameRoomConsumer.as_asgi(), name='ws_room'),
    # re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
