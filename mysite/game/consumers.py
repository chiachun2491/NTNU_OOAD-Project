import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from django.contrib.auth.models import User
from .models import GameRoom
from channels.exceptions import DenyConnection

class GameRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = GameRoom.room_group_name(self.room_name)

        # Join game room
        # game_room.players.

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.join_room()

    async def disconnect(self, close_code):
        # leave room
        await self.leave_room()
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        event = text_data_json['event']
        message = text_data_json['message']

        if event == 'status_change':
            await self.change_status(message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': event,
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'event': 'chat_message',
            'message': message
        }))

    # Receive message from room group
    async def status_change(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'event': 'status_change',
            'message': message
        }))

    @database_sync_to_async
    def join_room(self):
        game_room = GameRoom.objects.get(permanent_url=self.room_name)
        if game_room is None:
            game_room = database_sync_to_async(GameRoom.objects.create(permanent_url=self.room_name))

        user = User.objects.get(username=self.scope['user'])

        print(game_room.status)

        if game_room.status == GameRoom.StatusType.ORGANIZE:
            game_room.add_player(user)

        elif game_room.status == GameRoom.StatusType.PLAYING:
            if user not in game_room.players.all():
                raise DenyConnection('Not player in this game')

        else:
            raise DenyConnection('Game is end')

            # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f"{str(self.scope['user'])} join"
            }
        )

        print(f"{str(self.scope['user'])} join")

        return

    @database_sync_to_async
    def leave_room(self):
        game_room = GameRoom.objects.get(permanent_url=self.room_name)
        if game_room.status == GameRoom.StatusType.ORGANIZE:
            user = User.objects.get(username=self.scope['user'])
            game_room.remove_player(user)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f"{str(self.scope['user'])} leave"
            }
        )

        print(f"{str(self.scope['user'])} leave")

        return

    @database_sync_to_async
    def change_status(self, status):
        # Send message to WebSocket
        if status == 'playing':
            game_room = GameRoom.objects.get(permanent_url=self.room_name)
            game_room.status = game_room.StatusType.PLAYING
            game_room.save()
        elif status == 'end':
            game_room = GameRoom.objects.get(permanent_url=self.room_name)
            game_room.status = game_room.StatusType.END
            game_room.save()

        print(status)

