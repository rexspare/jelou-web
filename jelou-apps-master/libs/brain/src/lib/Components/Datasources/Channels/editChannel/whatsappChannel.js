import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { useSelector } from "react-redux";

import { CHANNEL_PRODUCTION_TYPE } from "libs/brain/src/lib/constants";
import { useProductionCloud } from "../../../../services/brainAPI";
import WhatsappCloud from "./WhatsappCloud";
import WhatsappGupshup from "./WhatsappGupshup";
import WhatsappSandbox from "./WhatsappSandbox";

const WhatsappChannel = (props) => {
    const {
        onChangeName,
        openDeleteModal,
        channelSelected,
        refetchChannel,
        setChannelSelected,
        setTesters,
        setInitialTesters,
        testers,
        setLinkFromOnPromise,
        onPromiseToProduction
    } = props;

    const [cloudOptions, setCloudOptions] = useState({ displayPhoneNumber: "", accountId: "", access_token: "", name: CHANNEL_PRODUCTION_TYPE.CLOUD, phoneNumberId: "" });
    const company = useSelector((state) => state.company);

    const { id: channelId = "", name: channelName, company_id, type, brain_id, reference_id, metadata = {}, ...rest } = channelSelected || {};
    const inProduction = get(metadata, "inProduction", false);
    const link = get(metadata, "link", "");
    const provider = get(metadata, "properties.provider", {});
    const productionType = get(metadata, "properties.provider.name", CHANNEL_PRODUCTION_TYPE.CLOUD);
    const gupshup_app_response = get(metadata, "gupshup_app_response", {});
    const live = get(metadata, "gupshup_app_response.live", false);

    //console.log("productionType", productionType)
    const { mutateAsync: productionCloud, isLoading: isLoadingProductionCloud } = useProductionCloud({
        ...rest,
        datastoreId: brain_id,
        channelId,
        body: {
            name: channelName,
            company_id,
            type,
            client_secret: company.clientSecret,
            client_id: company.clientId,
            metadata: {
                access_token: cloudOptions.access_token,
                inProduction: true,
                ...metadata,
                properties: {
                    provider: {
                        ...provider,
                        name: cloudOptions.name,
                        displayPhoneNumber: cloudOptions.displayPhoneNumber,
                        phoneNumberID: cloudOptions.phoneNumberId,
                        businessAccountID: cloudOptions.accountId,
                    },
                },
                gupshup_app_response: {
                    ...gupshup_app_response,
                    live: true,
                },
            },
        },
    });

    if (inProduction && productionType === CHANNEL_PRODUCTION_TYPE.CLOUD) {
        return <WhatsappCloud onChangeName={onChangeName} channelSelected={channelSelected} openDeleteModal={openDeleteModal} setChannelSelected={setChannelSelected} />;
    }

    if (inProduction && live && productionType === CHANNEL_PRODUCTION_TYPE.ON_PREMISE) {
        return <WhatsappGupshup onChangeName={onChangeName} channelSelected={channelSelected} openDeleteModal={openDeleteModal} />;
    }

    return (
        <WhatsappSandbox
            onChangeName={onChangeName}
            channelSelected={channelSelected}
            openDeleteModal={openDeleteModal}
            cloudOptions={cloudOptions}
            setCloudOptions={setCloudOptions}
            isLoadingProductionCloud={isLoadingProductionCloud}
            productionCloud={productionCloud}
            refetchChannel={refetchChannel}
            testers={testers}
            setTesters={setTesters}
            setInitialTesters={setInitialTesters}
            setLinkFromOnPromise={setLinkFromOnPromise}
            hasLink={!isEmpty(link)}
            inProduction={inProduction}
            useProductionCloud={useProductionCloud}
            onPromiseToProduction={onPromiseToProduction}
        />
    );
};

export default WhatsappChannel;
