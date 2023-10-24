import { NAME_MAX_LENGTH, CHANNEL, NAME_MIN_LENGTH } from "../../../../constants";
import NameComponent from "../../../../Modal/nameComponent";
import WhatsappTesters from "../common/whatsappTesters";

const WhatsappChannel = (props) => {
    const { handleUpdateChannelValues, channelValues, testers, setTesters, setAreAllPhoneNumbersValid, areAllPhoneNumbersValid } = props;

    return (
        <>
            <div className="mb-4 text-sm text-gray-610">
                <NameComponent
                    placeholder={CHANNEL.SINGULAR_CAPITALIZED}
                    onChange={handleUpdateChannelValues}
                    itemValues={channelValues}
                    maxLength={NAME_MAX_LENGTH}
                    length={channelValues?.name?.length}
                    minLength={NAME_MIN_LENGTH}
                />
            </div>
            <WhatsappTesters
                testers={testers}
                setTesters={setTesters}
                setAreAllPhoneNumbersValid={setAreAllPhoneNumbersValid}
                areAllPhoneNumbersValid={areAllPhoneNumbersValid}
            />
        </>
    );
};

export default WhatsappChannel;
