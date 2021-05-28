import React, { Component } from 'react';
import RoomItem from './Room';
import { Badge, Spinner } from 'react-bootstrap';
import axiosInstance from '../Api';
import { Helmet } from 'react-helmet';
import { Loading } from './Loading';

class History extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomList: [],
            loaded: false,
        };
    }

    componentDidMount() {
        axiosInstance
            .get('game/history/')
            .then((response) => {
                // console.log(response);
                let roomList = response.data;
                this.setState({ roomList: roomList, loaded: true });
                console.log(roomList);
            })
            .catch((err) => {
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
                let roomItem = (
                    <RoomItem
                        key={room.permanent_url}
                        roomName={room.permanent_url}
                        playerAmount={room.players_length}
                    />
                );
                if (room.status === 'playing') {
                    roomPlayingHistory.push(roomItem);
                } else if (room.status === 'end') {
                    roomEndHistory.push(roomItem);
                }
            }
            historyDiv = (
                <>
                    {roomPlayingHistory.length > 0 ? (
                        <h5 className='text-center m-0'>
                            <Badge variant={'brown'} className={'my-2'}>
                                尚未結束的遊戲
                            </Badge>
                        </h5>
                    ) : null}
                    {roomPlayingHistory}
                    {roomEndHistory.length > 0 ? (
                        <h5 className='text-center m-0'>
                            <Badge variant={'brown'} className={'my-2'}>
                                已經結束的遊戲
                            </Badge>
                        </h5>
                    ) : null}
                    {roomEndHistory}
                </>
            );
        } else {
            historyDiv = <div className={'text-muted small text-center'}>目前還沒有遊玩紀錄喔！</div>;
        }

        return (
            <>
                <Helmet>
                    <title>{`${username} 的遊玩紀錄`}</title>
                </Helmet>
                <h5 className={'text-center my-3'}>{username} 的遊玩紀錄</h5>
                {this.state.loaded ? historyDiv : <Loading />}
            </>
        );
    }
}

export default History;
