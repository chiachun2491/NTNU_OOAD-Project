import React, {Component} from "react";
import GameOrganzie from "./GameOrganzie";
import GamePlaying from "./GamePlaying";
import GameEnd from "./GameEnd";

let wsBaseURL;

if (process.env.NODE_ENV === 'production') {
    wsBaseURL = window.location.host;
} else {
    wsBaseURL = process.env.REACT_APP_API_URL;
}

const RoomStatus = {
    ORGANIZE: 'organize',
    PLAYING: 'playing',
    END: 'end'
};

class Game extends Component {
    state = {
        ws: null,
        roomName: '',
        status: 'organize',
    };

    componentDidMount() {
        const roomName = this.props.match.params.roomName;
        this.setState({roomName: roomName});
    };

    connectSocket(RoomName) {
        // TODO: socket connect
    }

    render() {
        let gameComponent = <div/>;
        if (this.state.status === RoomStatus.ORGANIZE) {
            gameComponent = <GameOrganzie/>;
        } else if (this.state.status === RoomStatus.PLAYING) {
            gameComponent = <GamePlaying/>;
        } else if (this.state.status === RoomStatus.END) {
            gameComponent = <GameEnd/>;
        }

        return (
            <>
                <div className="text-center">
                    <span className="nametag roomnumber">Room: {this.state.roomName}</span>
                </div>
                {gameComponent}
            </>
        );
    }
}

export default Game;