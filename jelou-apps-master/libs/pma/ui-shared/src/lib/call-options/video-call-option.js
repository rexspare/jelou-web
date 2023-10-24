import { VideoCallIcon } from "@apps/shared/icons";

const VideoCallOption = (props) => {
    const { getVideoCallShortId, setOpenCallOptions, openCallOptions } = props;

    return (
        <div
            onClick={() => {
                getVideoCallShortId();
                setOpenCallOptions(!openCallOptions);
            }}
        >
            <VideoCallIcon className="m-2" width="1.563rem" height="1rem" fill="#4FAFC3" />
        </div>
    );
};

export default VideoCallOption;
