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
        this.state = {
            // volume: 4,
        };
        this.gameStartClicked = this.gameStartClicked.bind(this);
        this.roomVolumeUpdate = this.roomVolumeUpdate.bind(this);
    }

    componentDidMount() {
        // const volume = this.props.roomData.volume;
        // this.setState({ volume: volume });
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

    render() {
        let gameCanStart = false;
        let gameNeedPlayerMessage = '';
        const nowPlayerAmount = this.props.roomData.players_data.length;
        const nowVolume = this.props.roomData.volume;
        if (nowPlayerAmount < ROOM_VOLUME_MIN) {
            gameCanStart = false;
            gameNeedPlayerMessage = '（還需 ' + (ROOM_VOLUME_MIN - nowPlayerAmount) + ' 位玩家加入）';
        } else {
            gameCanStart = true;
            gameNeedPlayerMessage = '';
        }
        // TODO: handle kick button action
        return (
            <>
                <Helmet>
                    <title>{`正在等待：${this.props.roomName}`}</title>
                </Helmet>
                <h5 className={'text-center my-3'}>玩家列表</h5>
                <Row className={'d-flex justify-content-center align-items-center my-3'}>
                    <Col xs={'auto'}>
                        <Button
                            variant={'brown'}
                            size={'sm'}
                            disabled={nowVolume <= Math.max(ROOM_VOLUME_MIN, nowPlayerAmount)}
                            onClick={() => this.roomVolumeUpdate(false)}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>
                    </Col>
                    <Col xs={'auto'}>房間容量：{nowVolume}</Col>
                    <Col xs={'auto'}>
                        <Button
                            variant={'brown'}
                            size={'sm'}
                            disabled={nowVolume >= ROOM_VOLUME_MAX}
                            onClick={() => this.roomVolumeUpdate(true)}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </Col>
                </Row>

                {this.props.roomData.players_data.map((player) => (
                    <GamePlayer key={player.player} playerName={player.player} isAdmin={true} />
                ))}
                {/*nowVolume - nowPlayerAmount*/}
                {Array.apply(null, Array(nowVolume - nowPlayerAmount)).map(() => EmptyGamePlayer)}

                <Button
                    variant={'brown'}
                    block={true}
                    className={'my-3'}
                    onClick={this.gameStartClicked}
                    disabled={!gameCanStart}>
                    開始遊戲{gameNeedPlayerMessage}
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
                        <FontAwesomeIcon icon={props.isAdmin ? faUserCog : faUser} className={'mr-2'} />
                        {props.playerName}
                    </span>
                    <span>
                        {props.isAdmin ? null : (
                            <Button variant='brown'>
                                <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                        )}
                    </span>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);

const EmptyGamePlayer = (
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
