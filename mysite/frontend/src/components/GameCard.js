import React from "react";
import {Col, Image} from 'react-bootstrap';

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
import card_road1 from '../images/card/card_road1.png';
import card_road2 from '../images/card/card_road2.png';
import card_road3 from '../images/card/card_road3.png';
import card_road4 from '../images/card/card_road4.png';
import card_road5 from '../images/card/card_road5.png';
import card_road6 from '../images/card/card_road6.png';
import card_road7 from '../images/card/card_road7.png';
import card_road8 from '../images/card/card_road8.png';
import card_road9 from '../images/card/card_road9.png';
import card_road10 from '../images/card/card_road10.png';
import card_road11 from '../images/card/card_road11.png';
import card_road12 from '../images/card/card_road12.png';
import card_road13 from '../images/card/card_road13.png';
import card_road14 from '../images/card/card_road14.png';
import card_road15 from '../images/card/card_road15.png';
import card_road16 from '../images/card/card_road16.png';
import card_road17 from '../images/card/card_road17.png';
import card_road18 from '../images/card/card_road18.png';


// card number define:
//     road: 0 ~ 43
//         0:          ╬ [1, 1, 1, 1, 1] start road
//         1:          ╬ [1, 1, 1, 1, 1] end road(gold)
//         2:          ╔ [1, 1, 1, 1, 1] end road(rock)
//         3:          ╔ [1, 1, 1, 1, 1] end road(rock)
//         4 ~ 7:      ║ [1, 1, 0, 1, 0]
//         8 ~ 12:     ╠ [1, 1, 1, 1, 0]
//         13 ~ 17:    ╬ [1, 1, 1, 1, 1]
//         18 ~ 21:    ╔ [1, 0, 1, 1, 0]
//         22 ~ 26:    ╗ [1, 0, 0, 1, 1]
//         27:         ╥ [0, 0, 0, 1, 0]
//         28:           [0, 1, 0, 1, 1]
//         29:           [0, 1, 1, 1, 1]
//         30:           [0, 0, 1, 1, 0]
//         31:           [0, 0, 0, 1, 1]
//         32:         ╡ [0, 0, 0, 0, 1]
//         33 ~ 37:    ╩ [1, 1, 1, 0, 1]
//         38 ~ 40:    ═ [1, 0, 1, 0, 1]
//         41:         ╫ [0, 1, 0, 1, 0]
//         42:           [0, 1, 1, 0, 1]
//         43:         ╪ [0, 0, 1, 0, 1]
//
//     action: 44 ~ 70
//         44 ~ 48:    miner_lamp(3 break)
//         49 ~ 53:    minecart(3 break)
//         54 ~ 58:    mine_pick(3 break)
//         59:         mine_pick + minecart
//         60:         mine_lamp + minecart
//         61:         mine_pick + mine_lamp
//         62 ~ 64:    rocks
//         65 ~ 70:     map


class GameCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            src: null,
            rotate: false,
        };
    }

    componentDidMount() {
        switch (this.props.card_no) {
            case 0:
                this.setState({src: card_road0});
                break;
            case 1:
                this.setState({src: card_road17});
                break;
            case 2:
            case 3:
                this.setState({src: card_road18});
                break;
            case 4:
            case 5:
            case 6:
            case 7:
                this.setState({src: card_road1});
                break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
                this.setState({src: card_road2});
                break;
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
                this.setState({src: card_road3});
                break;
            case 18:
            case 19:
            case 20:
            case 21:
                this.setState({src: card_road4});
                break;
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
                this.setState({src: card_road5});
                break;
            case 27:
                this.setState({src: card_road6});
                break;
            case 28:
                this.setState({src: card_road7});
                break;
            case 29:
                this.setState({src: card_road8});
                break;
            case 30:
                this.setState({src: card_road9});
                break;
            case 31:
                this.setState({src: card_road10});
                break;
            case 32:
                this.setState({src: card_road11});
                break;
            case 33:
            case 34:
            case 35:
            case 36:
            case 37:
                this.setState({src: card_road12});
                break;
            case 38:
            case 39:
            case 40:
                this.setState({src: card_road13});
                break;
            case 41:
                this.setState({src: card_road14});
                break;
            case 42:
                this.setState({src: card_road15});
                break;
            case 43:
                this.setState({src: card_road16});
                break;
            case 44:
            case 45:
            case 46:
                this.setState({src: card_ban2});
                break;
            case 47:
            case 48:
                this.setState({src: card_disban2});
                break;
            case 49:
            case 50:
            case 51:
                this.setState({src: card_ban1});
                break;
            case 52:
            case 53:
                this.setState({src: card_disban1});
                break;
            case 54:
            case 55:
            case 56:
                this.setState({src: card_ban3});
                break;
            case 57:
            case 58:
                this.setState({src: card_disban3});
                break;
            case 59:
                this.setState({src: card_disban4});
                break;
            case 60:
                this.setState({src: card_disban5});
                break;
            case 61:
                this.setState({src: card_disban6});
                break;
            case 62:
            case 63:
            case 64:
                this.setState({src: card_destroy});
                break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
                this.setState({src: card_map});
                break;
            default:
                this.setState({src: 'https://dummyimage.com/250x400/DCDFE8/DCDFE8.png'});
        }
    };

    render() {
        const boardCard = this.props.boardCard ? 'boardCard' : 'm-1';
        return (
            <Col className={'p-0 ' + boardCard}>
                <Image src={this.state.src} fluid/>
            </Col>
        );
    }
}

export default GameCard;