import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { faDoorOpen, faUsersSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';

function GameRoomNotFound() {
    return (
        <>
            <Helmet>
                <title>{'404：你走錯房間囉！'}</title>
            </Helmet>
            <Row className={'d-flex align-items-center'}>
                <Col xs={'12'} md={'6'} className={'p-5 d-flex justify-content-center'}>
                    <FontAwesomeIcon icon={faUsersSlash} className={'icon-fluid tool'} />
                </Col>
                <Col xs={'12'} md={'6'} className={'p-5'}>
                    <h1>404</h1>
                    <h3>你走錯房間囉！</h3>
                    <p>你現在進入的房間並不存在，按下方按鈕可以導引你回到遊戲大廳。</p>
                    <Button variant={'brown'} href={'/games/'}>
                        <FontAwesomeIcon icon={faDoorOpen} /> 回到大廳
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default GameRoomNotFound;
