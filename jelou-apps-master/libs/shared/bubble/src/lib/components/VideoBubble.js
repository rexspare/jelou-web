import React, { useEffect } from "react";

import BubbleContainer from "./BubbleContainer";
import OptionsMenu from "./OptionsMenu";
import { useSelector } from "react-redux";
import ReplyBubble from "./ReplyBubble";
import { StatusTick } from "@apps/shared/common";

import toUpper from "lodash/toUpper";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import dayjs from "dayjs";
import Tippy from "@tippyjs/react";

const VideoBubble = (props) => {
    const { caption } = props.message;
    const {
        bubbleSide,
        time,
        status,
        by,
        operatorId,
        botId,
        from,
        isSameSenderIdOfPreviousBubble,
        handleSelectChange,
        copyToClipboard,
        openNewChat,
        setOpen,
        open,
        handleReply,
        popperStyles,
        messages,
        attributes,
        supportsReplies,
        dropdownRef,
        popperRef,
        repliesTo,
        inbox = false,
        createdAt,
        styles,
        showOptionsMenu,
    } = props;

    const bubbleLeftStyle = styles["image-bubble-left"];
    let bubbleRightStyle = styles["image-bubble-right"];

    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);

    useEffect(() => {
        if (isSameSenderIdOfPreviousBubble && bubbleSide === "right") {
            bubbleRightStyle = `${bubbleRightStyle} ${styles["bubble-right-child"]}`;
        }
    }, [isSameSenderIdOfPreviousBubble, bubbleSide]);

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
            <div
                className={bubbleSide === "right" ? `bubble relative flex flex-col text-13 ${bubbleRightStyle}` : `flex flex-col ${bubbleLeftStyle}`}
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}
                ref={dropdownRef}>
                <div className={`flex w-full flex-col rounded-lg p-2 ${bubbleSide === "right" ? "bg-primary-600" : "bg-gray-10"} `}>
                    {!inbox && !isSameSenderIdOfPreviousBubble && !isEmpty(names) && (
                        <small className="mb-3 block h-4 px-4 text-left font-bold text-primary-200">{names}</small>
                    )}
                    {inbox && !isEmpty(names) && <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>}

                    {showOptionsMenu && (
                        <OptionsMenu
                            handleSelectChange={handleSelectChange}
                            copyToClipboard={copyToClipboard}
                            openNewChat={openNewChat}
                            setOpenOptions={setOpen}
                            openOptions={open}
                            handleReply={handleReply}
                            popperStyles={popperStyles}
                            messages={messages}
                            attributes={attributes}
                            supportsReplies={supportsReplies}
                            by={by}
                            dropdownRef={dropdownRef}
                            popperRef={popperRef}
                            bubbleSide={bubbleSide}
                            onHover={props.onHover}
                        />
                    )}
                    {repliesTo && <ReplyBubble bubbleSide={bubbleSide} message={repliesTo} />}
                    <video controls className={`max-h-xxsm overflow-hidden rounded-lg`}>
                        <source src={props.message.mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {caption && (
                        <div
                            className={`my-2 flex h-8 w-full items-center rounded-b-lg pl-4 text-13 font-medium text-gray-400 outline-none focus:outline-none`}>
                            {caption}
                        </div>
                    )}
                    <div className="right-0 mr-3 mt-2 flex h-4 items-center justify-end">
                        <Tippy content={dayjs(createdAt).format(`HH:mm`)} placement={"bottom"} theme="jelou">
                            <div className={`flex pl-1 text-11 font-light text-gray-400`}>{time}</div>
                        </Tippy>
                        {toUpper(by) !== "USER" && (
                            <div className="flex items-center justify-center pl-1">
                                <StatusTick status={status} color={"text-gray-400"} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BubbleContainer>
    );
};

export default VideoBubble;
