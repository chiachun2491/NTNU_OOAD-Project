import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import DenyConnection

from .serializers import GameRoomSerializer
from .models import GameRoom


class GameRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room: GameRoom = self._get_room()
        self.room_group_name = self.room.room_group_name()
        self.can_speak = False

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()
        # send room data first
        self.send(text_data=self._get_room_json())
        # set user can send message or not
        self.can_speak = self.room.join_room(self.scope['user'])

    def disconnect(self, close_code):
        # leave room
        self.room.leave_room(self.scope['user'])
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket (frontend)
    def receive(self, text_data):
        if self.can_speak:
            text_data_json = json.loads(text_data)
            print(text_data_json)
            event = text_data_json['event']

            if event == 'status_change':
                self.room.change_status(text_data_json['message'])

            elif event == 'play_card':
                self.room.state_control(text_data_json['card_id'], text_data_json['card_pos'], text_data_json['card_act'])

            else:
                # Send message to room group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': text_data_json['message']
                    }
                )

    # Receive message from room group
    # Send notification to frontend
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'event': 'chat_message',
            'message': message,
            'status': self.room.status,
        }))

    def _get_room(self) -> GameRoom:
        game_room = GameRoom.objects.get(permanent_url=self.room_name)

        if game_room is None:
            raise DenyConnection('Game not exist.')

        return game_room

    def _get_room_json(self):
        serializer = GameRoomSerializer(self.room)

        return json.dumps(serializer.data)

    def update_room(self, event):
        self.room = self._get_room()
        self.send(text_data=self._get_room_json())
