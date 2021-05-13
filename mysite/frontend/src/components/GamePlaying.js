import React, {Component} from "react";

import {Container, Row, Col, Button, Image} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHammer,
    faLightbulb,
    faShoppingCart,
    faTrashAlt,
    faDoorOpen
} from "@fortawesome/free-solid-svg-icons";
import GameCard from "../components/GameCard";
import cart_red from "../images/status/cart_red.png";
import lamp_red from "../images/status/lamp_red.png";
import pick_red from "../images/status/pick_red.png";
import cart from "../images/status/cart.png";
import lamp from "../images/status/lamp.png";
import pick from "../images/status/pick.png";

const BOARD_BASE = 45;

class GamePlaying extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectHandCardNo: -1,
            selectHandCardRotate: false,
        };

        this.handleHandCardClick = this.handleHandCardClick.bind(this);
        this.cardCanRotate = this.cardCanRotate.bind(this);
        this.handlePositionClick = this.handlePositionClick.bind(this);
    }


    componentDidMount() {
    };

    // TODO: card state control

    handleHandCardClick(cardNo) {
        if (cardNo !== this.state.selectHandCardNo) {
            // change select card and reset rotate
            this.setState({
                selectHandCardNo: cardNo,
                selectHandCardRotate: false
            });
        } else {
            if (this.cardCanRotate(cardNo)) {
                this.setState({
                    selectHandCardRotate: !this.state.selectHandCardRotate
                });
            }
        }
    }

    cardCanRotate(cardNo) {
        return cardNo >= 4 && cardNo <= 43;
    }

    handlePositionClick(pos, action = -1) {
        console.log(BOARD_BASE);
        if (this.state.selectHandCardNo !== -1) {
            console.log(this.state.selectHandCardNo, this.state.selectHandCardRotate, pos, action);
            // TODO: send state control to socket
            const ws = this.props.ws;
            try {
                ws.send(JSON.stringify({
                    event: 'play_card',
                    id: this.state.selectHandCardNo,
                    rotate: this.state.selectHandCardRotate ? 1 : 0,
                    pos: pos,
                    act: action,
                }));
            } catch (e) {
                console.log(e);
            }
            // reset select card
            this.setState({
                selectHandCardNo: -1,
                selectHandCardRotate: false
            });
        } else {
            alert('你必須先選擇一張牌');
        }
    }

    render() {
        const username = localStorage.getItem('username');
        const gameData = this.props.roomData.game_data;
        let self_id;
        const list_len = gameData.player_list.length;
        for (let i = 0; i < list_len; i++) {
            if (gameData.player_list[i].id === username) {
                self_id = i;
                break;
            }
        }
        let other_players = [];
        for (let i = 1; i < list_len; i++) {
            let playerIndex = (self_id + i) % list_len;
            let player = gameData.player_list[playerIndex];
            other_players.push(
                <OtherGamePlayer
                    nowPlaying={gameData.now_play === player.id}
                    key={player.id}
                    player={player}
                    onPositionClick={this.handlePositionClick}
                    playerID={playerIndex}
                />
            );
        }
        return (
            <>
                <Container>
                    <Row>
                        <Col xs={12} lg={8}>
                            {/* Deck */}
                            {gameData.board.map((row, i) => (
                                <Row key={i} className={'d-flex justify-content-center'}>
                                    {row.map((card, j) => (
                                        <GameCard
                                            key={j}
                                            card_no={card.card_no}
                                            isRotated={card.rotate !== 0}
                                            boardCard={true}
                                            onCardClick={() => this.handlePositionClick(i * 9 + j)}
                                        />
                                    ))}
                                </Row>
                            ))}
                        </Col>
                        <Col xs={12} lg={4} className={'my-3'}>
                            {/* Rival name & status */}
                            <Row className="my-2">
                                {other_players}
                            </Row>
                            <SelfGamePlayer
                                player={gameData.player_list[self_id]}
                                playerID={self_id}
                                nowPlaying={gameData.now_play === username}
                                onHandCardClick={this.handleHandCardClick}
                                selectHandCardNo={this.state.selectHandCardNo}
                                selectHandCardRotate={this.state.selectHandCardRotate}
                                onPositionClick={this.handlePositionClick}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

function OtherGamePlayer(props) {
    let handcards = [];
    for (let i = 0; i < props.player.hand_cards.length; i++) {
        handcards.push(<span key={i} className="otherPlayerHandCard"/>);
    }
    return (
        <Col xs={4} lg={12} className={"px-2"}>
            <Button variant={props.nowPlaying ? 'brown' : 'outline-brown'} size={'sm'} block={true}
                    onClick={() => props.onPositionClick((BOARD_BASE + props.playerID))}>
                {props.player.id}
            </Button>
            <div className="d-flex justify-content-center my-1">
                {props.player.action_state.map((ban, i) => (
                    <ActionStatus
                        key={i}
                        ban={ban}
                        actionType={i}
                        onPositionClick={() => props.onPositionClick((BOARD_BASE + props.playerID), i)}
                    />
                ))}
            </div>
            <div className="d-flex justify-content-around my-1">
                {handcards}
            </div>
        </Col>
    );
}

function SelfGamePlayer(props) {
    const identity = props.player.role ? '好矮人' : '壞矮人';
    return (
        <>
            {/* Your name & status */}
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'}>
                    <Button variant={props.nowPlaying ? 'brown' : 'outline-brown'} block={true} size={''}
                            onClick={() => props.onPositionClick((BOARD_BASE + props.playerID))}>
                        {props.player.id}：{identity}
                    </Button>
                </Col>
                <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center p-0'}>
                    <Row>
                        {props.player.action_state.map((ban, i) => (
                            <ActionStatus
                                key={i}
                                ban={ban}
                                actionType={i}
                                onPositionClick={() => props.onPositionClick((BOARD_BASE + props.playerID), i)}
                            />
                        ))}
                        <Col xs={'auto'} className={'p-0 mx-1'}>$ : {props.player.point}</Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'}>
                    <Row className={'px-2'}>
                        {props.player.hand_cards.map((card, i) => (
                            <GameCard
                                card_no={card.card_no}
                                isSelected={props.selectHandCardNo === card.card_no}
                                isRotated={props.selectHandCardNo === card.card_no ? props.selectHandCardRotate : false}
                                onCardClick={() => props.onHandCardClick(card.card_no)}
                                key={i}
                            />
                        ))}
                    </Row>
                </Col>
                <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center px-2 my-lg-2'}>
                    <Row>
                        <Button variant={'brown'} className={'mx-1'} onClick={() => props.onPositionClick(-1)}>
                            <FontAwesomeIcon icon={faTrashAlt}/>
                        </Button>
                        <Button variant={'outline-brown'} className={'mx-1'} href={'/games/'}>
                            <FontAwesomeIcon icon={faDoorOpen}/>
                        </Button>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

function ActionStatus(props) {
    let actionIcon;
    let actionType = props.ban ? (props.actionType + 1) * -1 : props.actionType + 1;
    let actionColor = props.ban ? 'red' : 'lightgray';
    switch (actionType) {
        case 1:
            actionIcon = faLightbulb;
            break;
        case 2:
            actionIcon = faShoppingCart;
            break;
        case 3:
            actionIcon = faHammer;
            break;
        case -1:
            actionIcon = faLightbulb;
            break;
        case -2:
            actionIcon = faShoppingCart;
            break;
        case -3:
            actionIcon = faHammer;
            break;
        default:
            break;
    }
    return (
        <Col xs={"auto"} className={'p-0 mx-1'} onClick={props.onPositionClick}>
            {/*<Image src={actionIcon} fluid/>*/}
            <FontAwesomeIcon icon={actionIcon} color={actionColor}/>
        </Col>
    );
}


export default GamePlaying;