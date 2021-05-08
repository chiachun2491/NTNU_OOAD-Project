import React, {Component} from "react";

import {Card, Button, Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCog, faUser, faWindowClose} from "@fortawesome/free-solid-svg-icons";

class GameOrganzie extends Component {
    state = {
        players: [],
    };

    componentDidMount() {
        // TODO: replace by socket connection
        this.setState({
            players: [
                {
                    'playerName': 'Jeffery',
                    'isAdmin': true
                },
                {
                    'playerName': 'Danny',
                    'isAdmin': false
                },
                {
                    'playerName': 'Dabu',
                    'isAdmin': false
                }
            ]
        });

    };

    render() {
        const players = this.state.players;
        return (
            <>
                {/* room number */}
                <h3 className={'my-3'}>玩家列表</h3>
                {players.map(player => (
                    <GamePlayer playerName={player.playerName} isAdmin={player.isAdmin}/>
                ))}
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