import { useState, useEffect } from "react";

import { CHANNEL_TYPES } from "../../../../constants";
import { validateObjectParams } from "../../../../hooks/helpers";
import WhatsappChannel from "./whatsappChannel";
import WidgetChannel from "./WidgetChannel";
import MetaChannels from "./MetaChannels";
import SkeletonChannel from "./SkeletonChannel";

const ChannelSettings = (props) => {
    const {
        channelSelected = {},
        setChannelSelected,
        showPrincipalData,
        showSecondTab,
        showThirdTab,
        refetchChannel,
        openDeleteModal,
        showDeleteModal,
        setShowDeleteModal,
        closeDeleteModal,
        handleEditChannel,
        testers,
        setTesters,
        setInitialTesters,
        isLoadingChannel,
        selectedWidget,
        setSelectedWidget,
        setLinkFromOnPromise,
        onPromiseToProduction
    } = props;
    const { type } = channelSelected;
    const [enableEdition, setEnableEdition] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setChannelSelected((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnClick = () => {
        if (enableEdition) {
            handleEditChannel();
        }
    };

    useEffect(() => {
        const isValid = validateObjectParams({ obj: channelSelected, validate: { name: true } });
        setEnableEdition(isValid);
    }, [channelSelected]);

    if (isLoadingChannel) {
        return <SkeletonChannel />;
    }

    const showChannel = (type) => {
        switch (type) {
            case CHANNEL_TYPES.WHATSAPP:
                return (
                    <WhatsappChannel
                        onChangeName={handleOnChange}
                        openDeleteModal={openDeleteModal}
                        closeDeleteModal={closeDeleteModal}
                        channelSelected={channelSelected}
                        refetchChannel={refetchChannel}
                        showDeleteModal={showDeleteModal}
                        setChannelSelected={setChannelSelected}
                        testers={testers}
                        setTesters={setTesters}
                        setInitialTesters={setInitialTesters}
                        setLinkFromOnPromise={setLinkFromOnPromise}
                        onPromiseToProduction={onPromiseToProduction}
                    />
                );
            case CHANNEL_TYPES.FACEBOOK:
                return (
                    <MetaChannels
                        onChangeName={handleOnChange}
                        enableEdition={enableEdition}
                        handleOnClick={handleOnClick}
                        channelSelected={channelSelected}
                        openDeleteModal={openDeleteModal}
                        closeDeleteModal={closeDeleteModal}
                    />
                );
            case CHANNEL_TYPES.INSTAGRAM:
                return (
                    <MetaChannels
                        onChangeName={handleOnChange}
                        enableEdition={enableEdition}
                        handleOnClick={handleOnClick}
                        channelSelected={channelSelected}
                        openDeleteModal={openDeleteModal}
                        closeDeleteModal={closeDeleteModal}
                    />
                );
            case CHANNEL_TYPES.WEB:
                return (
                    <WidgetChannel
                        channelSelected={channelSelected}
                        showPrincipalData={showPrincipalData}
                        showSecondTab={showSecondTab}
                        showThirdTab={showThirdTab}
                        onChangeName={handleOnChange}
                        enableEdition={enableEdition}
                        handleOnClick={handleOnClick}
                        setShowDeleteModal={setShowDeleteModal}
                        openDeleteModal={openDeleteModal}
                        closeDeleteModal={closeDeleteModal}
                        selectedWidget={selectedWidget}
                        setSelectedWidget={setSelectedWidget}
                        setChannelSelected={setChannelSelected}
                    />
                );
            default:
                break;
        }
    };

    return <section className="flex flex-1 flex-col space-y-8 overflow-y-auto">{showChannel(type)}</section>;
};

export default ChannelSettings;
