import React from 'react';
import { Container, Row, Button, Col, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import GameCard from '../components/GameCard';
import { Helmet } from 'react-helmet';
import GamePlaying, { ActionStatus, OtherGamePlayer } from './GamePlaying';

const BOARD_BASE = 45;

class Tutorial extends GamePlaying {
    constructor(props) {
        super(props);

        this.state = {
            selectHandCardNo: -1,
            selectHandCardRotate: false,
            alertMessage: null,
            card_no: [
                [-1, -1, -1, -1, -1, -1, -1, -1, 73],
                [-1, -1, 19, 34, -1, -1, -1, -1, -1],
                [0, 38, 33, 23, -1, 18, 40, 26, 73],
                [-1, -1, -1, 8, 39, 13, -1, -1, -1],
                [-1, -1, -1, 28, -1, -1, -1, -1, 73],
            ],
            rotate: [
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
            ],
            gameData: {
                return_msg: '',
            },
            player_1: {
                id: 0,
                hand_cards: [9, 44, 57, 28, 32],
                action_state: [false, false, false],
            },
            player_2: {
                id: '玩家1',
                action_state: [false, false, true],
                nowPlaying: false,
                hand_cards: {
                    length: 5,
                },
            },
            player_3: {
                id: '玩家2',
                action_state: [false, false, false],
                nowPlaying: false,
                hand_cards: {
                    length: 5,
                },
            },
            last_card: 36,
            step: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            step_no : [9, 13, 44, 57, 43, 65, 26, 62, 25, 14, 25],
        };
        
        this.handleHandCardClick = this.handleHandCardClick.bind(this);
        this.handlePositionClick = this.handlePositionClick.bind(this);
        this.handleStepClick = this.handleStepClick.bind(this);
        this.handleBadgeClick = this.handleBadgeClick.bind(this);
    }

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
            let newState = this.state;
            if(cardNo === 9 && this.state.step[0]) {
                newState.step[0] = false;
                newState.step[1] = true;
                this.setState({newState});
            }
            else if(cardNo === 44 && this.state.step[2]) {
                newState.step[2] = false;
                newState.step[3] = true;
                this.setState({newState});
            }
            else if(cardNo === 57 && this.state.step[4]) {
                newState.step[4] = false;
                newState.step[5] = true;
                this.setState({newState});
            }
            else if(cardNo === 43 && this.state.step[6]) {
                newState.step[6] = false;
                newState.step[7] = true;
                this.setState({newState});
            }
            else if(cardNo === 65 && this.state.step[8]) {
                newState.step[8] = false;
                newState.step[9] = true;
                this.setState({newState});
            }
            else if(cardNo === 62 && this.state.step[10]) {
                newState.step[10] = false;
                newState.step[11] = true;
                this.setState({newState});
            }
            else if(cardNo === 14 && this.state.step[12]) {
                newState.step[12] = false;
                newState.step[13] = true;
                this.setState({newState});
            }
        }
    }

    handleStepClick(order, cardNo, order_no) {
        if(order < 14){
            return (this.state.step[order] && this.state.step_no[order_no] === cardNo)
        }
        else if(order === 14 || order === 15 || order === 16) {
            return (this.state.step[order])
        }
        return false;
    }

    handleBadgeClick(order) {
        let newState = this.state;
        if(order === 1 && this.state.step[14]) {
            newState.step[14] = false;
            newState.step[15] = true;
            this.setState({newState});
        }
        else if(order === 2 && this.state.step[15]) {
            newState.step[15] = false;
            newState.step[16] = true;
            this.setState({newState});
        }
        else if(order === 3 && this.state.step[16]) {
            newState.card_no[1][4] = -1;
            newState.rotate[1][4] = false;
            newState.card_no[2][7] = 26;
            newState.card_no[2][8] = 73;
            newState.player_1.hand_cards = [9, 44, 57, 28, 32];
            newState.player_2.action_state[2] = true;
            newState.player_3.action_state[0] = false;
            newState.step[0] = true;
            newState.step[16] = false;
            newState.last_card = 36;
            this.setState(newState);
        }
    }

    handlePositionClick(pos, action = -1) {
        if (this.state.selectHandCardNo !== -1) {
            if (this.cardIsMulti(this.state.selectHandCardNo) && action === -1 && pos >= BOARD_BASE) {
                this.setState(
                    {
                        alertMessage: {
                            msg_type: 'ILLEGAL_PLAY',
                            msg: 'Multi Action Card must select one tool to repair',
                        },
                    },
                    () => {
                        window.setTimeout(() => {
                            this.setState({ alertMessage: null });
                        }, 2000);
                    }
                );
            } else {
                let newState = this.state;
                // Road
                if(pos === 13 && this.state.selectHandCardRotate) {
                    if(this.state.selectHandCardNo == 9 && this.state.step[1]) {
                        newState.card_no[1][4] = 9;
                        newState.rotate[1][4] = true;
                        newState.player_1.hand_cards = [44, 57, 28, 32, 31];
                        newState.last_card = 35;
                        newState.step[1] = false;
                        newState.step[2] = true;
                        this.setState(newState);
                    }
                }
                // rock and end
                else if(pos === 25) {
                    if(this.state.selectHandCardNo === 62 && this.state.step[11]) {
                        newState.card_no[2][7] = -1;
                        newState.player_1.hand_cards = [28, 32, 31, 42, 14];
                        newState.step[11] = false;
                        newState.step[12] = true;
                        newState.last_card = 30;
                        this.setState(newState);
                    }
                    else if(this.state.selectHandCardNo === 14 && this.state.step[13]) {
                        newState.card_no[2][7] = 14;
                        newState.card_no[2][8] = 1;
                        newState.player_1.hand_cards = [28, 32, 31, 42, 61];
                        newState.step[13] = false;
                        newState.step[14] = true;
                        newState.last_card = 29;
                        this.setState(newState);
                    }
                }
                // ban
                else if(pos === BOARD_BASE + 2 && this.state.step[3]){
                    if(this.state.selectHandCardNo === 44){
                        newState.player_1.hand_cards = [57, 28, 32, 31, 42];
                        newState.step[3] = false;
                        newState.step[4] = true;
                        newState.last_card = 34;
                        newState.player_3.action_state[0] = true;
                        this.setState(newState);
                    }
                }
                // unban
                else if(pos === BOARD_BASE + 1 && this.state.step[5]) {
                    if(this.state.selectHandCardNo === 57) {
                        newState.player_1.hand_cards = [28, 32, 31, 42, 43];
                        newState.step[5] = false;
                        newState.step[6] = true;
                        newState.last_card = 33;
                        newState.player_2.action_state[2] = false;
                        this.setState(newState);
                    }
                }
                // map
                else if(pos === 26 && this.state.step[9]) {
                    if(this.state.selectHandCardNo === 65) {
                        newState.player_1.hand_cards = [28, 32, 31, 42, 62];
                        newState.step[9] = false;
                        newState.step[10] = true;
                        newState.last_card = 31;
                        this.setState(newState);
                    }
                }
                // abandon
                else if(pos === -1 && this.state.step[7]) {
                    if(this.state.selectHandCardNo === 43) {
                        newState.player_1.hand_cards = [28, 32, 31, 42, 65]
                        newState.step[7] = false;
                        newState.step[8] = true;
                        newState.last_card = 32;
                        this.setState(newState);
                    }
                }
                // reset select card
                this.setState({
                    selectHandCardNo: -1,
                    selectHandCardRotate: false,
                });
            }
        } else {
            this.setState(
                {
                    alertMessage: {
                        msg_type: 'ILLEGAL_PLAY',
                        msg: 'Must select one hand card first',
                    },
                },
                () => {
                    window.setTimeout(() => {
                        this.setState({ alertMessage: null });
                    }, 2000);
                }
            );
        }
    }

    render() {
        // set alert message
        let alertMessage,
            msg = '　';
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
                case 'ERROR':
                    variant = 'warning';
                    break;
                default:
                    variant = 'info';
                    break;
            }
        }

        if (this.state.step[10]) {
            msg = 'is Gold !';
        }

        return (
            <>
                <h5 className='text-center m-0'>
                    <Badge variant={'brown'} className={'my-2'}>
                        房間: {`新手教學`}
                    </Badge>
                    <OverlayTrigger
                        placement="bottom-start"
                        overlay = {
                            <Popover>
                                <Popover.Content>
                                    <strong>一場遊戲共會持續3回合</strong>
                                </Popover.Content>
                                <Badge>
                                <Button variant="outline-brown" size="sm" onClick={() => this.handleBadgeClick(1)}>下一步</Button>
                                </Badge>
                            </Popover>
                        }
                        show = {this.handleStepClick(14, 1, 1)}
                    >
                    <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                        回合： 3 / 3
                    </Badge>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="bottom-start"
                        overlay = {
                            <Popover>
                                <Popover.Content>
                                    <strong>當卡池與玩家的手牌都歸零時還未找到黃金就是壞矮人贏了</strong>
                                </Popover.Content>
                                <Badge>
                                <Button variant="outline-brown" size="sm" onClick={() => this.handleBadgeClick(2)}>下一步</Button>
                                </Badge>
                            </Popover>
                        }
                        show = {this.handleStepClick(15, 1, 1)}
                    >
                    <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                        卡池剩餘：{this.state.last_card}
                    </Badge>
                    </OverlayTrigger>
                </h5>
                <Helmet>
                    <title>{`新手教學`}</title>
                </Helmet>
                <Badge className={'my-2 badge-block'} variant={variant}>
                    {msg}
                </Badge>
                <Container>
                    <Row>
                        <Col xs={12} lg={8}>
                            {/* Deck */}
                            {this.state.card_no.map((row, i) => (
                                <Row key={i} className={'d-flex justify-content-center'}>
                                    {row.map((card, j) => (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay = {
                                                <Popover >
                                                    <Popover.Content>
                                                        <strong>放在這吧</strong>
                                                    </Popover.Content>
                                                </Popover>
                                            }
                                            show = {this.handleStepClick(1, (i*9+j), 1)}
                                        >
                                        <OverlayTrigger
                                            placement="top"
                                            overlay = {
                                                <Popover >
                                                    <Popover.Content>
                                                        <strong>查看這張牌吧</strong>
                                                    </Popover.Content>
                                                </Popover>
                                            }
                                            show = {this.handleStepClick(9, (i*9+j), 6)}
                                        >
                                        <OverlayTrigger
                                            placement="top"
                                            overlay = {
                                                <Popover >
                                                    <Popover.Content>
                                                        <strong>用石頭破壞這張牌吧</strong>
                                                    </Popover.Content>
                                                </Popover>
                                            }
                                            show = {this.handleStepClick(11, (i*9+j), 8)}
                                        >
                                        <OverlayTrigger
                                            placement="top"
                                            overlay = {
                                                <Popover >
                                                    <Popover.Content>
                                                        <strong>放在這裡就贏了 !</strong>
                                                    </Popover.Content>
                                                </Popover>
                                            }
                                            show = {this.handleStepClick(13, (i*9+j), 10)}
                                        >
                                        <GameCard
                                            key={j}
                                            card_no={card}
                                            isRotated={this.state.rotate[i][j]}
                                            boardCard={true}
                                            onCardClick={() => this.handlePositionClick(i * 9 + j)}
                                        />
                                        </OverlayTrigger>
                                        </OverlayTrigger>
                                        </OverlayTrigger>
                                        </OverlayTrigger>
                                    ))}
                                </Row>
                            ))}
                        </Col>
                        <Col xs={12} lg={4} className={'my-3'}>
                            {/* Rival name & status */}
                            <Row className='my-2'>
                                <OverlayTrigger
                                    placement="top"
                                    overlay = {
                                        <Popover >
                                            <Popover.Content>
                                                點擊這裡修復玩家1的工具吧，修復的工具為指定的喔
                                            </Popover.Content>
                                        </Popover>
                                    }
                                    show = {this.state.step[5]}
                                >
                                    <OtherGamePlayer
                                        player={this.state.player_2}
                                        onPositionClick={this.handlePositionClick}
                                        nowPlaying={false}
                                        playerID={1}
                                    />
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay = {
                                        <Popover >
                                            <Popover.Content>
                                                點擊這裡破壞玩家2的工具吧，被破壞的工具會呈現紅色
                                            </Popover.Content>
                                        </Popover>
                                    }
                                    show = {this.state.step[3]}
                                >
                                    <OtherGamePlayer
                                        player={this.state.player_3}
                                        onPositionClick={this.handlePositionClick}
                                        nowPlaying={false}
                                        playerID={2}
                                    />
                                </OverlayTrigger>
                            </Row>
                            <SelfGamePlayer
                                player={this.state.player_1}
                                playerID={this.state.player_1.id}
                                nowPlaying={true}
                                selectHandCardNo={this.state.selectHandCardNo}
                                selectHandCardRotate={this.state.selectHandCardRotate}
                                onHandCardClick={this.handleHandCardClick}
                                onPositionClick={this.handlePositionClick}
                                onStepClick={this.handleStepClick}
                                onBadgeClick={this.handleBadgeClick}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

function SelfGamePlayer(props) {
    const identity = '好矮人';

    return (
        <>
            {/* Your name & status */}
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'}>
                    <Button
                        variant={'brown'}
                        block={true}
                        size={''}
                        onClick={() => props.onPositionClick(BOARD_BASE + props.playerID)}>
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
                                onPositionClick={() => props.onPositionClick(BOARD_BASE + props.playerID, i)}
                            />
                        ))}
                        <Col xs={'auto'} className={'p-0 mx-1'}>
                            $ : {2}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'my-2'}>
                <Col xs={8} lg={12} className={'px-2'} id='HandCardPopover'>
                    <Row className={'d-flex justify-content-around px-2'}>
                        {props.player.hand_cards.map((card, i) => (
                            <OverlayTrigger
                                placement="top"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>自己的手牌</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            道路牌點選兩次可旋轉，試試把第一張牌旋轉後放到適合的位置吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(0, card, 0)}
                            >
                            <OverlayTrigger
                                placement="top"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>使用功能牌1</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            功能牌再點選後點擊玩家即可使用，試試破壞玩家的工具吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(2, card, 2)}
                            >
                            <OverlayTrigger
                                placement="top"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>使用功能牌2</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            工具可以被破壞也可以被修復，試試修復玩家的工具吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(4, card, 3)}
                            >
                            <OverlayTrigger
                                placement="top-end"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>棄牌</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            當沒有可以用的卡牌時就要棄牌，試試丟棄最後一張卡吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(6, card, 4)}
                            >
                            <OverlayTrigger
                                placement="top-end"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>地圖牌</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            地圖牌在點選後可以選擇窺探終點牌，試試窺探中間的終點牌吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(8, card, 5)}
                             >
                            <OverlayTrigger
                                placement="top-end"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>使用功能牌3</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            既然黃金的話，我們需要破壞阻擋的路，用石頭破壞終點前一張的道路吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(10, card, 7)}
                            >
                            <OverlayTrigger
                                placement="top-end"
                                overlay = {
                                    <Popover >
                                        <Popover.Title as="h3" style={{color: "black"}}>
                                            <strong>抵達終點</strong>
                                        </Popover.Title>
                                        <Popover.Content>
                                            看來我們有機會迎向終點了，試試用最後一張道路牌連通到黃金吧
                                        </Popover.Content>
                                    </Popover>
                                }
                                show = {props.onStepClick(12, card, 9)}
                            >
                            <GameCard
                                card_no={card}
                                isSelected={props.selectHandCardNo === card}
                                isRotated={
                                    props.selectHandCardNo === card ? props.selectHandCardRotate : false
                                }
                                key={i}
                                onCardClick={() => props.onHandCardClick(card)}
                            />
                            </OverlayTrigger>
                            </OverlayTrigger>
                            </OverlayTrigger>
                            </OverlayTrigger>
                            </OverlayTrigger>
                            </OverlayTrigger>
                            </OverlayTrigger>
                        ))}
                    </Row>
                </Col>
                <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center px-2 my-lg-2'}>
                    <Row>
                        <OverlayTrigger
                            placement="top"
                            overlay = {
                                <Popover >
                                    <Popover.Content>
                                        點選這裡棄牌
                                    </Popover.Content>
                                </Popover>
                            }
                            show = {props.onStepClick(7, 43, 4)}
                        >
                            <Button variant={'brown'} className={'mx-1'} onClick={() => props.onPositionClick(-1)}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay = {
                                <Popover >
                                    <Popover.Content>
                                        導覽結束，點擊離開房間去進行一場遊戲吧
                                    </Popover.Content>
                                    <Badge>
                                    <Button variant="outline-brown" onClick = {() => props.onBadgeClick(3)}>再看一次</Button>
                                    </Badge>
                                </Popover>
                            }
                            show = {props.onStepClick(16, 1, 1)}
                        >
                            <Button variant={'outline-brown'} className={'mx-1'} href={'/games/'}>
                                <FontAwesomeIcon icon={faDoorOpen} />
                            </Button>
                        </OverlayTrigger>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default Tutorial;
