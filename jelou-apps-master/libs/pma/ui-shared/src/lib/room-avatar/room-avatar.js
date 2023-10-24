import React from "react";
import Avatar from "react-avatar";
import emojiStrip from "emoji-strip";
import isEmpty from "lodash/isEmpty";
// import { SocialIcon } from "@apps/shared/common";
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
        case "VENOM":
            return <WhatsappColoredIcon className="fill-current" height={size} width={size} />;
        case "FACEBOOK":
        case "FB_SMOOCH":
        case "FACEBOOK_FEED":
        case "FACEBOOK_COMMENTS":
            return <MessengerIcon className="fill-current" height={size} width={size} />;
        case "INSTAGRAM":
            return <InstagramColoredIcon className="fill-current" height={size} width={size} />;
        default:
            return <WebColoredIcon className="fill-current" height={size} width={size} />;
    }
};

const RoomAvatar = ({ src, name, type = "", size = "" }) => {
    return (
        <div className="relative">
            <Avatar
                src={src}
                name={emojiStrip(name)}
                className="mr-3 font-semibold"
                fgColor="white"
                size={size ? size : "2.438rem"}
                round={true}
                color="#2A8BF2"
                textSizeRatio={2}
            />
            {!isEmpty(type) && (
                <div className="absolute bottom-0 right-0 mr-1 -mb-1 overflow-hidden rounded-full border-2 border-transparent">
                    <SocialIcon type={type} />
                </div>
            )}
        </div>
    );
};

export default RoomAvatar;
