import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

const PageNotFound = () => (
    <>
        <Helmet>
            <title>{'404：你迷路了！'}</title>
        </Helmet>
        <Row className={'d-flex align-items-center'}>
            <Col xs={'12'} md={'6'} className={'p-5 d-flex justify-content-center'}>
                <FontAwesomeIcon icon={faDoorClosed} className={'icon-fluid tool'} />
            </Col>
            <Col xs={'12'} md={'6'} className={'p-5'}>
                <h1>404</h1>
                <h3>你迷路了！</h3>
                <p>你現在訪問的頁面並不存在，按下方按鈕可以導引你回到首頁。</p>
                <Button variant={'brown'} href={'/'}>
                    <FontAwesomeIcon icon={faDoorOpen} /> 回到首頁
                </Button>
            </Col>
        </Row>
    </>
);

export default PageNotFound;
