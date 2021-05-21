import React, {Component} from "react";
import RoomItem from "./Room";
import {Button, Badge, Spinner} from "react-bootstrap";
import axiosInstance from "../Api";
import {Helmet} from 'react-helmet';


class History extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomList: []
        };
    }

    componentDidMount() {
        axiosInstance.get('game/history/')
            .then(response => {
                // console.log(response);
                let roomList = response.data;
                this.setState({roomList: roomList});
                console.log(roomList);
            }).catch(err => {
            console.error(err);
        });
    }

    render() {
        const username = localStorage.getItem('username');
        let roomPlayingHistory = [];
        let roomEndHistory = [];
        let historyDiv;
        if (this.state.roomList.length > 0) {
            for (let room of this.state.roomList) {
                let roomItem = <RoomItem
                    key={room.permanent_url}
                    roomName={room.permanent_url}
                    playerAmount={room.players_length}
                />;
                if (room.status === 'playing') {
                    roomPlayingHistory.push(roomItem);
                } else if (room.status === 'end') {
                    roomEndHistory.push(roomItem);
                }
            }
            historyDiv = <>
                <h5 className="text-center m-0">
                    <Badge variant={'brown'} className={'my-2'}>尚未結束的遊戲</Badge>
                </h5>
                {roomPlayingHistory}
                <h5 className="text-center m-0">
                    <Badge variant={'brown'} className={'my-2'}>已經結束的遊戲</Badge>
                </h5>
                {roomEndHistory}
            </>;
        } else {
            historyDiv = <>
                <div className="d-flex align-items-center justify-content-center">
                    <Spinner animation="border" variant="brown" size={"sm"} className={'mr-2'}/> 載入中...
                </div>
            </>;
        }

        return (
            <>
                <Helmet>
                    <title>{`${username} 的遊玩紀錄`}</title>
                </Helmet>
                <h5 className={'text-center my-3'}>{username} 的遊玩紀錄</h5>
                {historyDiv}
            </>
        );
    }
}

export default History;