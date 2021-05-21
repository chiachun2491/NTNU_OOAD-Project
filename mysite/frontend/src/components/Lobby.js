import React, {Component} from "react";
import RoomItem from "./Room";
import {Button, Badge} from "react-bootstrap";
import axiosInstance from "../Api";
import { Helmet } from 'react-helmet';

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
        const username = localStorage.getItem('username');
        return (
            <>
                <Helmet>
                    <title>{'遊戲大廳'}</title>
                </Helmet>
                <h5 className={'text-center my-3'}>Hi, {username}!</h5>
                <div className={'text-muted small text-center'}>可以選擇加入下面任一房間或是點選 <span>新增房間</span> 來開啟新遊戲！</div>
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