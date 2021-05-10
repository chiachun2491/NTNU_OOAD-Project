from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import status, authentication, permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import GameRoomSerializer
from .models import GameRoom


# Create your views here.
def index(request):
    organize_rooms = GameRoom.objects.filter(status=GameRoom.StatusType.ORGANIZE)
    context = {
        'organize_rooms': organize_rooms
    }
    return render(request, 'game/index.html', context)


def create(request):
    new_room = GameRoom.objects.create()
    new_room.save()
    return redirect(new_room)


def room_view(request, room_name):
    game_room = get_object_or_404(GameRoom, permanent_url=room_name)
    context = {
        'room': game_room,
    }
    return render(request, 'game/room.html', context)


class GameRoomCreate(CreateAPIView):
    queryset = GameRoom.objects.all()
    serializer_class = GameRoomSerializer

    permission_classes = [permissions.IsAuthenticated]


class GameRoomDetail(RetrieveAPIView):
    queryset = GameRoom.objects.all()
    serializer_class = GameRoomSerializer
    lookup_field = 'permanent_url'
    lookup_url_kwarg = 'room_name'

    permission_classes = [permissions.IsAuthenticated]
