import React, { Component } from 'react';
import RoomItem from './Room';
import { Button } from 'react-bootstrap';
import axiosInstance from '../Api';
import { Helmet } from 'react-helmet';

const wsProtocol = window.location.origin.includes('https') ? 'wss://' : 'ws://';
let wsBaseURL;

if (process.env.NODE_ENV === 'production') {
    wsBaseURL = window.location.host;
} else {
    wsBaseURL = process.env.REACT_APP_WS_URL;
}

class Lobby extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null,
            roomList: [],
            socketErrorMessage: null,
        };

        this.createNewRoomClicked = this.createNewRoomClicked.bind();
    }

    componentDidMount() {
        axiosInstance
            .get('game/room_list/')
            .then((response) => {
                // console.log(response);
                this.setState({ roomList: response.data });

                // TODO: Websocket connect to fetch new room status
                this.connectSocket();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    timeout = 250;

    connectSocket() {
        // TODO: socket connect
        // check token valid first
        axiosInstance
            .get('/auth/hello/')
            .then((response) => {
                console.log('obtain/refresh token successfully', response);
            })
            .catch((err) => {
                console.log(err);
            });

        const token = localStorage.getItem('access_token');
        let ws = new WebSocket(wsProtocol + wsBaseURL + '/ws/lobby/?token=' + token);
        let that = this;
        let connectInterval;

        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected');
            this.setState({ socketErrorMessage: null });

            this.setState({ ws: ws });
            that.timeout = 250; // reset timer to 250 on open of websocket connection
            clearTimeout(connectInterval);

            // ws.send(JSON.stringify({event: 'status_change', message: 'playing'}));
        };

        ws.onmessage = (event) => {
            // listen to data sent from the websocket server
            const message = JSON.parse(event.data);
            let newRoomList = this.state.roomList;
            let roomIndex;
            switch (message.event) {
                case 'room_data_updated':
                    roomIndex = this.state.roomList.findIndex((room) => room.permanent_url === message.room_name);
                    if (roomIndex === -1) {
                        newRoomList.push(message.room_data);
                    } else {
                        newRoomList[roomIndex] = message.room_data;
                    }
                    break;
                case 'room_data_deleted':
                    roomIndex = this.state.roomList.findIndex((room) => room.permanent_url === message.room_name);
                    newRoomList.splice(roomIndex);
                    break;
                default:
                    console.log(message);
                    break;
            }
            this.setState({ roomList: newRoomList });
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
        const close_msg = `Socket is closed. Reconnect will be attempted in ${timeout / 1000} second.`;
        console.log(close_msg);
        this.setState({ socketErrorMessage: close_msg }, () => {
            if (timeout - 1000 < 0) {
                this.setState({ socketErrorMessage: 'Reconnecting...' });
            } else {
                window.setTimeout(() => {
                    this.countDownMsgSet(timeout - 1000);
                }, 1000);
            }
        });
    };

    checkSocket = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connectSocket(); //checkSocket if websocket instance is closed, if so call `connect` function.
    };

    createNewRoomClicked() {
        axiosInstance
            .post('/game/room_create/')
            .then((response) => {
                // console.log(response.data);
                window.location.href = '/games/' + response.data.permanent_url + '/';
            })
            .catch((err) => {
                console.error(err);
            });
    }

    render() {
        const username = localStorage.getItem('username');
        const roomList = this.state.roomList;
        // sort by value
        roomList.sort(function (a, b) {
            return b.players_length - a.players_length;
        });
        return (
            <>
                <Helmet>
                    <title>{'遊戲大廳'}</title>
                </Helmet>
                <h5 className={'text-center my-3'}>Hi, {username}!</h5>
                <div className={'text-muted small text-center'}>
                    可以選擇加入下面任一房間或是點選 <span>新增房間</span> 來開啟新遊戲！
                </div>
                <Button variant={'brown'} className={'my-3'} block={true} onClick={this.createNewRoomClicked}>
                    新增房間
                </Button>

                {roomList.map((room) => (
                    <RoomItem
                        key={room.permanent_url}
                        roomName={room.permanent_url}
                        playerAmount={room.players_length}
                    />
                ))}
            </>
        );
    }
}

export default Lobby;
