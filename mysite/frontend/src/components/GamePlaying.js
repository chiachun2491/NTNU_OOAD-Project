import React, {Component} from "react";

import {Container, Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHammer, faLightbulb, faShoppingCart, faTrashAlt, faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import GameCard from "../components/GameCard";

class GamePlaying extends Component {
    state = {};

    componentDidMount() {
    };

    render() {
        return (
            <>
                {/* Deck */}
                <Container className="my-3">
                    <Row>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                    </Row>
                    <Row>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                    </Row>
                    <Row>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                    </Row>
                    <Row>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                    </Row>
                    <Row>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                        <GameCard></GameCard>
                    </Row>
                </Container>

                {/* Rival name & status */}
                <Container>
                    <Row className="my-3">
                        <Col className="col-4">
                            <div className="nametag">Player1</div>
                            <div className="d-flex justify-content-center">
                                <span><FontAwesomeIcon className="tool" icon={faHammer}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faLightbulb}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faShoppingCart}/></span>
                            </div>
                            <div className="d-flex justify-content-center">
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                            </div>
                        </Col>
                        <Col className="col-4">
                            <div className="nametag">Player2</div>
                            <div className="d-flex justify-content-center">
                                <span><FontAwesomeIcon className="tool" icon={faHammer}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faLightbulb}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faShoppingCart}/></span>
                            </div>
                            <div className="d-flex justify-content-center">
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                            </div>
                        </Col>
                        <Col className="col-4">
                            <div className="nametag">Player3</div>
                            <div className="d-flex justify-content-center">
                                <span><FontAwesomeIcon className="tool" icon={faHammer}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faLightbulb}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faShoppingCart}/></span>
                            </div>
                            <div className="d-flex justify-content-center">
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                                <span><img className="handcard"/></span>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Your name & status */}
                <Container>
                    <Row>
                        <Col className="col-8">
                            <Row>
                                <button className="btn btn-primary" type="button">Jeffery : 好矮人</button>
                            </Row>
                        </Col>
                        <Col className="col-4 align-self-center d-flex justify-content-around">
                            <Row>
                                <span><FontAwesomeIcon className="tool" icon={faHammer}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faLightbulb}/></span>
                                <span><FontAwesomeIcon className="tool" icon={faShoppingCart}/></span>
                                <span>$ : 0</span>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-8">
                            <Row>
                                <Col className="mycard"></Col>
                                <Col className="mycard"></Col>
                                <Col className="mycard"></Col>
                                <Col className="mycard"></Col>
                                <Col className="mycard"></Col>
                            </Row>
                        </Col>
                        <Col className="col-4 align-self-center d-flex justify-content-around">
                            <Row>
                                <span><FontAwesomeIcon icon={faTrashAlt}/></span>
                                <span><FontAwesomeIcon icon={faDoorOpen}/></span>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default GamePlaying;