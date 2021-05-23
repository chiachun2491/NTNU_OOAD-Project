import React, {Component, useState} from "react";

import {Container, Row, Button, Col, Image, Badge, OverlayTrigger, Popover, Alert} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHammer,
    faLightbulb,
    faShoppingCart,
    faTrashAlt,
    faDoorOpen,
    faWeight,
    faTruckMonster
} from "@fortawesome/free-solid-svg-icons";
import GameCard from "../components/GameCard";
import cart_red from "../images/status/cart_red.png";
import lamp_red from "../images/status/lamp_red.png";
import pick_red from "../images/status/pick_red.png";
import cart from "../images/status/cart.png";
import lamp from "../images/status/lamp.png";
import pick from "../images/status/pick.png";
import { Helmet } from 'react-helmet'
import { Next } from "react-bootstrap/esm/PageItem";

const BOARD_BASE = 45;

class Tutorial extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectHandCardNo: -1,
            selectHandCardRotate: false,
            alertMessage: null,
            gameData: {
                board:{
                        card_no:[[-1, -1, -1, -1, -1, -1 , -1, -1 , 73],
                                [-1, -1, 19, 34, -1, -1 , -1, -1 , -1],
                                [0,  38, 33, 23, -1, 18 , 40, 26 , 73],
                                [-1, -1, -1, 8, 39, 13 , -1, -1 , -1],
                                [-1, -1, -1, 28, -1, -1 , -1, -1 , 73]],
                        rotate: [[false, false, false, false, false, false , false, false , false],
                                [false, false, false, false, false, false , false, false , false],
                                [false, false, false, false, false, false , false, false , false],
                                [false, false, false, false, false, false , false, false , false],
                                [false, false, false, false, false, false , false, false , false]]
                }
            },
            player_1: {
                id: 0,
                hand_cards: [9, 44, 57, 28, 32],
                action_state: [false, false, false],
            },
    
            player_2: {
                id: 1,
                action_state: [false, false, true],
                nowPlaying: false,
                hand_cards: {
                    length: 5,
                }
            },

            player_3: {
                id: 2,
                action_state: [false, false, false],
                nowPlaying: false,
                hand_cards: {
                    length: 5,
                }
            },
            last_card: 36,
            step: [true, false, false, false, false, false, false, false]
        };

        this.handleHandCardClick = this.handleHandCardClick.bind(this);
        this.cardCanRotate = this.cardCanRotate.bind(this);
        this.handlePositionClick = this.handlePositionClick.bind(this);
        this.cardIsMulti = this.cardIsMulti.bind(this);
        this.handleStepClick = this.handleStepClick.bind(this);
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

    cardIsMulti(cardNo) {
        return cardNo >= 59 && cardNo <= 61;
    }

    handleStepClick(order) {
        if(order < 8){
            if(this.state.step[order] == true) {
                return true;
            }
        }
        // Reset tutorial
        else if(order == 8 && this.state.step[7] == true) {
            this.setState(() => {
                this.state.gameData.board.card_no[1][4] = -1;
                this.state.gameData.board.card_no[2][7] = 26;
                this.state.gameData.board.rotate[1][4] = false;
                this.state.player_1.hand_cards= [9, 44, 57, 28, 32];
                this.state.player_1.action_state = [false, false, false];
                this.state.player_2.action_state = [false, false, true];
                this.state.player_3.action_state = [false, false, false];
                this.state.last_card = 36;
                this.state.step[0] = true;
                this.state.step[7] = false;
            });
            return true;
        }
        return false;
    }

    handlePositionClick(pos, action = -1) {
        if (this.state.selectHandCardNo !== -1) {
            if (this.cardIsMulti(this.state.selectHandCardNo) && (action === -1) && (pos >= BOARD_BASE)) {
                this.setState({
                    alertMessage: {
                        msg_type: 'ILLEGAL_PLAY',
                        msg: 'Multi Action Card must select one tool to repair'
                    }
                }, () => {
                    window.setTimeout(() => {
                        this.setState({alertMessage: null});
                    }, 2000);
                });
            } else {
                // Road
                if(pos == 13 && this.state.step[0]){
                    if(this.state.selectHandCardNo == 9 && this.state.selectHandCardRotate){
                        this.setState(()=> {
                            this.state.gameData.board.rotate[1][4]=true;
                            this.state.gameData.board.card_no[1][4]= 9;
                            this.state.player_1.hand_cards=[44, 57, 28, 32, 31];
                            this.state.last_card = 35;
                            this.state.step[0] = false;
                            this.state.step[1] = true;
                        })
                    }
                }
                // rock and end
                else if(pos == 25) {
                    if(this.state.selectHandCardNo == 62 && this.state.step[5]) {
                        this.setState(()=> {
                            this.state.player_1.hand_cards=[28, 32, 31, 42, 14];
                            this.state.gameData.board.card_no[2][7] = -1;
                            this.state.last_card = 30;
                            this.state.step[5] = false;
                            this.state.step[6] = true;
                        })
                    }
                    else if(this.state.selectHandCardNo == 14 && this.state.step[6]) {
                        this.setState(()=> {
                            this.state.player_1.hand_cards=[28, 32, 31, 42, 61];
                            this.state.gameData.board.card_no[2][7] = 14;
                            this.state.last_card = 29;
                            this.state.step[6] = false;
                            this.state.step[7] = true;
                        })
                    }
                }
                // ban
                else if(pos == BOARD_BASE + 2 && this.state.step[1]){
                    if(this.state.selectHandCardNo == 44){
                        this.setState(()=> {
                            this.state.player_1.hand_cards=[57, 28, 32, 31, 42];
                            this.state.player_3.action_state[0] = true;
                            this.state.last_card = 34;
                            this.state.step[1] = false;
                            this.state.step[2] = true;
                        })
                    }
                }
                // unban
                else if(pos == BOARD_BASE + 1 && this.state.step[2]) {
                    if(this.state.selectHandCardNo == 57) {
                        this.setState(()=> {
                            this.state.player_1.hand_cards=[28, 32, 31, 42, 43];
                            this.state.player_2.action_state[2] = false;
                            this.state.last_card = 33;
                            this.state.step[2] = false;
                            this.state.step[3] = true;
                        })
                    }
                }
                // map
                else if(pos == 26 && this.state.step[4]) {
                    if(this.state.selectHandCardNo == 65) {
                        this.setState(()=> {
                            this.state.player_1.hand_cards=[28, 32, 31, 42, 62];
                            this.state.last_card = 31;
                            this.state.step[4] = false;
                            this.state.step[5] = true;
                        })
                    }
                }
                // abandon
                else if(pos == -1 && this.state.step[3]) {
                    if(this.state.selectHandCardNo == 43) {
                        this.setState(()=> {
                            this.state.player_1.hand_cards=[28, 32, 31, 42, 65];
                            this.state.last_card = 32;
                            this.state.step[3] = false;
                            this.state.step[4] = true;
                        })
                    }
                }
                // reset select card
                this.setState({
                    selectHandCardNo: -1,
                    selectHandCardRotate: false
                });
            }
        } else {
            this.setState({
                alertMessage: {
                    msg_type: 'ILLEGAL_PLAY',
                    msg: 'Must select one hand card first'
                }
            }, () => {
                window.setTimeout(() => {
                    this.setState({alertMessage: null});
                }, 2000);
            });
        }
    }

    render() {

        // set alert message
        let alertMessage, msg = '　';
        if (this.props.socketErrorMessage !== null) {
            alertMessage = this.props.socketErrorMessage;
        } else if (this.state.alertMessage !== null) {
            alertMessage = this.state.alertMessage;
        } else {
            alertMessage = this.state.gameData.return_msg[0];
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
                case "ERROR":
                    variant = 'warning';
                    break;
                default:
                    variant = 'info';
                    break;
            }
        }

        if(this.state.step[5]) {
            msg = "is Gold !"
        }

        return (
            <>
            <h5 className="text-center m-0">
            <Badge variant={'brown'} className={'my-2'}>房間: {`XXX`}</Badge>
            <Badge variant={'outline-brown'} className={'ml-2 my-2'}>回合： 3 / 3</Badge>
            <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                卡池剩餘：{this.state.last_card}
            </Badge>
            </h5>
                <Helmet>
                    <title>{`遊玩導覽`}</title>
                </Helmet>
                <Badge className={'my-2 badge-block'} variant={variant}>{msg}</Badge>
                <Container>
                    <Row>
                        <Col xs={12} lg={8}>
                            {/* Deck */}
                            {this.state.gameData.board.card_no.map((row, i) =>(
                                <Row key={i} className={'d-flex justify-content-center'}>
                                    {row.map((card, j) => (
                                        <GameCard
                                        key={j}
                                        card_no={card}
                                        isRotated={this.state.gameData.board.rotate[i][j]}
                                        boardCard={true}
                                        onCardClick={() => this.handlePositionClick(i * 9 + j)}/>
                                    ))}
                                </Row>
                            ))}
                        </Col>
                        <Col xs={12} lg={4} className={'my-3'}>                            
                            {/* Rival name & status */}
                            <Row className="my-2">
                                <OverlayTrigger
                                        placement="top"
                                        overlay = {
                                            <Popover >
                                                <Popover.Title as="h3" style={{color: "black"}}>
                                                    <strong>自己的手牌</strong>
                                                </Popover.Title>
                                                <Popover.Content>
                                                    試試用第一張牌修復玩家1的工具吧
                                                </Popover.Content>
                                            </Popover>
                                        }
                                        show = {this.state.step[2]}
                                >
                                <OtherGamePlayer player={this.state.player_2} onPositionClick={this.handlePositionClick} onStepClick={this.handleStepClick} />
                                </OverlayTrigger>
                                <OverlayTrigger
                                        placement="top"
                                        overlay = {
                                            <Popover >
                                                <Popover.Title as="h3" style={{color: "black"}}>
                                                    <strong>使用功能牌</strong>
                                                </Popover.Title>
                                                <Popover.Content>
                                                    功能牌再點選後點擊玩家即可使用，試試用第一張牌破壞玩家2的工具吧
                                                </Popover.Content>
                                            </Popover>
                                        }
                                        show = {this.state.step[1]}
                                >
                                <OtherGamePlayer player={this.state.player_3} onPositionClick={this.handlePositionClick} onStepClick={this.handleStepClick}/>
                                </OverlayTrigger>
                            </Row>
                            <SelfGamePlayer
                                player={this.state.player_1}
                                playerID = {this.state.player_1.id}
                                nowPlaying={true}
                                selectHandCardNo={this.state.selectHandCardNo}
                                selectHandCardRotate={this.state.selectHandCardRotate}
                                onHandCardClick={this.handleHandCardClick}
                                onPositionClick={this.handlePositionClick}
                                onStepClick={this.handleStepClick}
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
            <Button variant={props.player.nowPlaying ? 'brown' : 'outline-brown'} size={'sm'} block={true}
            onClick={() => props.onPositionClick((BOARD_BASE + props.player.id))}
            >
                Player_{props.player.id}
            </Button>
            <div className="d-flex justify-content-center my-1">
                {props.player.action_state.map((ban, i) => (
                        <ActionStatus
                            key={i}
                            ban={ban}
                            actionType={i}
                            onPositionClick={() => props.onPositionClick((BOARD_BASE + props.player.id), i)}
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
    const identity = '好矮人';
    const [ResetTu, changeTu] = useState(false)

    return (
        <>
            {/* Your name & status */}
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'}>
                    <Button variant={'brown'} block={true} size={''}
                    onClick={() => props.onPositionClick((BOARD_BASE + props.playerID))}
                    >
                        You：{identity}
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
                        <Col xs={'auto'} className={'p-0 mx-1'}>$ : {2}</Col>
                    </Row>
                </Col>
            </Row>
            
            <Row className={'my-2'}>          
                <Col xs={8} lg={12} className={'px-2'} id="HandCardPopover">
                <OverlayTrigger
                            placement="top"
                            overlay = {
                                <Popover >
                                    <Popover.Title as="h3" style={{color: "black"}}>
                                        <strong>自己的手牌</strong>
                                    </Popover.Title>
                                    <Popover.Content>
                                        道路牌點選兩次可旋轉，試試把第一張牌旋轉後放到適合的位置吧
                                        <strong>提示: 第2排</strong>
                                    </Popover.Content>
                                </Popover>
                            }
                            show = {props.onStepClick(0)}
                        >                        
                        <OverlayTrigger
                            placement="top"
                            overlay = {
                                <Popover >
                                    <Popover.Title as="h3" style={{color: "black"}}>
                                        <strong>自己的手牌</strong>
                                    </Popover.Title>
                                    <Popover.Content>
                                        地圖牌在點選後可以選擇窺探終點牌，試試窺探中間的終點牌吧
                                    </Popover.Content>
                                </Popover>
                            }
                            show = {props.onStepClick(4)}
                    >
                        <OverlayTrigger
                            placement="top"
                            overlay = {
                                <Popover >
                                    <Popover.Title as="h3" style={{color: "black"}}>
                                        <strong>自己的手牌</strong>
                                    </Popover.Title>
                                    <Popover.Content>
                                        是黃金的話，我們需要破壞阻擋的路，試試用石頭破壞終點前一張的道路吧
                                    </Popover.Content>
                                </Popover>
                            }
                            show = {props.onStepClick(5)}
                    >
                        <OverlayTrigger
                            placement="top"
                            overlay = {
                                <Popover >
                                    <Popover.Title as="h3" style={{color: "black"}}>
                                        <strong>自己的手牌</strong>
                                    </Popover.Title>
                                    <Popover.Content>
                                        看來我們有機會迎向終點了，試試用最後一張道路牌連通到黃金吧
                                    </Popover.Content>
                                </Popover>
                            }
                            show = {props.onStepClick(6)}
                    >
                    <Row className={'d-flex justify-content-around px-2'}>
                        {props.player.hand_cards.map((card, i) => (
                            <GameCard
                                card_no={card}
                                isSelected={props.selectHandCardNo === card}
                                isRotated={props.selectHandCardNo === card ? props.selectHandCardRotate : false}
                                key={i}
                                onCardClick={() => props.onHandCardClick(card)}
                            />
                        ))}
                    </Row>
                    </OverlayTrigger>
                    </OverlayTrigger>
                    </OverlayTrigger>
                    </OverlayTrigger>
                </Col>
                
                <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center px-2 my-lg-2'}>
                    <Row>
                        <OverlayTrigger
                                placement="top"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>棄牌紐</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            當沒有可以用的卡牌時就要棄牌，試試丟棄最後一張卡吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(3)}
                        >
                        <Button variant={'brown'} className={'mx-1'} onClick={() => props.onPositionClick(-1)}>
                            <FontAwesomeIcon icon={faTrashAlt}/>
                        </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                                placement="top"
                                overlay = {
                                    <Popover >
                                        <Popover.Content>
                                            導覽結束，點擊離開房間去進行一場遊戲吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(7)}
                        >
                        <Button variant={'outline-brown'} className={'mx-1'} href={'/games/'}>
                            <FontAwesomeIcon icon={faDoorOpen}/>
                        </Button>
                        </OverlayTrigger>
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
        <Col xs={"auto"} className={'p-0 mx-1 cursor-pointer'} onClick={props.onPositionClick}>
            {/*<Image src={actionIcon} fluid/>*/}
            <FontAwesomeIcon icon={actionIcon} color={actionColor}/>
        </Col>
    );
}
export default Tutorial
