import isObject from "lodash/isObject";
import get from "lodash/get";
import { formatMessage } from "@apps/shared/utils";
import { withTranslation } from "react-i18next";
import ImageBubble from "./ImageBubble";

import BubbleContainer from "./BubbleContainer";

const AttachmentsBubble = (props) => {
    const { bubbleSide, styles } = props;
    const text = isObject(props.message.text) ? "Invalid message" : props.message.text;
    const isReply = !!get(props, "repliesTo", null);
    const attachments = get(props, "message.attachments", []);

    const bubbleLeftStyle = styles["bubble-left"];
    const bubbleRightStyle = styles["bubble-right"];
    const bubbleRightStylewReply = styles["bubble-right-w-reply"];

    const style = {};

    if (isReply) {
        style.boxShadow = "none";
        style.paddingLeft = "18px";
        style.paddingTop = "6px";
    }

    return (
        <BubbleContainer {...props}>
            <div
                className={`bubble relative ${
                    bubbleSide === "left" ? `${bubbleLeftStyle}` : `${props.message.quotedMessageId ? bubbleRightStylewReply : bubbleRightStyle}`
                }`}
                style={style}
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}>
                {formatMessage(text)}
            </div>
            <div>
                {attachments.map((attachment, index) => {
                    if (attachment.type === "IMAGE") {
                        return <ImageBubble key={index} {...props} message={attachment} />;
                    }

                    return null;
                })}
            </div>
        </BubbleContainer>
    );
};

export default withTranslation()(AttachmentsBubble);
