from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from .serializers import GameRoomSerializer, LightGameRoomSerializer
from .models import GameRoom


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


class GameRoomList(ListAPIView):
    queryset = GameRoom.objects.all().filter(status=GameRoom.StatusType.ORGANIZE)
    serializer_class = LightGameRoomSerializer

    permission_classes = [permissions.IsAuthenticated]


class SelfGameRoomHistoryList(ListAPIView):
    serializer_class = LightGameRoomSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return GameRoom.objects.filter(playerdata__player=user)
