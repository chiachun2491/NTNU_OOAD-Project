from django.shortcuts import render, redirect, get_object_or_404
from .models import Room


# Create your views here.
def index(request):
    return render(request, 'game/index.html')


def create(request):
    new_room = Room.objects.create()
    new_room.save()
    return redirect(new_room)


def room_view(request, room_name):
    game_room = get_object_or_404(Room, permanent_url=room_name)
    context = {
        'room': game_room,
    }
    return render(request, 'game/room.html', context)
