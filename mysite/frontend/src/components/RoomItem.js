import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const RoomItem = (props) => (
    <Card className='my-2'>
        <Card.Body className='d-flex justify-content-between align-items-center'>
            <span>
                <FontAwesomeIcon icon={faUserFriends} /> {props.roomName} ({props.playerAmount}
                {props.volume ? ` / ${props.volume}` : null})
            </span>
            <Button variant='brown' href={`/games/${props.roomName}/`}>
                <FontAwesomeIcon icon={faSignInAlt} />
            </Button>
        </Card.Body>
    </Card>
);

export default RoomItem;
