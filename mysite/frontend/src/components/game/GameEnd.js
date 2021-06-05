import React, { Component } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faUser, faCrown } from '@fortawesome/free-solid-svg-icons';
import getUserName from '../../utils/getUserName';

class GameEnd extends Component {
    constructor(props) {
        super(props);
        this.createNewRoomClicked = this.createNewRoomClicked.bind(this);
    }

    createNewRoomClicked() {
        const ws = this.props.ws;
        try {
            ws.send(JSON.stringify({ event: 'create_new_room' }));
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        const username = this.props.username;
        const adminName = this.props.roomData.admin;
        const admin = adminName === username;

        let players = this.props.roomData.players_data;
        if (players.length > 1) {
            players.sort(function (a, b) {
                return b.point - a.point;
            });
        }
        let max = Math.max(...players.map((p) => p.point));
        return (
            <>
                <h5 className={'text-center my-3'}>玩家列表</h5>
                {players.map((player) => (
                    <GamePlayer
                        key={player.player}
                        playerName={player.player}
                        isWinner={player.point === max}
                        isAdmin={adminName === player.player}
                        point={player.point}
                    />
                ))}
                <Button
                    variant={'brown'}
                    className={'my-3'}
                    block={true}
                    onClick={this.createNewRoomClicked}
                    disabled={!admin}>
                    {admin ? null : '等待房主'}開始新回合
                </Button>
                <div className={'text-center'}>
                    <Button variant={'brown'} className={'my-3'} size={'sm'} href={'/games/'}>
                        回到主畫面
                    </Button>
                </div>
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
                        {props.playerName}: {props.point}
                    </span>
                    <span>
                        {props.isWinner ? <FontAwesomeIcon icon={faCrown} className={'mr-2'} color={'orange'} /> : null}
                    </span>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);

export default GameEnd;
