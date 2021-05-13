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

class GamePlaying extends Component {
    state = {};

    componentDidMount() {
    };

    // TODO: card state control

    render() {
        const username = localStorage.getItem('username');
        let self_id;
        const list_len = this.props.roomData.game_data.player_list.length;
        for (let i = 0; i < list_len; i++) {
            if (this.props.roomData.game_data.player_list[i].id === username) {
                self_id = i;
                break;
            }
        }
        let other_players = [];
        for (let i = 1; i < list_len; i++) {
            let player = this.props.roomData.game_data.player_list[(self_id + i) % list_len];
            other_players.push(<OtherGamePlayer key={player.id} player={player}/>);
        }
        return (
            <>
                <Container>
                    <Row>
                        <Col xs={12} lg={8}>
                            {/* Deck */}
                            {this.props.roomData.game_data.board.map((row, i) => {
                                return <Row key={i} className={'d-flex justify-content-center'}>
                                    {row.map((card, j) => {
                                        return <GameCard key={i.toString() + '-' + j.toString()} card_no={card.card_no}
                                                         boardCard={true}/>
                                    })}
                                </Row>
                            })}
                        </Col>
                        <Col xs={12} lg={4} className={'my-3'}>
                            {/* Rival name & status */}
                            <Row className="my-2">
                                {other_players}
                            </Row>
                            <SelfGamePlayer player={this.props.roomData.game_data.player_list[self_id]}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

class OtherGamePlayer extends Component {

    render() {
        let handcards = [];
        for (let i = 0; i < this.props.player.hand_cards.length; i++) {
            handcards.push(<span key={i} className="handCard"/>);
        }
        return (
            <Col xs={4} lg={12} className={"px-2"}>
                <Button variant={'brown'} disabled={true} size={'sm'} block={true}>{this.props.player.id}</Button>
                <div className="d-flex justify-content-center my-1">
                    {this.props.player.action_state.map((ban, i) => (
                        <ActionStatus key={i} actionType={i}/>
                    ))}
                </div>
                <div className="d-flex justify-content-around my-1">
                    {handcards}
                </div>
            </Col>
        );
    }
}


class SelfGamePlayer extends Component {

    render() {
        const identity = this.props.player.role ? '好矮人' : '壞矮人';
        return (
            <>
                {/* Your name & status */}
                <Row className={'my-2'}>
                    <Col xs={8} lg={12} className={'px-2'}>
                        <Button variant={'brown'} block={true} size={''}>
                            {this.props.player.id}：{identity}
                        </Button>
                    </Col>
                    <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center p-0'}>
                        <Row>
                            {this.props.player.action_state.map((ban, i) => (
                                <ActionStatus key={i} actionType={i}/>
                            ))}
                            <Col xs={'auto'} className={'p-0 mx-1'}>$ : {this.props.player.point}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={'my-2'}>
                    <Col xs={8} lg={12} className={'px-2'}>
                        <Row className={'px-2'}>
                            {this.props.player.hand_cards.map(card => (
                                <GameCard card_no={card.card_no}/>
                            ))}
                        </Row>
                    </Col>
                    <Col xs={4} lg={12} className={'d-flex justify-content-around align-self-center px-2 my-lg-2'}>
                        <Row>
                            <Button variant={'brown'} className={'mx-1'}><FontAwesomeIcon
                                icon={faTrashAlt}/></Button>
                            <Button variant={'outline-brown'} className={'mx-1'}><FontAwesomeIcon
                                icon={faDoorOpen}/></Button>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
}

class ActionStatus extends Component {

    render() {
        let actionIcon;
        let actionType = this.props.ban ? (this.props.actionType + 1) * -1 : this.props.actionType + 1;
        let actionColor = this.props.ban ? 'red' : 'lightgray';
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
            <Col xs={"auto"} className={'p-0 mx-1'}>
                {/*<Image src={actionIcon} fluid/>*/}
                <FontAwesomeIcon icon={actionIcon} color={actionColor} />
            </Col>
        );
    }
}

export default GamePlaying;