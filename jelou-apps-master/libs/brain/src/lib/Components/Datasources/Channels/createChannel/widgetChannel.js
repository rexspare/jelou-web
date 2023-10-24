import NameComponent from "libs/brain/src/lib/Modal/nameComponent";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, CHANNEL } from "../../../../constants";

const widgetChannel = (props) => {
    const { handleUpdateChannelValues, channelValues } = props;
    return (
        <div className="pb-6">
            <NameComponent
                placeholder={CHANNEL.SINGULAR_CAPITALIZED}
                onChange={handleUpdateChannelValues}
                itemValues={channelValues}
                maxLength={NAME_MAX_LENGTH}
                length={channelValues?.name?.length}
                minLength={NAME_MIN_LENGTH}
            />
        </div>
    );
};

export default widgetChannel;
