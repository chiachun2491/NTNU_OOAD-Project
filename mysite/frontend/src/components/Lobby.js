import React, {Component} from "react";
import Game from "./Game";
import CustomButton from "./CustomButton";
import RoomItem from "./Room";
import {Button} from "react-bootstrap";
import axiosInstance from "../Api";


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
            roomList: []
        }
        ;

        this.createNewRoomClicked = this.createNewRoomClicked.bind()
    }

    componentDidMount() {
        axiosInstance.get('game/room_list/')
            .then(response => {
                // console.log(response);
                let roomList = response.data;

                // sort by value
                roomList.sort(function (a, b) {
                    return b.players_data.length - a.players_data.length;
                });

                this.setState({roomList: roomList});

                // TODO: Websocket connect to fetch new room status

            }).catch(err => {
            console.error(err);
        });
    }

    createNewRoomClicked() {
        axiosInstance.post('/game/room_create/')
            .then(response => {
                // console.log(response.data);
                window.location.href = '/games/' + response.data.permanent_url + '/';
            }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <>
                <Button variant={'brown'} className={'my-3'} block={true}
                        onClick={this.createNewRoomClicked}>新增房間</Button>

                {this.state.roomList.map(room => (
                    <RoomItem key={room.permanent_url} roomName={room.permanent_url}
                              playerAmount={room.players_data.length}/>
                ))}
            </>
        );
    }
}

export default Lobby;