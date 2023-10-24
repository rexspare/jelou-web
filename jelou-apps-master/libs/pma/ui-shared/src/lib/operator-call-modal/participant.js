import React, { Component } from "react";
import Track from "./track";
import "./VideoCall.css";

class Participant extends Component {
    constructor(props) {
        super(props);

        const existingPublications = Array.from(this.props.participant.tracks.values());
        const existingTracks = existingPublications.map((publication) => publication.track);
        const nonNullTracks = existingTracks.filter((track) => track !== null);

        this.state = {
            tracks: nonNullTracks,
        };
    }
    componentDidMount() {
        if (!this.props.localParticipant) {
            this.props.participant.on("trackSubscribed", (track) => this.addTrack(track));
        }
    }
    addTrack(track) {
        this.setState({
            tracks: [...this.state.tracks, track],
        });
    }
    render() {
        return (
            <div className="participant h-full justify-center overflow-hidden" id={this.props.participant.identity}>
                {this.state.tracks.map((track) => (
                    <Track
                        key={track}
                        filter={this.state.filter}
                        track={track}
                        name={this.props.name}
                        localParticipant={this.props.localParticipant}
                        expanded={this.props.expanded}
                        client={this.props.client}
                    />
                ))}
            </div>
        );
    }
}
export default Participant;
