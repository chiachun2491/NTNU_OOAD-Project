import React from 'react';
import { Card, Image, Row, Col, Figure } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import card_ban1 from '../images/card/card_ban1.png';
import card_ban2 from '../images/card/card_ban2.png';
import card_ban3 from '../images/card/card_ban3.png';
import card_destroy from '../images/card/card_destroy.png';
import card_disban1 from '../images/card/card_disban1.png';
import card_disban2 from '../images/card/card_disban2.png';
import card_disban3 from '../images/card/card_disban3.png';
import card_disban4 from '../images/card/card_disban4.png';
import card_disban5 from '../images/card/card_disban5.png';
import card_disban6 from '../images/card/card_disban6.png';
import card_map from '../images/card/card_map.png';
import card_road0 from '../images/card/card_road0.png';
import card_road2 from '../images/card/card_road2.png';
import card_road3 from '../images/card/card_road3.png';
import card_road7 from '../images/card/card_road7.png';
import card_road9 from '../images/card/card_road9.png';
import card_road12 from '../images/card/card_road12.png';
import card_road17 from '../images/card/card_road17.png';
import card_road18 from '../images/card/card_road18.png';

function Rules() {
    return (
        <>
            <Helmet>
                <title>{'規則解說'}</title>
            </Helmet>
            <h5 className={'my-3 text-center'}>卡牌規則解說</h5>
            <Card className={'my-3 road-card'}>
                <Card.Header as='h5'>道路牌</Card.Header>
                <Card.Body>
                    <Row className={'row-cols-1 row-cols-md-2 row-cols-lg-3'}>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>起始牌</Card.Title>
                                    <Card.Text>
                                        <Row>
                                            <Col xs={3} className={'pr-0'}>
                                                <Image src={card_road0} fluid thumbnail />
                                            </Col>
                                            <Col xs={9} className={'d-flex align-items-center'}>
                                                遊戲開始就會放置於桌面上
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>終點牌</Card.Title>
                                    <Card.Text>
                                        <Row>
                                            <Col xs={3} className={'pr-0'}>
                                                <Image src={card_road17} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>金礦卡x1</Figure.Caption>
                                            </Col>
                                            <Col xs={3} className={'pr-0'}>
                                                <Image src={card_road18} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>石頭卡x2</Figure.Caption>
                                            </Col>
                                            <Col xs={6} className={'d-flex align-items-center'}>
                                                遊戲開始就會以卡牌背面放置於桌面上
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>一般道路牌：手牌</Card.Title>
                                    <Card.Text>
                                        <Row className={'d-flex justify-content-around'}>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_road3} fluid thumbnail />
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_road2} fluid thumbnail />
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_road7} fluid thumbnail />
                                            </Col>
                                        </Row>
                                        <Row className={'mt-2'}>
                                            <Col>
                                                出【一般道路牌】必須符合：
                                                <br />
                                                1. 道路要和道路相接，不可連到石壁
                                                <br />
                                                2. 新加入的【一般道路牌】，路徑要能夠連回到【起始牌】
                                                <br />
                                            </Col>
                                        </Row>
                                        <Row className={'px-3 mt-2 d-flex align-items-center'}>
                                            <Col xs={2} className={'px-0'}>
                                                <Image src={card_road0} fluid thumbnail />
                                            </Col>
                                            <Col xs={2} className={'px-0'}>
                                                <Image src={card_road3} fluid thumbnail />
                                            </Col>
                                            <Col xs={2} className={'px-0'}>
                                                <Image src={card_road12} fluid thumbnail />
                                            </Col>
                                            <Col xs={6} className={'d-flex align-items-center'}>
                                                <Figure.Caption>正確示範，道路可以連回【起始牌】</Figure.Caption>
                                            </Col>
                                        </Row>
                                        <Row className={'px-3 mt-2 d-flex align-items-center'}>
                                            <Col xs={2} className={'px-0'}>
                                                <Image src={card_road0} fluid thumbnail />
                                            </Col>
                                            <Col xs={2} className={'px-0'}>
                                                <Image src={card_road3} fluid thumbnail />
                                            </Col>
                                            <Col xs={2} className={'px-0'}>
                                                <Image src={card_road9} fluid thumbnail />
                                            </Col>
                                            <Col xs={6} className={'d-flex align-items-center'}>
                                                <Figure.Caption>錯誤示範，道路不可連到石壁</Figure.Caption>
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card className={'my-3 action-card'}>
                <Card.Header as='h5'>行動牌</Card.Header>
                <Card.Body>
                    <Row className={'row-cols-1 row-cols-md-2 row-cols-lg-3'}>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>破壞工具</Card.Title>
                                    <Card.Text>
                                        <Row className={'d-flex justify-content-around'}>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_ban1} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>破壞油燈</Figure.Caption>
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_ban2} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>破壞推車</Figure.Caption>
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_ban3} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>破壞鏟子</Figure.Caption>
                                            </Col>
                                        </Row>
                                        <Row className={'mt-2'}>
                                            <Col>
                                                把破壞工具放在任意一位玩家前面，被放置破壞工具的玩家就無法再出【道路牌】，只能選擇出【行動牌】或棄牌
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>修理工具</Card.Title>
                                    <Card.Text>
                                        <Row className={'d-flex justify-content-around'}>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_disban1} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>修理油燈</Figure.Caption>
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_disban2} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>修理推車</Figure.Caption>
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_disban3} fluid thumbnail />
                                                <Figure.Caption className={'text-center'}>修理鏟子</Figure.Caption>
                                            </Col>
                                        </Row>
                                        <Row className={'mt-2'}>
                                            <Col>
                                                修理工具可以將任意玩家面前的破壞工具修理，但只能修理相對應種類的工具
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>高級版修理工具</Card.Title>
                                    <Card.Text>
                                        <Row className={'d-flex justify-content-around'}>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_disban4} fluid thumbnail />
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_disban5} fluid thumbnail />
                                            </Col>
                                            <Col xs={3} className={'pr-0 mr-3'}>
                                                <Image src={card_disban6} fluid thumbnail />
                                            </Col>
                                        </Row>
                                        <Row className={'mt-2'}>
                                            <Col>
                                                卡牌上一次有兩種符號，代表可以修理符合的破壞工具，但是
                                                <strong>一次只能修理一個破壞工具</strong>
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>落石</Card.Title>
                                    <Card.Text>
                                        <Row>
                                            <Col xs={3} className={'pr-0'}>
                                                <Image src={card_destroy} fluid thumbnail />
                                            </Col>
                                            <Col xs={9} className={'d-flex align-items-center'}>
                                                打出此牌，可以將一張已經擺好的【一般道路牌】移出到棄牌堆
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={'mb-3'}>
                            <Card className={'h-100'}>
                                <Card.Body>
                                    <Card.Title>地圖</Card.Title>
                                    <Card.Text>
                                        <Row>
                                            <Col xs={3} className={'pr-0'}>
                                                <Image src={card_map} fluid thumbnail />
                                            </Col>
                                            <Col xs={9} className={'d-flex align-items-center'}>
                                                打出此牌，秘密地看1張【終點牌】的背面為金礦或者石頭
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
}

export default Rules;
