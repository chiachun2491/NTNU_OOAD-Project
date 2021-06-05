import React, { Component } from 'react';
import { Container, Row, Col, Button, Image, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faLightbulb, faShoppingCart, faTrashAlt, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import GameCard from './GameCard';
import { TutorialOverlayTrigger } from '../TutorialOverlay';
import cart_red from '../../images/status/cart_red.png';
import lamp_red from '../../images/status/lamp_red.png';
import pick_red from '../../images/status/pick_red.png';
import cart from '../../images/status/cart.png';
import lamp from '../../images/status/lamp.png';
import pick from '../../images/status/pick.png';

const BOARD_BASE = 45;

class GamePlaying extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectHandCardNo: -1,
            selectHandCardRotate: false,
            alertMessage: null,
        };

        this.handleHandCardClick = this.handleHandCardClick.bind(this);
        this.handlePositionClick = this.handlePositionClick.bind(this);
    }

    handleHandCardClick(cardNo) {
        if (cardNo !== this.state.selectHandCardNo) {
            // change select card and reset rotate
            this.setState({
                selectHandCardNo: cardNo,
                selectHandCardRotate: false,
            });
        } else {
            if (this.cardCanRotate(cardNo)) {
                this.setState({
                    selectHandCardRotate: !this.state.selectHandCardRotate,
                });
            }
        }
    }

    cardCanRotate(cardNo) {
        return cardNo >= 4 && cardNo <= 43;
    }

    cardIsMulti(cardNo) {
        return cardNo >= 59 && cardNo <= 61;
    }

    actionIsLegal(pos, action) {
        const username = localStorage.getItem('username') ? localStorage.getItem('username') : '你';
        if (this.props.roomData.game_data.now_play === username) {
            if (this.state.selectHandCardNo !== -1) {
                console.log(this.state.selectHandCardNo, this.state.selectHandCardRotate, pos, action);
                if (this.cardIsMulti(this.state.selectHandCardNo) && action === -1 && pos >= BOARD_BASE) {
                    this.setState(
                        {
                            alertMessage: {
                                msg_type: 'ILLEGAL_PLAY',
                                msg: '高級修理工具必須選擇要修理的工具',
                            },
                        },
                        () => {
                            window.setTimeout(() => {
                                this.setState({ alertMessage: null });
                            }, 2000);
                            return false;
                        }
                    );
                } else {
                    return true;
                }
            } else {
                this.setState(
                    {
                        alertMessage: {
                            msg_type: 'ILLEGAL_PLAY',
                            msg: '必須先選擇一張牌',
                        },
                    },
                    () => {
                        window.setTimeout(() => {
                            this.setState({ alertMessage: null });
                        }, 2000);
                        return false;
                    }
                );
            }
        }
    }

    handlePositionClick(pos, action = -1) {
        // defocus
        document.activeElement.blur();
        if (this.actionIsLegal(pos, action)) {
            // send state control to socket
            const ws = this.props.ws;
            try {
                ws.send(
                    JSON.stringify({
                        event: 'play_card',
                        id: this.state.selectHandCardNo,
                        rotate: this.state.selectHandCardRotate ? 1 : 0,
                        pos: pos,
                        act: action,
                    })
                );
            } catch (e) {
                console.log(e);
            }
            // reset select card
            this.setState({
                selectHandCardNo: -1,
                selectHandCardRotate: false,
            });
        }
    }

    render() {
        const username = localStorage.getItem('username') ? localStorage.getItem('username') : '你';
        const gameData = this.props.roomData.game_data;
        const nowStep =
            this.props.nowStep !== undefined
                ? this.props.nowStep
                : {
                      title: null,
                      content: null,
                      button: null,
                      showPosition: null,
                  };

        const popover = this.props.popover !== undefined ? this.props.popover : null;

        // set self_id
        let self_id = -1;
        const list_len = gameData.player_list.length;
        for (let i = 0; i < list_len; i++) {
            if (gameData.player_list[i].id === username) {
                self_id = i;
                break;
            }
        }

        // set other players components
        let other_players = [];
        for (let i = self_id === -1 ? 0 : 1; i < list_len; i++) {
            let playerIndex = ((self_id === -1 ? 0 : self_id) + i) % list_len;
            let player = gameData.player_list[playerIndex];
            other_players.push(
                <TutorialOverlayTrigger
                    key={`PLAYER_${playerIndex}`}
                    overlay={popover}
                    show={nowStep.showPosition === `PLAYER_${playerIndex}`}>
                    <OtherGamePlayer
                        nowPlaying={gameData.now_play === player.id}
                        key={player.id}
                        player={player}
                        onPositionClick={this.handlePositionClick}
                        playerID={playerIndex}
                    />
                </TutorialOverlayTrigger>
            );
        }

        // set alert message
        let alertMessage,
            msg = '　';
        if (this.props.socketErrorMessage !== null) {
            alertMessage = this.props.socketErrorMessage;
        } else if (this.state.alertMessage !== null) {
            alertMessage = this.state.alertMessage;
        } else {
            if (self_id !== -1) {
                alertMessage = gameData.return_msg[self_id];
            } else {
                alertMessage = Object.entries(
                    gameData.return_msg.reduce((a, v) => {
                        msg = v.msg;
                        a[msg] = a[msg] ? { v: v, count: a[msg].count + 1 } : { v: v, count: 1 };
                        return a;
                    }, {})
                ).reduce((a, v) => (v[1].count >= a[1].count ? v : a), [null, { count: 0 }])[1].v;
            }
        }
        let variant;
        if (alertMessage) {
            msg = alertMessage.msg;
            switch (alertMessage.msg_type) {
                case 'ILLEGAL_PLAY':
                    variant = 'danger';
                    break;
                case 'INFO':
                    variant = 'info';
                    break;
                case 'PEEK':
                    variant = 'secondary';
                    break;
                case 'ERROR':
                    variant = 'warning';
                    break;
                default:
                    variant = 'info';
                    break;
            }
        }
        return (
            <>
                <Badge className={'my-2 badge-block'} variant={variant}>
                    {msg}
                </Badge>
                <Container>
                    <Row className={'d-flex align-items-center'}>
                        <Col xs={12} lg={8}>
                            {/* Deck */}
                            {gameData.board.map((row, i) => (
                                <Row key={i} className={'d-flex justify-content-center'}>
                                    {row.map((card, j) => (
                                        <TutorialOverlayTrigger
                                            key={`BOARD_${i * 9 + j}`}
                                            overlay={popover}
                                            show={nowStep.showPosition === `BOARD_${i * 9 + j}`}>
                                            <GameCard
                                                key={j}
                                                card_no={card.card_no}
                                                isRotated={card.rotate !== 0}
                                                boardCard={true}
                                                onCardClick={() => this.handlePositionClick(i * 9 + j)}
                                            />
                                        </TutorialOverlayTrigger>
                                    ))}
                                </Row>
                            ))}
                        </Col>
                        <Col xs={12} lg={4}>
                            {/* Rival name & status */}
                            <Row>{other_players}</Row>
                            {self_id !== -1 ? (
                                <SelfGamePlayer
                                    player={gameData.player_list[self_id]}
                                    playerID={self_id}
                                    nowPlaying={gameData.now_play === username}
                                    onHandCardClick={this.handleHandCardClick}
                                    selectHandCardNo={this.state.selectHandCardNo}
                                    selectHandCardRotate={this.state.selectHandCardRotate}
                                    onPositionClick={this.handlePositionClick}
                                    overlay={popover}
                                    showPosition={nowStep.showPosition}
                                />
                            ) : null}
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
        handcards.push(<span key={i} className='otherPlayerHandCard' />);
    }
    return (
        <Col xs={4} lg={6} className={'px-2 my-2'}>
            <Button
                className={'text-wrap'}
                variant={props.nowPlaying ? 'brown' : 'outline-brown'}
                size={'sm'}
                block={true}
                onClick={() => props.onPositionClick(BOARD_BASE + props.playerID)}>
                {props.player.id}
            </Button>
            <div className='d-flex justify-content-center my-1'>
                {props.player.action_state.map((ban, i) => (
                    <ActionStatus
                        key={i}
                        ban={ban}
                        actionType={i}
                        onPositionClick={() => props.onPositionClick(BOARD_BASE + props.playerID, i)}
                    />
                ))}
            </div>
            <div className='d-flex justify-content-around my-1'>{handcards}</div>
        </Col>
    );
}

