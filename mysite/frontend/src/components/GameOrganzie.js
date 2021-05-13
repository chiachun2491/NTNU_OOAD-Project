import React, {Component} from "react";

import {Card, Button, Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCog, faUser, faWindowClose} from "@fortawesome/free-solid-svg-icons";

const gamePlayerLeastAmount = 3;

class GameOrganzie extends Component {
    constructor(props) {
        super(props);
        this.gameStartClicked = this.gameStartClicked.bind(this);
    }

    componentDidMount() {

    };

    gameStartClicked = () => {
        const ws = this.props.ws;

        try {
            console.log('button clicked');
            console.log(ws);
            ws.send(JSON.stringify({event: 'status_change', message: 'playing'}));
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        let gameCanStart = false;
        let gameNeedPlayerMessage = '';
        if (this.props.roomData.players_data.length < gamePlayerLeastAmount) {
            gameCanStart = false;
            gameNeedPlayerMessage = '（還需 ' + (gamePlayerLeastAmount - this.props.roomData.players_data.length) + ' 位玩家加入）'
        } else {
            gameCanStart = true;
            gameNeedPlayerMessage = '';
        }
        // TODO: handle kick button action
        return (
            <>
                <h3 className={'my-3'}>玩家列表</h3>
                {this.props.roomData.players_data.map(player => (
                    <GamePlayer key={player.player} playerName={player.player} isAdmin={true}/>
                ))}

                <Button variant={'brown'} block={true} className={'my-3'} onClick={this.gameStartClicked} disabled={!gameCanStart}>開始遊戲{gameNeedPlayerMessage}</Button>
            </>
        );
    }
}

class GamePlayer extends Component {

    render() {

        let icon, closeBtn;

        if (this.props.isAdmin) {
            icon = faUserCog;
            closeBtn = null;
        } else {
            icon = faUser;
            closeBtn = <Button variant='brown'> <FontAwesomeIcon icon={faWindowClose}/></Button>;
        }

        return (
            <Row>
                <Col>
                    <Card className='my-2'>
                        <Card.Body className='d-flex justify-content-between align-items-center'>
                            <span className={'mr-auto'}>
                                <FontAwesomeIcon icon={icon} className={'mr-2'}/>
                                {this.props.playerName}
                            </span>
                            <span>{closeBtn}</span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}


export default GameOrganzie;