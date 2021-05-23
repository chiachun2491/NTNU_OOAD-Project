import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { faGrinStars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import demo from '../images/homepage/demo.png';

const Home = () => {
    return (
        <>
            <Row className={'d-flex align-items-center'}>
                <Col xs={'12'} md={'6'} className={'p-3 p-md-5 d-flex justify-content-center'}>
                    <img src={demo} alt='Demo' class='img-fluid' />
                </Col>
                <Col xs={'12'} md={'6'} className={'pt-3 pb-5 px-5 p-md-5'}>
                    <h1>矮人礦坑</h1>
                    <p>無需下載，直接使用瀏覽器與你的朋友一起遊玩！</p>
                    <Button variant={'brown'} href={'/games/'}>
                        <FontAwesomeIcon icon={faGrinStars} /> 開始遊戲
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default Home;
