import React, { Component } from 'react';
import { Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import axiosInstance from '../api/Api';
import GameOrganize from '../components/game/GameOrganize';
import GamePlaying from '../components/game/GamePlaying';
import GameEnd from '../components/game/GameEnd';
import GameRoomError from '../components/errors/GameRoomError';

const wsProtocol = window.location.origin.includes('https') ? 'wss://' : 'ws://';
let wsBaseURL;

if (process.env.NODE_ENV === 'production') {
    wsBaseURL = window.location.host;
} else {
    wsBaseURL = process.env.REACT_APP_WS_URL || 'localhost:8000';
}

const RoomStatus = {
    ORGANIZE: 'organize',
    PLAYING: 'playing',
    END: 'end',
};

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null,
            roomName: '',
            roomData: {},
            socketErrorMessage: null,
        };
    }

    componentDidMount() {
        const roomName = this.props.match.params.roomName;
        this.setState({ roomName: roomName });

        axiosInstance
            .get('/game/' + roomName + '/')
            .then((response) => {
                this.setState({ roomData: response.data });
                this.connectSocket(roomName);
            })
            .catch((err) => {
                console.error(err);
                if (err.response.status === 404) {
                    window.location.href = '/games/notFound/';
                }
            });
    }

    timeout = 250;

    connectSocket(roomName) {
        // TODO: socket connect
        // check token valid first
        axiosInstance
            .get('/auth/hello/')
            .then((response) => {})
            .catch((err) => {
                console.error(err);
            });

        const token = localStorage.getItem('access_token');
        let ws = new WebSocket(wsProtocol + wsBaseURL + '/ws/game/' + roomName + '/?token=' + token);
        let that = this;
        let connectInterval;

        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            this.setState({ socketErrorMessage: null });

            this.setState({ ws: ws });
            that.timeout = 250; // reset timer to 250 on open of websocket connection
            clearTimeout(connectInterval);

            // ws.send(JSON.stringify({event: 'status_change', message: 'playing'}));
        };

        ws.onmessage = (event) => {
            // listen to data sent from the websocket server
            const message = JSON.parse(event.data);
            const username = localStorage.getItem('username');
            switch (message.event) {
                case 'room_data_updated':
                    this.setState({ roomData: message.room_data });
                    // this.setState({badgeMessage: {}});
                    break;
                case 'room_player_kicked':
                    if (username === message.username) {
                        window.location.href = '/games/';
                    }
                    break;
                case 'new_room_received':
                    window.location.href = `/games/${message.room_id}/`;
                    break;
                default:
                    console.error('This event did not handled', message);
                    break;
            }
        };

        ws.onclose = (e) => {
            const newTimeout = Math.min(10000, that.timeout + that.timeout);
            console.error(e.reason);
            this.countDownMsgSet(newTimeout);

            that.timeout = newTimeout; //increment retry interval
            connectInterval = setTimeout(this.checkSocket, that.timeout); //call checkSocket function after timeout
        };

        // websocket onerror event listener
        ws.onerror = (err) => {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            console.error(err);
            ws.close();
        };
    }

    countDownMsgSet = (timeout) => {
        const close_msg = `連線已中斷，我們將在 ${timeout / 1000} 秒後重新連線`;
        console.error(close_msg);
        this.setState(
            {
                socketErrorMessage: {
                    msg_type: 'ERROR',
                    msg: close_msg,
                },
            },
            () => {
                if (timeout - 1000 < 0) {
                    this.setState({
                        socketErrorMessage: {
                            msg_type: 'ERROR',
                            msg: '重新連線中...',
                        },
                    });
                } else {
                    window.setTimeout(() => {
                        this.countDownMsgSet(timeout - 1000);
                    }, 1000);
                }
            }
        );
    };

    checkSocket = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connectSocket(this.state.roomName); //checkSocket if websocket instance is closed, if so call `connect` function.
    };

    render() {
        try {
            let gameComponent;
            let roundBadge, cardPoolBadge;
            let title;
            if (this.state.roomData.status === RoomStatus.ORGANIZE) {
                gameComponent = (
                    <GameOrganize ws={this.state.ws} roomName={this.state.roomName} roomData={this.state.roomData} />
                );
                title = '正在等待';
            } else if (this.state.roomData.status === RoomStatus.PLAYING) {
                gameComponent = (
                    <GamePlaying
                        ws={this.state.ws}
                        roomName={this.state.roomName}
                        roomData={this.state.roomData}
                        socketErrorMessage={this.state.socketErrorMessage}
                    />
                );
                roundBadge = (
                    <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                        回合： {this.state.roomData.game_data.round} / 3
                    </Badge>
                );
                cardPoolBadge = (
                    <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                        卡池剩餘：{this.state.roomData.game_data.card_pool.length}
                    </Badge>
                );
                title = '正在遊戲';
            } else if (this.state.roomData.status === RoomStatus.END) {
                gameComponent = (
                    <GameEnd ws={this.state.ws} roomName={this.state.roomName} roomData={this.state.roomData} />
                );
                title = '遊戲結果';
            }

            return (
                <>
                    <Helmet>
                        <title>{`${title}：${this.state.roomName}`}</title>
                    </Helmet>
                    <h5 className='text-center m-0'>
                        <Badge variant={'brown'} className={'my-2'}>
                            房間: {this.state.roomName}
                        </Badge>
                        {roundBadge}
                        {cardPoolBadge}
                    </h5>
                    {gameComponent}
                </>
            );
        } catch (e) {
            console.error(e);
            return <GameRoomError />;
        }
    }
}

export default Game;
