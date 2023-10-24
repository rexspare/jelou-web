import React from "react";
import Avatar from "react-avatar";
import emojiStrip from "emoji-strip";
import isEmpty from "lodash/isEmpty";

import SocialIcon from "../social-icon/social-icon";

const PostAvatar = ({ src, name, type = "", size = "" }) => {
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

export default PostAvatar;
