import React from "react";
import { useSelector } from "react-redux";

import BubbleContainer from "./BubbleContainer";
import OptionsMenu from "./OptionsMenu";
import { StatusTick } from "@apps/shared/common";
import ReplyBubble from "./ReplyBubble";

import toUpper from "lodash/toUpper";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";

import dayjs from "dayjs";
import Tippy from "@tippyjs/react";

const LOCATION_KEY = process.env.NX_REACT_APP_LOCATION_KEY;

const LocationBubble = (props) => {
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
        repliesTo,
        inbox,
        createdAt,
        styles,
        showOptionsMenu,
    } = props;

    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);

    const bubbleLeftStyle = styles["image-bubble-left"];
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
            <div
                className={`overflow-hidden rounded-lg p-1 ${bubbleSide}` === `right` ? `${bubbleRightStyle}` : `${bubbleLeftStyle}`}
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}
                ref={dropdownRef}>
                <div className="m-2 flex w-full flex-col">
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
                            bubbleSide={bubbleSide}
                            onHover={props.onHover}
                        />
                    )}
                    {repliesTo && <ReplyBubble bubbleSide={bubbleSide} message={repliesTo} />}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.google.com/maps/search/?api=1&query=${props.message.lat},${props.message.lng}`}
                        className="text-left">
                        <img
                            alt="Ubicación"
                            crossOrigin="anonymous"
                            className="w-auto rounded-lg"
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${props.message.lat},${props.message.lng}&zoom=15&size=270x200&markers=${props.message.lat},${props.message.lng}&key=${LOCATION_KEY}`}
                        />
                    </a>
                    <div className="right-0 z-10 mt-2 mr-3 mb-2 flex h-4 items-center justify-end">
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

export default LocationBubble;
