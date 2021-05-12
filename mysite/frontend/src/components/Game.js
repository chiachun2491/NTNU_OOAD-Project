import React, {Component} from "react";
import {Badge} from "react-bootstrap";
import GameOrganzie from "./GameOrganzie";
import GamePlaying from "./GamePlaying";
import GameEnd from "./GameEnd";
import axiosInstance from "../Api";

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
            roomData: {}
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
    refresh_token = true;

    connectSocket(roomName) {
        // TODO: socket connect
        const token = localStorage.getItem('access_token');
        let ws = new WebSocket('ws://' + wsBaseURL + '/ws/game/' + roomName + '/?token=' + token);
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
            this.setState({roomData: message});
            console.log(message);
        };

        ws.onclose = (e) => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

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

            if (that.refresh_token) {
                axiosInstance.get('/auth/hello/')
                    .then((response) => {
                        console.log('obtain/refresh token successfully', response);
                    }).catch((err) => {
                    console.log(err);
                    that.refresh_token = false;  // disable loop refresh
                });
            }
            ws.close();
        };
    }

    checkSocket = () => {
        const {ws} = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connectSocket(this.state.roomName); //checkSocket if websocket instance is closed, if so call `connect` function.
    };

    render() {
        let gameComponent = <div/>;
        if (this.state.roomData.status === RoomStatus.ORGANIZE) {
            gameComponent = <GameOrganzie ws={this.state.ws} roomData={this.state.roomData}/>;
        } else if (this.state.roomData.status === RoomStatus.PLAYING) {
            gameComponent = <GamePlaying ws={this.state.ws} roomData={this.state.roomData}/>;
        } else if (this.state.roomData.status === RoomStatus.END) {
            gameComponent = <GameEnd ws={this.state.ws} roomData={this.state.roomData}/>;
        }

        return (
            <>
                <h5 className="text-center my-2">
                    <Badge variant={'brown'}>房間: {this.state.roomName}</Badge>
                </h5>
                {gameComponent}
            </>
        );
    }
}

export default Game;