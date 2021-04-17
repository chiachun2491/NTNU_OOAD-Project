import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from .models import Room


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'

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
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        print(message)

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def join_room(self):
        game_room = Room.objects.get(permanent_url=self.room_name)
        if game_room is None:
            game_room = database_sync_to_async(Room.objects.create(permanent_url=self.room_name))

        user = User.objects.get(username=self.scope['user'])

        if game_room.status == Room.StatusType.ORGANIZE:
            game_room.players.add(user)
            game_room.save()

            message = f"{str(self.scope['user'])} join"

            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )

        return

    @database_sync_to_async
    def leave_room(self):
        game_room = Room.objects.get(permanent_url=self.room_name)
        if game_room.status == Room.StatusType.ORGANIZE:
            user = User.objects.get(username=self.scope['user'])
            game_room.players.remove(user)

            message = f"{str(self.scope['user'])} leave"

            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )

        return
