import React from "react";
import Avatar from "react-avatar";
import emojiStrip from "emoji-strip";
import toUpper from "lodash/toUpper";

/* Components */
import { MessengerIcon, WebColoredIcon, TwitterColoredIcon, WhatsappColoredIcon, InstagramColoredIcon } from "@apps/shared/icons";

const SocialIcon = ({ type }) => {
    switch (toUpper(type)) {
        case "TWITTER_REPLIES":
            return <TwitterColoredIcon className="fill-current" height="1.25rem" width="1.25rem" />;
        case "TWITTER":
            return <TwitterColoredIcon className="fill-current" height="1.25rem" width="1.25rem" />;
        case "WHATSAPP":
        case "SMOOCH":
        case "TWILIO":
        case "WAVY":
        case "VENOM":
            return <WhatsappColoredIcon className="fill-current" height="1.25rem" width="1.25rem" />;
        case "FACEBOOK":
        case "FACEBOOK_COMMENTS":
            return <MessengerIcon className="fill-current" height="1.25rem" width="1.25rem" />;
        case "INSTAGRAM":
            return <InstagramColoredIcon className="fill-current" height="1.25rem" width="1.25rem" />;
        default:
            return <WebColoredIcon className="fill-current" height="1.25rem" width="1.25rem" />;
    }
};

const PostAvatar = ({ src, name, type, size }) => {
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
            <div className="absolute bottom-0 right-0 mr-1 -mb-1 overflow-hidden rounded-full border-2 border-transparent">
                <SocialIcon type={type} />
            </div>
        </div>
    );
};

export default PostAvatar;
