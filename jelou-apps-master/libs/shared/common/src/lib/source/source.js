import React from "react";
import toUpper from "lodash/toUpper";

import { MessengerIcon, WebColoredIcon, TwitterColoredIcon, WhatsappColoredIcon, InstagramColoredIcon, AppIcon } from "@apps/shared/icons";

const Source = (props) => {
    const size = props.size ? props.size : "18px";

    try {
        switch (toUpper(props.source)) {
            case "FACEBOOK":
                return <MessengerIcon className="fill-current" height={size} width={size} />;
            case "TWILIO":
            case "WAVY":
            case "SMOOCH":
            case "GUPSHUP":
            case "WHATSAPP":
            case "VENOM":
                return <WhatsappColoredIcon className="fill-current text-source-whatsapp" height={size} width={size} />;
            case "WEB":
            case "APP":
                return <WebColoredIcon className="fill-current " height={size} width={size} />;
            case "WIDGET":
                return <AppIcon className="fill-current " height={size} width={size} />;
            case "TWITTER":
                return <TwitterColoredIcon className="fill-current text-source-twitter" height={size} width={size} />;
            case "FACEBOOK_FEED":
                return <MessengerIcon className="fill-current text-source-facebook" height={size} width={size} />;
            case "INSTAGRAM":
                return <InstagramColoredIcon className="fill-current text-source-instagram" height={size} width={size} />;
            default:
                return <WebColoredIcon className="fill-current " height={size} width={size} />;
        }
    } catch {
        return <WebColoredIcon className="fill-current " height={size} width={size} />;
    }
};

export default Source;
