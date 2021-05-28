import React, { Component } from 'react';
import { Badge } from 'react-bootstrap';
import GamePlaying from '../components/game/GamePlaying';
import { TutorialPopover, TutorialOverlayTrigger } from '../components/TutorialOverlay';

class Tutorial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName: '新手教學',
            roomData: {
                game_data: TutorialGameData,
            },
            nowStep: TutorialStep.INTRO,
        };
        this.changeStep = this.changeStep.bind(this);
        this.handlePopoverBtnClick = this.handlePopoverBtnClick.bind(this);
    }

    changeStep(cardNo = null, rotate = null, pos = null, action = null, button = null) {
        let newState = this.state;
        let gameData = newState.roomData.game_data;
        const username = localStorage.getItem('username') ? localStorage.getItem('username') : '你';
        // console.log(newState.nowStep, cardNo, rotate, pos, action, button);
        if (newState.nowStep === TutorialStep.INTRO && button === true) {
            newState.nowStep = TutorialStep.SELECT_ROAD_AND_ROTATE;
        } else if (newState.nowStep === TutorialStep.SELECT_ROAD_AND_ROTATE && cardNo === 9 && rotate === true) {
            newState.nowStep = TutorialStep.USE_ROTATE_ROAD_ON_BOARD;
        } else if (
            newState.nowStep === TutorialStep.USE_ROTATE_ROAD_ON_BOARD &&
            cardNo === 9 &&
            rotate === true &&
            pos === 13
        ) {
            newState.nowStep = TutorialStep.SELECT_BROKEN;
            gameData.board[1][4] = { rotate: true, card_no: 9, road_type: 1 };
            gameData.player_list[0].hand_cards[0] = { rotate: false, card_no: 31, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'INFO', msg: `${username} 放置道路在 (2, 5)` };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.SELECT_BROKEN && cardNo === 44) {
            newState.nowStep = TutorialStep.USE_BROKEN_ON_PLAYER;
        } else if (newState.nowStep === TutorialStep.USE_BROKEN_ON_PLAYER && cardNo === 44 && pos === 47) {
            newState.nowStep = TutorialStep.SELECT_REPAIR;
            gameData.player_list[2].action_state[0] = true;
            gameData.player_list[0].hand_cards[1] = { rotate: false, card_no: 42, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'INFO', msg: `${username} 破壞了 玩家 2 的油燈` };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.SELECT_REPAIR && cardNo === 57) {
            newState.nowStep = TutorialStep.USE_REPAIR_ON_PLAYER;
        } else if (newState.nowStep === TutorialStep.USE_REPAIR_ON_PLAYER && cardNo === 57 && pos === 46) {
            newState.nowStep = TutorialStep.SELECT_DROP;
            gameData.player_list[1].action_state[2] = false;
            gameData.player_list[0].hand_cards[2] = { rotate: false, card_no: 43, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'INFO', msg: `${username} 修理了 玩家 1 的鏟子` };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.SELECT_DROP && cardNo === 28) {
            newState.nowStep = TutorialStep.USE_DROP_CARD;
        } else if (newState.nowStep === TutorialStep.USE_DROP_CARD && cardNo === 28 && pos === -1) {
            newState.nowStep = TutorialStep.SELECT_MAP;
            gameData.player_list[0].hand_cards[3] = { rotate: false, card_no: 65, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'INFO', msg: `${username} 棄牌` };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.SELECT_MAP && cardNo === 65) {
            newState.nowStep = TutorialStep.USE_MAP_ON_BOARD;
        } else if (newState.nowStep === TutorialStep.USE_MAP_ON_BOARD && cardNo === 65 && pos === 26) {
            newState.nowStep = TutorialStep.SELECT_ROCK;
            gameData.player_list[0].hand_cards[3] = { rotate: false, card_no: 62, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'PEEK', msg: '(3, 9) 是金塊' };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.SELECT_ROCK && cardNo === 62) {
            newState.nowStep = TutorialStep.USE_ROCK_ON_BOARD;
        } else if (newState.nowStep === TutorialStep.USE_ROCK_ON_BOARD && cardNo === 62 && pos === 25) {
            newState.nowStep = TutorialStep.SELECT_FINAL_ROAD;
            gameData.board[2][7] = { rotate: false, card_no: -1, road_type: 1 };
            gameData.player_list[0].hand_cards[3] = { rotate: false, card_no: 14, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'INFO', msg: `${username} 使用落石摧毀 (3, 8)` };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.SELECT_FINAL_ROAD && cardNo === 14) {
            newState.nowStep = TutorialStep.USE_FINAL_ROAD_ON_BOARD;
        } else if (newState.nowStep === TutorialStep.USE_FINAL_ROAD_ON_BOARD && cardNo === 14 && pos === 25) {
            newState.nowStep = TutorialStep.CONGRATS;
            gameData.board[2][7] = { rotate: false, card_no: 14, road_type: 1 };
            gameData.board[2][8] = { rotate: false, card_no: 1, road_type: 1 };
            gameData.player_list[0].hand_cards[3] = { rotate: false, card_no: 61, road_type: 1 };
            gameData.return_msg[0] = { msg_type: 'INFO', msg: `第 1 回合 好矮人獲勝` };
            gameData.card_pool -= 1;
        } else if (newState.nowStep === TutorialStep.CONGRATS && button === true) {
            newState.nowStep = TutorialStep.TOTAL_ROUNDS;
        } else if (newState.nowStep === TutorialStep.TOTAL_ROUNDS && button === true) {
            newState.nowStep = TutorialStep.HOW_SABOTEUR_WIN;
        } else if (newState.nowStep === TutorialStep.HOW_SABOTEUR_WIN && button === true) {
            newState.nowStep = TutorialStep.END_TUTORIAL;
        } else if (newState.nowStep === TutorialStep.END_TUTORIAL && button === true) {
            window.location.reload(false);
        } else {
            return;
        }
        this.setState(
            {
                nowStep: {
                    title: null,
                    content: null,
                    button: null,
                    showPosition: null,
                },
            },
            () => {
                window.setTimeout(() => {
                    this.setState(newState);
                }, 100);
            }
        );
    }

    handlePopoverBtnClick() {
        this.changeStep(undefined, undefined, undefined, undefined, true);
    }

    render() {
        const nowStep = this.state.nowStep;
        const popover = TutorialPopover(nowStep.title, nowStep.content, nowStep.button, this.handlePopoverBtnClick);
        return (
            <>
                <h5 className='text-center m-0'>
                    <Badge variant={'brown'} className={'my-2'}>
                        房間: {this.state.roomName}
                    </Badge>
                    <TutorialOverlayTrigger
                        placement={'bottom-start'}
                        overlay={popover}
                        show={nowStep.showPosition === `ROUND_BADGE`}>
                        <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                            回合： {this.state.roomData.game_data.round} / 3
                        </Badge>
                    </TutorialOverlayTrigger>
                    <TutorialOverlayTrigger
                        placement={'bottom-start'}
                        overlay={popover}
                        show={nowStep.showPosition === `POOL_BADGE`}>
                        <Badge variant={'outline-brown'} className={'ml-2 my-2'}>
                            卡池剩餘：{this.state.roomData.game_data.card_pool}
                        </Badge>
                    </TutorialOverlayTrigger>
                </h5>
                <GamePlayingTutorial
                    roomName={this.state.roomName}
                    roomData={this.state.roomData}
                    socketErrorMessage={null}
                    popover={popover}
                    nowStep={this.state.nowStep}
                    changeStep={this.changeStep}
                />
            </>
        );
    }
}

