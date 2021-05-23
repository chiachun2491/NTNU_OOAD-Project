import React, { Component } from 'react';

import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';

class RoomItem extends Component {
    render() {
        let { roomName, playerAmount } = this.props;
        return (
            <Card className='my-2'>
                <Card.Body className='d-flex justify-content-between align-items-center'>
                    <span>
                        <FontAwesomeIcon icon={faUserFriends} /> {roomName} ({playerAmount} / 4)
                    </span>
                    <Button variant='brown' href={`/games/${roomName}/`}>
                        {' '}
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </Button>
                </Card.Body>
            </Card>
        );
    }
}

RoomItem.propTypes = {
    roomName: PropTypes.string,
    playerAmount: PropTypes.number,
};

export default RoomItem;
