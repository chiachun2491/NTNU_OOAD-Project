import React, {Component} from "react";
import {Badge} from "react-bootstrap";
import GameOrganzie from "./GameOrganzie";
import GamePlaying from "./GamePlaying";
import GameEnd from "./GameEnd";
import axiosInstance from "../Api";
import { Helmet } from 'react-helmet'

const wsProtocol = window.location.origin.includes("https") ? "wss://" : "ws://";
let wsBaseURL;

if (process.env.NODE_ENV === 'production') {
    wsBaseURL = window.location.host;
} else {
    wsBaseURL = process.env.REACT_APP_WS_URL;
}

const RoomStatus = {
    ORGANIZE: 'organize',
    PLAYING: 'playing',
    END: 'end'
};

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null,
            roomName: '',
            roomData: {},
            alertMessage: null,
        };
    }

    componentDidMount() {
        const roomName = this.props.match.params.roomName;
        this.setState({roomName: roomName});

        axiosInstance.get('/game/' + roomName + '/')
            .then(response => {
                console.log(response.data);
                this.setState({roomData: response.data});
                this.connectSocket(roomName);
            }).catch(err => {
            console.error(err);
        });

    };

    timeout = 250;

    connectSocket(roomName) {
        // TODO: socket connect
        // check token valid first
        axiosInstance.get('/auth/hello/')
            .then((response) => {
                console.log('obtain/refresh token successfully', response);
            }).catch((err) => {
            console.log(err);
        });

        const token = localStorage.getItem('access_token');
        let ws = new WebSocket(wsProtocol + wsBaseURL + '/ws/game/' + roomName + '/?token=' + token);
        let that = this;
        let connectInterval;

        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected');

            this.setState({ws: ws});
            that.timeout = 250; // reset timer to 250 on open of websocket connection
            clearTimeout(connectInterval);

            // ws.send(JSON.stringify({event: 'status_change', message: 'playing'}));
        };

        ws.onmessage = event => {
            // listen to data sent from the websocket server
            const message = JSON.parse(event.data);
            switch (message.event) {
                case 'room_data_updated':
                    this.setState({roomData: message.room_data});
                    // this.setState({badgeMessage: {}});
                    break;
                case 'alert_message':
                    console.log(message.message);
                    this.setState({alertMessage: message.message}, () => {
                        window.setTimeout(() => {
                            this.setState({alertMessage: null});
                        }, 2000);
                    });
                    break;
                default:
                    console.log(message);
                    break;
            }
        };

        ws.onclose = (e) => {
            const close_msg = `Socket is closed. Reconnect will be attempted in ${Math.min(
                10000 / 1000,
                (that.timeout + that.timeout) / 1000
            )} second.`;
            console.log(close_msg, e.reason);
            that.setState({
                alertMessage: {
                    msg_type: 'ERROR',
                    msg: close_msg
                }
            }, () => {
                window.setTimeout(() => {
                    this.setState({alertMessage: null});
                }, (that.timeout + that.timeout));
            });

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.checkSocket, Math.min(10000, that.timeout)); //call checkSocket function after timeout
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );
            console.error(err);
            ws.close();
        };
    }

    checkSocket = () => {
        const {ws} = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connectSocket(this.state.roomName); //checkSocket if websocket instance is closed, if so call `connect` function.
    };

    render() {
        let gameComponent = <div/>;
        let roundBadge, cardPoolBadge;
        if (this.state.roomData.status === RoomStatus.ORGANIZE) {
            gameComponent = <GameOrganzie ws={this.state.ws} roomData={this.state.roomData}/>;
        } else if (this.state.roomData.status === RoomStatus.PLAYING) {
            gameComponent =
                <GamePlaying ws={this.state.ws} roomData={this.state.roomData} alertMessage={this.state.alertMessage}/>;
            roundBadge = <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                回合： {this.state.roomData.game_data.round} / 3
            </Badge>;
            cardPoolBadge = <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                卡池剩餘：{this.state.roomData.game_data.card_pool.length}
            </Badge>;
        } else if (this.state.roomData.status === RoomStatus.END) {
            gameComponent = <GameEnd ws={this.state.ws} roomData={this.state.roomData}/>;
        }


        const TITLE = "房間: " + this.state.roomName
        return (
            <>
                <Helmet>
                    <title>{ TITLE }</title>
                </Helmet>
                <h5 className="text-center m-0">
                    <Badge variant={'brown'} className={'my-2'}>房間: {this.state.roomName}</Badge>
                    {roundBadge}
                    {cardPoolBadge}
                </h5>
                {gameComponent}
            </>
        );
    }
}

export default Game;