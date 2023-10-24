import React, { Component } from "react";
import Participant from "./participant";
import "./VideoCall.css";

class ParticipantRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remoteParticipants: Array.from(this.props.room.participants.values()),
        };

        this.leaveRoom = this.leaveRoom.bind(this);
    }
    componentDidMount() {
        // Add event listeners for future remote participants coming or going
        this.props.room.on("participantConnected", (participant) => {
            // console.log("Participant connected: " + participant.identity);
            this.addParticipant(participant);
        });
        this.props.room.on("participantDisconnected", (participant) => this.removeParticipant(participant));

        window.addEventListener("beforeunload", this.leaveRoom);
    }

    componentWillUnmount() {
        this.leaveRoom();
    }

    addParticipant(participant) {
        console.log(`${participant.identity} has joined the room.`);

        this.setState({
            remoteParticipants: [...this.state.remoteParticipants, participant],
        });
    }

    removeParticipant(participant) {
        console.log(`${participant.identity} has left the room`);

        this.setState({
            remoteParticipants: this.state.remoteParticipants.filter((p) => p.identity !== participant.identity),
        });
    }
    leaveRoom() {
        this.props.returnToLobby();
    }

    render() {
        return (
            <div className="room h-full w-full">
                <div className=" participants h-full w-full place-content-center justify-center">
                    <div className="absolute inset-x-0 top-0 flex h-full w-full flex-1 flex-col content-center justify-center">
                        <div className="tracks-container h-full w-full items-center justify-items-center">
                            {this.state.remoteParticipants.map((participant) => (
                                <Participant
                                    key={participant.identity}
                                    participant={participant}
                                    expanded={this.props.expanded}
                                    name={this.props.clientName}
                                    client={true}
                                />
                            ))}
                            {this.props.isVideo && (
                                <div
                                    className={`absolute ${
                                        this.props.expanded ? `bottom-4 right-4 h-1/5 w-1/5` : `top-4 left-4 h-1/4 w-1/3`
                                    } flex flex-1 flex-col content-center justify-center overflow-hidden rounded-lg`}>
                                    <Participant
                                        key={this.props.room.localParticipant.identity}
                                        localParticipant="true"
                                        participant={this.props.room.localParticipant}
                                        expanded={this.props.expanded}
                                        client={false}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ParticipantRoom;
