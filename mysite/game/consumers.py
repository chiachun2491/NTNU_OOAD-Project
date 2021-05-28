import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import DenyConnection

from .serializers import GameRoomSerializer, LightGameRoomSerializer
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
            event = text_data_json['event']

            if event == 'status_change':
                self.room.change_status(text_data_json['message'])

            elif event == 'volume_change':
                self.room.volume = int(text_data_json['volume'])
                self.room.save()

            elif event == 'kick_player':
                self.room.kick_player(text_data_json['username'])
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'player_kicked',
                        'username': text_data_json['username']
                    }
                )

            elif event == 'play_card':
                return_msg = self.room.state_control(
                    int(text_data_json['id']),
                    int(text_data_json['pos']),
                    int(text_data_json['rotate']),
                    int(text_data_json['act'])
                )

                if return_msg is not None:
                    event = {'type': 'alert_message', 'message': return_msg}
                    if return_msg['msg_type'] == 'INFO':
                        # Send message to room group
                        async_to_sync(self.channel_layer.group_send)(
                            self.room_group_name, event
                        )
                    else:
                        self.alert_message(event)

            elif event == 'create_new_room':
                new_room = GameRoom.objects.create(volume=self.room.volume, admin=self.room.admin)
                new_room.save()
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'send_new_room',
                        'room_id': new_room.permanent_url
                    }
                )

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

    def alert_message(self, event):
        return_msg = event['message']

        self.send(text_data=json.dumps({
            'event': 'alert_message',
            'message': return_msg
        }))

    def _get_room(self) -> GameRoom:
        game_room = GameRoom.objects.get(permanent_url=self.room_name)

        if game_room is None:
            raise DenyConnection('Game not exist.')

        return game_room

    def _get_room_dict(self):
        serializer = GameRoomSerializer(self.room)

        return serializer.data

    def update_room(self, event):
        self.room = self._get_room()
        self.send(text_data=json.dumps({
            'event': 'room_data_updated',
            'room_data': self._get_room_dict()
        }))

    def player_kicked(self, event):
        self.send(text_data=json.dumps({
            'event': 'room_player_kicked',
            'username': event['username']
        }))

    def send_new_room(self, event):
        self.send(text_data=json.dumps({
            'event': 'new_room_received',
            'room_id': event['room_id']
        }))


class LobbyConsumer(WebsocketConsumer):
    def connect(self):
        # Join group
        async_to_sync(self.channel_layer.group_add)(
            GameRoom.lobby_socket_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave group
        async_to_sync(self.channel_layer.group_discard)(
            GameRoom.lobby_socket_group_name,
            self.channel_name
        )

    def delete_room(self, event):
        self.send(text_data=json.dumps({
            'event': 'room_data_deleted',
            'room_name': event['room_name']
        }))

    def update_room(self, event):
        room = GameRoom.objects.get(permanent_url=event['room_name'])
        if room is not None:
            self.send(text_data=json.dumps({
                'event': 'room_data_updated',
                'room_name': event['room_name'],
                'room_data': LightGameRoomSerializer(room).data
            }))
