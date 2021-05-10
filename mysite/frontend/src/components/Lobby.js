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
            roomList: {}
        };

        this.createNewRoomClicked = this.createNewRoomClicked.bind()
    }

    componentDidMount() {

    }

    createNewRoomClicked() {
        axiosInstance.post('/game/room_create/')
            .then(response => {
                console.log(response.data);
                window.location.href = '/games/' + response.data.permanent_url + '/';
            }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <>
                <Button variant={'brown'} className={'my-3'} block={true} onClick={this.createNewRoomClicked}>新增房間</Button>
                {/*<CustomButton>新增房間</CustomButton>*/}
                <RoomItem roomName={'RXQfBz'} playerAmount={3}/>
                <RoomItem roomName={'GrTniQ'} playerAmount={2}/>
                <RoomItem roomName={'ib2wbs'} playerAmount={2}/>
                <RoomItem roomName={'Y60qTZ'} playerAmount={1}/>
            </>
        );
    }
}

export default Lobby;