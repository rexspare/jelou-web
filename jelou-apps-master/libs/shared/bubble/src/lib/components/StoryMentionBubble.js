import React from "react";
import has from "lodash/has";
import toUpper from "lodash/toUpper";
import get from "lodash/get";
import { useSelector } from "react-redux";
import ImageLoader from "react-load-image";
import { MoonLoader } from "react-spinners";
import { withTranslation } from "react-i18next";

import { StatusTick } from "@apps/shared/common";
import BubbleContainer from "./BubbleContainer";
import isEmpty from "lodash/isEmpty";

const ReplyStoryBubble = (props) => {
    const { bubbleSide, time, status, by, operatorId, botId, from, isSameSenderIdOfPreviousBubble, dropdownRef, t, inbox, styles } = props;
    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);
    const { caption } = props.message;
    const bubbleLeftStyle = styles["image-bubble-left"];
    const mediaType = get(props.message, "mediaType", "");
    let bubbleRightStyle = styles["image-bubble-right"];

    if (isSameSenderIdOfPreviousBubble && bubbleSide === "right") {
        bubbleRightStyle = `${bubbleRightStyle} ${styles["bubble-right-child"]}`;
    }

    let names = null;
    if (operatorId) {
        const operator = operators.find((operator) => operator.providerId === operatorId);
        names = operator?.names;
    }

    if (has(from, "name")) {
        names = from.name;
    }

    if (botId) {
        const bot = bots.find((bot) => bot.id === botId);
        names = bot?.name;
    }

    return (
        <BubbleContainer {...props}>
            <small className="my-2 block text-13 font-bold text-gray-400">{t("pma.Te mencionó en su historia")}</small>
            <a target="_blank" rel="noopener noreferrer" className="relative mb-4 pl-4" href={props.message.mediaUrl}>
                <div className="absolute top-0 left-0 h-full w-[6px] rounded-full bg-gray-300"></div>
                {mediaType === "VIDEO" ? (
                    <div className=" h-full  rounded-full bg-gray-300">
                        <video controls className={`max-h-xxsm overflow-hidden rounded-lg`}>
                            <source src={props.message.mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : (
                    <ImageLoader src={props.message.mediaUrl}>
                        <img alt={props.message.mimeType} className={`h-[14rem] w-[9rem] rounded-xxl object-cover`} />
                        <div>Error!</div>
                        <div className="flex h-32 w-32 items-center justify-center">
                            <MoonLoader size={"1.563rem"} color={"#ffffff"} />
                        </div>
                    </ImageLoader>
                )}
            </a>

            <div
                className={
                    bubbleSide === "right"
                        ? `bubble relative flex flex-col text-13 ${bubbleRightStyle}`
                        : `flex flex-col ${bubbleLeftStyle} !rounded-[0.625rem]`
                }
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}
                ref={dropdownRef}>
                <div
                    className={`flex w-full flex-col overflow-hidden rounded-lg px-3 ${
                        bubbleSide === "right" ? "border-primary-75" : "border-bubble-left"
                    } `}>
                    {!inbox && !isSameSenderIdOfPreviousBubble && !isEmpty(names) && (
                        <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>
                    )}
                    {inbox && !isEmpty(names) && <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>}
                    {caption && <div className="max-w-full whitespace-pre-wrap break-words text-13 font-semibold leading-6">{caption}</div>}
                </div>
                <div className="my-1 mr-3 flex h-4 items-center justify-end">
                    <div className={`flex pl-1 text-11 font-light text-gray-400`}>{time}</div>
                    {toUpper(by) !== "USER" && (
                        <div className="flex items-center justify-center pl-1">
                            <StatusTick status={status} color={"text-gray-400"} />
                        </div>
                    )}
                </div>
            </div>
        </BubbleContainer>
    );
};

export default withTranslation()(ReplyStoryBubble);
