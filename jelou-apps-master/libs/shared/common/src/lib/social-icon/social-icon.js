import React from "react";
import toUpper from "lodash/toUpper";
import { MessengerIcon, WebColoredIcon, TwitterColoredIcon, WhatsappColoredIcon, InstagramColoredIcon } from "@apps/shared/icons";

const SocialIcon = (props) => {
    const size = props.size ? props.size : "1.25rem";

    switch (toUpper(props.type)) {
        case "TWITTER_REPLIES":
        case "TWITTER":
            return <TwitterColoredIcon className="fill-current" height={size} width={size} />;
        case "WHATSAPP":
        case "GUPSHUP":
        case "SMOOCH":
        case "TWILIO":
        case "WAVY":
        case "WHATSAPP_CLOUD":
        case "VENOM":
            return <WhatsappColoredIcon className="fill-current" height={size} width={size} />;
        case "FACEBOOK":
        case "FB_SMOOCH":
        case "FACEBOOK_COMMENTS":
        case "FACEBOOK_FEED":
            return <MessengerIcon className="fill-current" height={size} width={size} />;
        case "INSTAGRAM":
            return <InstagramColoredIcon className="fill-current" height={size} width={size} />;
        default:
            return <WebColoredIcon className="fill-current" height={size} width={size} />;
    }
};

export default SocialIcon;
