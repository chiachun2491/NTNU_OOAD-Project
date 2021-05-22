import React, {Component} from "react";
import {Row, Col, Button, Spinner} from "react-bootstrap";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Helmet} from "react-helmet";
import axiosInstance from "../Api";

class NetworkError extends Component {
    messageDefault = '重新連線中...';

    constructor(props) {
        super(props);
        this.state = {
            redirectURL: '/',
            timeout: 4000,
            message: this.messageDefault
        };
        this.countDownMsgSet = this.countDownMsgSet.bind(this);
    }

    componentDidMount() {
        const queryString = require('query-string');
        const parsed = queryString.parse(window.location.search);
        if ('next' in parsed) {
            this.setState({redirectURL: parsed.next});
        }
        this.connectServer();
    }

    countDownMsgSet(timeout) {
        if (timeout > 0) {
            this.setState({
                message: `再 ${timeout / 1000} 秒後重新嘗試連線...`
            });
            window.setTimeout(() => {
                this.countDownMsgSet(timeout - 1000);
            }, 1000);
        } else {
            this.setState({
                message: this.messageDefault
            });
            window.setTimeout(() => {
                this.connectServer();
            }, 1000);
        }
    };

    connectServer() {
        const newTimeout = Math.min(10000, this.state.timeout + 1000);
        if (newTimeout !== this.state.timeout) {
            this.setState({timeout: newTimeout});
        }
        axiosInstance.get('/auth/hello/')
            .then((response) => {
                console.log('connect server successfully', response);
                window.location.href = this.state.redirectURL;
            }).catch((err) => {
            console.log('connect error', err);
            this.countDownMsgSet(newTimeout);
        });
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>{'失去連線了！'}</title>
                </Helmet>
                <Row className={'d-flex align-items-center'}>
                    <Col xs={'12'} md={'6'} className={'p-5 d-flex justify-content-center'}>
                        <FontAwesomeIcon icon={faExclamationCircle} className={'icon-fluid tool'}/>
                    </Col>
                    <Col xs={'12'} md={'6'} className={'p-5'}>
                        <h1>Oh No!</h1>
                        <h3>失去連線了！</h3>
                        <p>目前與主機連線發生問題，試著檢查連線狀態或是等待我們為您重新連線。</p>
                        <Button variant={'brown'} disabled={true}><Spinner animation="border" size="sm" variant={'light'}/> {this.state.message}</Button>
                    </Col>
                </Row>
            </>
        );
    };
}

export default NetworkError;