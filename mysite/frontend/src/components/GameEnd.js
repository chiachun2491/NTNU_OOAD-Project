import React, {Component} from "react";
import {faUser, faCrown} from "@fortawesome/free-solid-svg-icons";
import {Button, Card, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axiosInstance from "../Api";


class GameEnd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players_data: [],
            maxPoint: 0,
        };

        this.createNewRoomClicked = this.createNewRoomClicked.bind(this);
    }

    componentDidMount() {
        let players = this.props.roomData.players_data;
        if (players.length > 1) {
            players.sort(function (a, b) {
                return b.point - a.point;
            });
        }
        let max = Math.max(...players.map(p => p.point));
        this.setState((state, props) => ({
            players_data: players,
            maxPoint: max
        }));
    };

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
        console.log(this.state);
        return (
            <>
                <h3 className={'my-3'}>玩家列表</h3>
                {this.props.roomData.players_data.map(player => {
                    let isWinner = false;
                    if (player.point === this.state.maxPoint) {
                        isWinner = true;
                    }
                    return <GamePlayer key={player.player} playerName={player.player} isWinner={isWinner}
                                       point={player.point}/>;
                })}
                <Button variant={'brown'} className={'my-3'} block={true}
                        onClick={this.createNewRoomClicked}>開始新回合</Button>
                <div className={'text-center'}>
                    <Button variant={'brown'} className={'my-3'} size={'sm'}
                            href={'/games/'}>回到主畫面</Button>
                </div>
            </>
        );
    }
}

class GamePlayer extends Component {

    render() {
        let winnerIcon;
        if (this.props.isWinner) {
            winnerIcon = <FontAwesomeIcon icon={faCrown} className={'mr-2'} color={'orange'}/>;
        } else {
            winnerIcon = null;
        }

        return (
            <Row>
                <Col>
                    <Card className='my-2'>
                        <Card.Body className='d-flex justify-content-between align-items-center'>
                            <span className={'mr-auto'}>
                                <FontAwesomeIcon icon={faUser} className={'mr-2'}/>
                                {this.props.playerName}: {this.props.point}
                            </span>
                            <span>{winnerIcon}</span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default GameEnd;