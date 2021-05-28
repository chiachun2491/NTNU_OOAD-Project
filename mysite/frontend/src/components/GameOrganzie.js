import React, { Component } from 'react';

import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faUser, faWindowClose, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

const ROOM_VOLUME_MIN = 3;
const ROOM_VOLUME_MAX = 10;

class GameOrganzie extends Component {
    constructor(props) {
        super(props);

        this.gameStartClicked = this.gameStartClicked.bind(this);
        this.roomVolumeUpdate = this.roomVolumeUpdate.bind(this);
        this.kickPlayer = this.kickPlayer.bind(this);
    }

    gameStartClicked = () => {
        const ws = this.props.ws;

        try {
            ws.send(JSON.stringify({ event: 'status_change', message: 'playing' }));
        } catch (e) {
            console.error(e);
        }
    };

    roomVolumeUpdate(plus) {
        const ws = this.props.ws;
        let newVolume = this.props.roomData.volume;
        if (plus) {
            newVolume += 1;
        } else {
            newVolume -= 1;
        }

        try {
            ws.send(JSON.stringify({ event: 'volume_change', volume: newVolume }));
            document.activeElement.blur();
        } catch (e) {
            console.error(e);
        }
    }

    kickPlayer(username) {
        const ws = this.props.ws;
        try {
            ws.send(JSON.stringify({ event: 'kick_player', username: username }));
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        const username = localStorage.getItem('username');
        const adminName = this.props.roomData.admin;
        const admin = adminName === username;

        let playersData = this.props.roomData.players_data;
        playersData.sort((x, y) => {
            return x.player === adminName ? -1 : y.player === adminName ? 1 : 0;
        });

        const nowPlayerAmount = playersData.length;
        const nowVolume = this.props.roomData.volume;

        let gameCanStart = false;
        let gameStartButtonContent = '';

        if (nowPlayerAmount < ROOM_VOLUME_MIN) {
            gameCanStart = false;
            gameStartButtonContent = '還需 ' + (ROOM_VOLUME_MIN - nowPlayerAmount) + ' 位玩家加入';
        } else {
            gameCanStart = admin;
            gameStartButtonContent = admin ? '開始遊戲' : '等待房主開始遊戲';
        }
        // TODO: handle kick button action
        return (
            <>
                <Helmet>
                    <title>{`正在等待：${this.props.roomName}`}</title>
                </Helmet>
                <h5 className={'text-center my-3'}>玩家列表</h5>
                <Row className={'d-flex justify-content-center align-items-center my-3'}>
                    {admin ? (
                        <Col xs={'auto'}>
                            <Button
                                variant={'brown'}
                                size={'sm'}
                                disabled={nowVolume <= Math.max(ROOM_VOLUME_MIN, nowPlayerAmount)}
                                onClick={() => this.roomVolumeUpdate(false)}>
                                <FontAwesomeIcon icon={faMinus} />
                            </Button>
                        </Col>
                    ) : null}
                    <Col xs={'auto'}>房間容量：{nowVolume}</Col>
                    {admin ? (
                        <Col xs={'auto'}>
                            <Button
                                variant={'brown'}
                                size={'sm'}
                                disabled={nowVolume >= ROOM_VOLUME_MAX}
                                onClick={() => this.roomVolumeUpdate(true)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                        </Col>
                    ) : null}
                </Row>

                {playersData.map((player) => (
                    <GamePlayer
                        key={player.player}
                        playerName={player.player}
                        adminName={adminName}
                        selfname={username}
                        handleKickFunction={this.kickPlayer}
                    />
                ))}
                {/*nowVolume - nowPlayerAmount*/}
                {Array.apply(null, Array(nowVolume - nowPlayerAmount)).map((_, index) => (
                    <EmptyGamePlayer key={index} />
                ))}

                <Button
                    variant={'brown'}
                    block={true}
                    className={'my-3'}
                    onClick={this.gameStartClicked}
                    disabled={!gameCanStart}>
                    {gameStartButtonContent}
                </Button>
            </>
        );
    }
}

const GamePlayer = (props) => (
    <Row>
        <Col>
            <Card className='my-2'>
                <Card.Body className='d-flex justify-content-between align-items-center'>
                    <span className={'mr-auto'}>
                        <FontAwesomeIcon
                            icon={props.adminName === props.playerName ? faUserCog : faUser}
                            className={'mr-2'}
                        />
                        {props.playerName}
                    </span>
                    <span>
                        {props.adminName === props.selfname && props.playerName !== props.selfname ? (
                            <Button variant='brown' onClick={() => props.handleKickFunction(props.playerName)}>
                                <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                        ) : null}
                    </span>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);

const EmptyGamePlayer = () => (
    <Row>
        <Col>
            <Card className='my-2'>
                <Card.Body className='d-flex justify-content-between align-items-center'>
                    <span className={'mr-auto tool'}>
                        <FontAwesomeIcon icon={faUser} className={'mr-2'} />
                        等待加入中...
                    </span>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);

export default GameOrganzie;
