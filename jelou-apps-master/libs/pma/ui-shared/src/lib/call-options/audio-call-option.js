import { CallIcon } from "@apps/shared/icons";

const AudioCallOption = (props) => {
    const { getCallShortId, setOpenCallOptions, openCallOptions } = props;

    return (
        <div
            onClick={() => {
                getCallShortId();
                setOpenCallOptions(!openCallOptions);
            }}
        >
            <CallIcon className="mx-auto" width="1.375rem" height="1.375rem" strokeWidth="1.5" stroke="currentColor" fill="currentColor" />
        </div>
    );
};

export default AudioCallOption;
