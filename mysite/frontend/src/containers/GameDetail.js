import React, {Component} from "react";

import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUserFriends, faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import * as PropTypes from "prop-types";

class GameDetail extends Component {
    state = {
      data: ''
    };

    componentDidMount() {
        const roomName = this.props.match.params.roomName;
        this.setState({
            data: roomName
        });
    };

    render() {
        return (
            <div>
                {this.state.data}
            </div>
        );
    }
}

export default GameDetail;