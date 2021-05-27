from rest_framework.serializers import ModelSerializer, SerializerMethodField, StringRelatedField

from .models import GameRoom, PlayerData


class PlayerDataSerializer(ModelSerializer):
    player = StringRelatedField()

    class Meta:
        model = PlayerData
        fields = ['point', 'player']


class GameRoomSerializer(ModelSerializer):
    players_data = SerializerMethodField()

    def get_players_data(self, permanent_url):
        return PlayerDataSerializer(PlayerData.objects.all().filter(room__permanent_url=permanent_url), many=True).data

    class Meta:
        model = GameRoom
        fields = ['players_data', 'status', 'game_data', 'permanent_url', 'volume']


class LightGameRoomSerializer(GameRoomSerializer):
    players_length = SerializerMethodField()

    def get_players_length(self, permanent_url):
        return len(PlayerData.objects.all().filter(room__permanent_url=permanent_url))

    class Meta:
        model = GameRoom
        fields = ['players_length', 'status', 'permanent_url', 'volume']
