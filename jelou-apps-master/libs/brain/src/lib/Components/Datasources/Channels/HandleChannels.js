import "react-phone-number-input/style.css";
import { CHANNEL_TYPES } from "../../../constants";
import ChannelMeta from "./TypesComponents/ChannelMeta";
import WhatsappChannel from "./createChannel/whatsappChannel";
import WidgetChannel from "./createChannel/widgetChannel";

const HandleChannels = (props) => {
    const {
        handleUpdateChannelValues,
        channelSelected,
        channelValues,
        testers,
        setTesters,
        setAreAllPhoneNumbersValid,
        authWithFacebook,
        setAuthWithFacebook,
        instagramRequirementsView,
        areAllPhoneNumbersValid
    } = props;

    return (
        <>
            {channelSelected.id === CHANNEL_TYPES.WHATSAPP && (
                <WhatsappChannel
                    handleUpdateChannelValues={handleUpdateChannelValues}
                    channelValues={channelValues}
                    testers={testers}
                    setTesters={setTesters}
                    setAreAllPhoneNumbersValid={setAreAllPhoneNumbersValid}
                    areAllPhoneNumbersValid={areAllPhoneNumbersValid}
                />
            )}
            {(channelSelected.id === CHANNEL_TYPES.FACEBOOK || channelSelected.id === CHANNEL_TYPES.INSTAGRAM) && (
                <ChannelMeta
                    setIsAuthWithMeta={setAuthWithFacebook}
                    isAuthWithMeta={authWithFacebook}
                    channelValues={channelValues}
                    handleChange={handleUpdateChannelValues}
                    channelSelected={channelSelected}
                    instagramRequirementsView={instagramRequirementsView}
                />
            )}
            {channelSelected?.id === CHANNEL_TYPES.WEB && (
                <WidgetChannel handleUpdateChannelValues={handleUpdateChannelValues} channelValues={channelValues} />
            )}
        </>
    );
};

export default HandleChannels;
