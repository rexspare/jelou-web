import React, { useState } from "react";
import OperatorCallModal from "./operator-call-modal";

const LayoutOperatorCall = (props) => {
    const { hasIncomingCall, setHasIncomingCall, hasIncomingVideoCall, setHasIncomingVideoCall, room, company, clientAudio, currentRoom } = props;
    const [activeAudio, setActiveAudio] = useState(true);
    const [activeVideo, setActiveVideo] = useState(true);

    const handleCloseCall = () => {
        setHasIncomingCall(false);
        room.localParticipant.tracks.forEach(({ track }) => {
            track.stop();
            room.localParticipant.unpublishTrack(track);
        });
    };

    const handleCloseVideoCall = () => {
        setHasIncomingVideoCall(false);
        room.localParticipant.tracks.forEach(({ track }) => {
            track.stop();
            room.localParticipant.unpublishTrack(track);
        });
    };

    const muteAudio = () => {
        room.localParticipant.audioTracks.forEach((publication) => {
            publication.track.disable();
        });
        setActiveAudio(false);
    };
    const unmuteAudio = () => {
        room.localParticipant.audioTracks.forEach((publication) => {
            publication.track.enable();
        });
        setActiveAudio(true);
    };
    const stopVideo = () => {
        room.localParticipant.videoTracks.forEach((publication) => {
            publication.track.disable();
        });
        setActiveVideo(false);
    };
    const startVideo = () => {
        room.localParticipant.videoTracks.forEach((publication) => {
            publication.track.enable();
        });
        setActiveVideo(true);
    };

    return (
        <>
            {hasIncomingCall && (
                <OperatorCallModal
                    handleCloseCall={handleCloseCall}
                    activeAudio={activeAudio}
                    room={room}
                    muteAudio={muteAudio}
                    unmuteAudio={unmuteAudio}
                    currentRoom={currentRoom}
                    clientAudio={clientAudio}
                />
            )}
            {hasIncomingVideoCall && (
                <OperatorCallModal
                    handleCloseCall={handleCloseVideoCall}
                    isVideo={true}
                    room={room}
                    activeAudio={activeAudio}
                    activeVideo={activeVideo}
                    muteAudio={muteAudio}
                    unmuteAudio={unmuteAudio}
                    stopVideo={stopVideo}
                    startVideo={startVideo}
                    currentRoom={currentRoom}
                    clientAudio={clientAudio}
                    company={company}
                />
            )}
        </>
    );
};

export default LayoutOperatorCall;