class GamePlayingTutorial extends GamePlaying {
    handleHandCardClick(cardNo) {
        if (cardNo !== this.state.selectHandCardNo) {
            // change select card and reset rotate
            this.setState(
                {
                    selectHandCardNo: cardNo,
                    selectHandCardRotate: false,
                },
                () => {
                    this.props.changeStep(
                        this.state.selectHandCardNo,
                        this.state.selectHandCardRotate,
                        undefined,
                        undefined,
                        undefined
                    );
                }
            );
        } else {
            if (this.cardCanRotate(cardNo)) {
                this.setState(
                    {
                        selectHandCardRotate: !this.state.selectHandCardRotate,
                    },
                    () => {
                        this.props.changeStep(
                            this.state.selectHandCardNo,
                            this.state.selectHandCardRotate,
                            undefined,
                            undefined,
                            undefined
                        );
                    }
                );
            }
        }
    }
    handlePositionClick(pos, action = -1) {
        document.activeElement.blur();
        if (this.actionIsLegal(pos, action)) {
            this.props.changeStep(this.state.selectHandCardNo, this.state.selectHandCardRotate, pos, action, undefined);
        }
    }
}

const TutorialGameData = {
    board: [
        [
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 73,
                road_type: 2,
            },
        ],
        [
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 19,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 34,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
        ],
        [
            {
                rotate: 0,
                card_no: 0,
                road_type: 0,
            },
            {
                rotate: 0,
                card_no: 38,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 33,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 23,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 18,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 40,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 26,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 73,
                road_type: 2,
            },
        ],
        [
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 1,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 8,
                road_type: 1,
            },
            {
                rotate: 1,
                card_no: 39,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 13,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
        ],
        [
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 28,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 1,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 1,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: -1,
                road_type: 1,
            },
            {
                rotate: 0,
                card_no: 73,
                road_type: 2,
            },
        ],
    ],
    round: 1,
    now_play: localStorage.getItem('username') ? localStorage.getItem('username') : '你',
    return_msg: [
        {
            msg: `Hi! ${localStorage.getItem('username') ? localStorage.getItem('username') : ''} 跟著指示一起操作吧！`,
            msg_type: 'ERROR',
        },
        {
            msg: '',
            msg_type: '',
        },
        {
            msg: '',
            msg_type: '',
        },
    ],
    player_list: [
        {
            id: localStorage.getItem('username') ? localStorage.getItem('username') : '你',
            role: true,
            point: 0,
            hand_cards: [
                {
                    rotate: 0,
                    card_no: 9,
                    road_type: 1,
                },
                {
                    rotate: 0,
                    card_no: 44,
                    road_type: 1,
                },
                {
                    rotate: 0,
                    card_no: 57,
                    road_type: 1,
                },
                {
                    rotate: 0,
                    card_no: 28,
                    road_type: 1,
                },
                {
                    rotate: 0,
                    card_no: 32,
                    road_type: 1,
                },
            ],
            action_state: [false, false, false],
        },
        {
            id: '玩家 1',
            role: false,
            point: 0,
            hand_cards: [0, 0, 0, 0, 0],
            action_state: [false, false, true],
        },
        {
            id: '玩家 2',
            role: true,
            point: 0,
            hand_cards: [0, 0, 0, 0, 0],
            action_state: [false, false, false],
        },
    ],
    card_pool: 36,
};

