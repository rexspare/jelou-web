import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import capitalize from "lodash/capitalize";

import { CHANNEL_TYPES, WHATSAPP_FEATURES, FACEBOOK_FEATURES, INSTAGRAM_FEATURES, WEB_FEATURES } from "../../../../constants";

const ChannelDescription = (props) => {
    const { channel } = props;
    const { t } = useTranslation();
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        switch (channel) {
            case CHANNEL_TYPES.WHATSAPP:
                setFeatures(WHATSAPP_FEATURES);
                break;
            case CHANNEL_TYPES.FACEBOOK:
                setFeatures(FACEBOOK_FEATURES);
                break;
            case CHANNEL_TYPES.INSTAGRAM:
                setFeatures(INSTAGRAM_FEATURES);
                break;
            case CHANNEL_TYPES.WEB:
                setFeatures(WEB_FEATURES);
                break;
            default:
                setFeatures(WEB_FEATURES);
                break;
        }
    }, [channel]);

    return (
        <div className="space-y-3">
            <div>{`${t("brain.createChannelTitle1")} ${capitalize(channel)} ${t("brain.createChannelTitle2")}`}</div>
            <ul className="space-y-2">
                {features.map((feature, index) => {
                    return (
                        <li key={index} className="ml-5 list-disc">
                            {feature}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChannelDescription;