function SelfGamePlayer(props) {
    const identity = props.player.role ? '好矮人' : '壞矮人';
    const overlay = props.overlay;
    const showPosition = props.showPosition;
    return (
        <>
            {/* Your name & status */}
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'}>
                    <TutorialOverlayTrigger placement={'top'} overlay={overlay} show={showPosition === 'SELF_BTN'}>
                        <Button
                            className={'text-wrap'}
                            variant={props.nowPlaying ? 'brown' : 'outline-brown'}
                            block={true}
                            size={''}
                            onClick={() => props.onPositionClick(BOARD_BASE + props.playerID)}>
                            {props.player.id}：{identity}
                        </Button>
                    </TutorialOverlayTrigger>
                </Col>
                <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center p-0'}>
                    <Row className={'my-lg-1'}>
                        {props.player.action_state.map((ban, i) => (
                            <ActionStatus
                                key={i}
                                ban={ban}
                                actionType={i}
                                onPositionClick={() => props.onPositionClick(BOARD_BASE + props.playerID, i)}
                            />
                        ))}
                        <Col xs={'auto'} className={'p-0 mx-1'}>
                            $ : {props.player.point}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'}>
                    <Row className={'d-flex justify-content-around px-2'}>
                        {props.player.hand_cards.map((card, i) => (
                            <TutorialOverlayTrigger
                                key={`SELF_CARD_${i}`}
                                placement={'top'}
                                overlay={overlay}
                                show={showPosition === `SELF_CARD_${i}`}>
                                <GameCard
                                    card_no={card.card_no}
                                    isSelected={props.selectHandCardNo === card.card_no}
                                    isRotated={
                                        props.selectHandCardNo === card.card_no ? props.selectHandCardRotate : false
                                    }
                                    onCardClick={() => props.onHandCardClick(card.card_no)}
                                    key={i}
                                />
                            </TutorialOverlayTrigger>
                        ))}
                    </Row>
                </Col>
                <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center px-2 my-lg-2'}>
                    <Row>
                        <TutorialOverlayTrigger placement={'top'} overlay={overlay} show={showPosition === 'DROP_BTN'}>
                            <Button variant={'brown'} className={'mx-1'} onClick={() => props.onPositionClick(-1)}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                        </TutorialOverlayTrigger>
                        <TutorialOverlayTrigger placement={'top'} overlay={overlay} show={showPosition === 'LEAVE_BTN'}>
                            <Button variant={'outline-brown'} className={'mx-1'} href={'/games/'}>
                                <FontAwesomeIcon icon={faDoorOpen} />
                            </Button>
                        </TutorialOverlayTrigger>
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
        <Col xs={'auto'} className={'p-0 mx-1 cursor-pointer'} onClick={props.onPositionClick}>
            {/*<Image src={actionIcon} fluid/>*/}
            <FontAwesomeIcon icon={actionIcon} color={actionColor} />
        </Col>
    );
}

export default GamePlaying;