const TutorialStep = {
    INTRO: {
        title: '玩家陣營 好矮人 v.s 壞矮人',
        content: '你是好矮人，目的是將道路連線到終點牌的金塊',
        button: '好喔！那我該怎麼做？',
        showPosition: 'SELF_BTN',
    },
    SELECT_ROAD_AND_ROTATE: {
        title: '自己的手牌',
        content: '道路牌點選兩次可旋轉，試試把第一張牌旋轉後放到適合的位置吧',
        button: null,
        showPosition: 'SELF_CARD_0',
    },
    USE_ROTATE_ROAD_ON_BOARD: {
        title: null,
        content: '放在這吧',
        button: null,
        showPosition: 'BOARD_13',
    },
    SELECT_BROKEN: {
        title: '使用破壞牌',
        content: '功能牌再點選後點擊玩家即可使用，試試破壞玩家的工具吧',
        button: null,
        showPosition: 'SELF_CARD_1',
    },
    USE_BROKEN_ON_PLAYER: {
        title: null,
        content: '點擊這裡破壞玩家 2的工具吧，被破壞的工具會呈現紅色',
        button: null,
        showPosition: 'PLAYER_2',
    },
    SELECT_REPAIR: {
        title: '使用修復牌',
        content: '工具可以被破壞也可以被修復，試試修復玩家的工具吧',
        button: null,
        showPosition: 'SELF_CARD_2',
    },
    USE_REPAIR_ON_PLAYER: {
        title: null,
        content: '點擊這裡修復玩家 1的工具吧，修復的工具為指定的喔',
        button: null,
        showPosition: 'PLAYER_1',
    },
    SELECT_DROP: {
        title: '棄牌',
        content: '當沒有可以用的卡牌時就要棄牌，試試丟棄這張卡吧',
        button: null,
        showPosition: 'SELF_CARD_3',
    },
    USE_DROP_CARD: {
        title: null,
        content: '點選這裡棄牌',
        button: null,
        showPosition: 'DROP_BTN',
    },
    SELECT_MAP: {
        title: '使用地圖牌',
        content: '地圖牌在點選後可以選擇窺探終點牌，試試窺探中間的終點牌吧',
        button: null,
        showPosition: 'SELF_CARD_3',
    },
    USE_MAP_ON_BOARD: {
        title: null,
        content: '查看這張牌吧',
        button: null,
        showPosition: 'BOARD_26',
    },
    SELECT_ROCK: {
        title: '使用落石牌',
        content: '既然黃金的話，我們需要破壞阻擋的路，用落石牌破壞終點前的道路吧',
        button: null,
        showPosition: 'SELF_CARD_3',
    },
    USE_ROCK_ON_BOARD: {
        title: null,
        content: '用落石牌破壞這塊道路吧',
        button: null,
        showPosition: 'BOARD_25',
    },
    SELECT_FINAL_ROAD: {
        title: '快到終點了',
        content: '看來我們有機會迎向終點了，試試用這張道路牌連通到黃金吧',
        button: null,
        showPosition: 'SELF_CARD_3',
    },
    USE_FINAL_ROAD_ON_BOARD: {
        title: null,
        content: '放在這裡就贏了！',
        button: null,
        showPosition: 'BOARD_25',
    },
    CONGRATS: {
        title: null,
        content: '恭喜好矮人贏了！',
        button: '太好了',
        showPosition: 'BOARD_26',
    },
    TOTAL_ROUNDS: {
        title: null,
        content: '一場遊戲共會持續 3 回合',
        button: '下一步',
        showPosition: 'ROUND_BADGE',
    },
    HOW_SABOTEUR_WIN: {
        title: null,
        content: '當卡池與玩家的手牌都歸零時還未找到黃金就是壞矮人贏了',
        button: '下一步',
        showPosition: 'POOL_BADGE',
    },
    END_TUTORIAL: {
        title: null,
        content: '導覽結束，點擊離開房間去進行一場遊戲吧',
        button: '再看一次',
        showPosition: 'LEAVE_BTN',
    },
};

export default Tutorial;
