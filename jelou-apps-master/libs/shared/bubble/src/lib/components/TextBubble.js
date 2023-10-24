import React from "react";
import dayjs from "dayjs";
import get from "lodash/get";
import has from "lodash/has";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import castArray from "lodash/castArray";
import { useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";

import OptionsMenu from "./OptionsMenu";
import ReplyBubble from "./ReplyBubble";
import BubbleContainer from "./BubbleContainer";
import { formatMessage } from "@apps/shared/utils";
import { StatusTick } from "@apps/shared/common";

const TextBubble = (props) => {
    const options = get(props, "message.options", get(props, "message.QuickReplies", get(props, "message.quick_replies", [])));
    const {
        bubbleSide,
        time,
        status,
        by,
        source,
        t,
        operatorId,
        botId,
        from,
        isSameSenderIdOfPreviousBubble,
        handleSelectChange,
        copyToClipboard,
        messages,
        openNewChat,
        setOpen,
        open,
        handleReply,
        supportsReplies,
        dropdownRef,
        popperRef,
        repliesTo,
        app,
        inbox = false,
        createdAt,
        styles,
        showOptionsMenu,
    } = props;
    const text = !isObject(props.message) ? props.message : isObject(props.message.text) ? "Invalid message" : props.message.text; // Support for old messages with message as a string instead of an object and for messages with text as an object instead of a string (Error from backend)

    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);
    const archivedQuerySearch = useSelector((state) => state.archivedQuerySearch);
    const style = {};
    const referral = get(messages, "metadata.referral", {});

    const bubbleLeftStyle = styles["bubble-left"];
    const bubbleRightStyle = styles["bubble-right"];
    const bubbleRightStylewReply = styles["bubble-right-w-reply"];

    if (repliesTo) {
        style.boxShadow = "none";
    }
    let names = null;

    if (operatorId) {
        const operator = operators.find((operator) => operator.providerId === operatorId);
        names = operator?.names;
    }

    if (from) {
        names = from;
    }

    if (has(from, "names")) {
        names = from.names;
    }

    if (botId) {
        const bot = bots.find((bot) => bot.id === botId);
        names = bot?.name;
    }
    let rightStyles = props.message.quotedMessageId ? bubbleRightStylewReply : bubbleRightStyle;

    if (isSameSenderIdOfPreviousBubble) {
        rightStyles = `${rightStyles} ${styles["bubble-right-child"]}`;
    }

    const splitQuery = archivedQuerySearch.split(" ");

    return (
        <BubbleContainer {...props}>
            <div
                className={`bubble relative flex flex-col text-13 ${bubbleSide === "left" ? `${bubbleLeftStyle}` : `${rightStyles}`} ${
                    repliesTo && "ml-2"
                }`}
                style={style}
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}
                ref={dropdownRef}>
                {/* {app !== "PMA" && !isSameSenderIdOfPreviousBubble && !isEmpty(names) && (
                    <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>
                )} */}
                {!inbox && !isSameSenderIdOfPreviousBubble && !isEmpty(names) && (
                    <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>
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
                        supportsReplies={supportsReplies}
                        by={by}
                        dropdownRef={dropdownRef}
                        messages={messages}
                        canCopy={true}
                        popperRef={popperRef}
                        bubbleSide={bubbleSide}
                        onHover={props.onHover}
                    />
                )}

                {repliesTo && <ReplyBubble bubbleSide={bubbleSide} message={repliesTo} />}
                {!isEmpty(referral) && (
                    <div
                        className={`my-1 flex flex-col truncate rounded-md bg-opacity-50 p-2 ${
                            bubbleSide === "right" ? "bg-primary-200 bg-opacity-15" : "bg-gray-400 bg-opacity-15"
                        }`}>
                        <span className="font-bold uppercase">
                            {get(referral, "source_type", "")}: {get(referral, "headline", "")}
                        </span>
                        <a
                            href={get(referral, "source_url", "")}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full truncate text-13 italic text-gray-400 underline">
                            {get(referral, "source_url", "")}
                        </a>
                    </div>
                )}
                {!isEmpty(archivedQuerySearch) ? (
                    <div className={`max-w-full whitespace-pre-wrap break-words text-13`}>
                        <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={splitQuery.length > 1 ? splitQuery : [archivedQuerySearch]}
                            autoEscape={true}
                            textToHighlight={text}
                        />
                    </div>
                ) : (
                    formatMessage(text)
                )}

                <div className="mt-1 flex h-4 items-center justify-end">
                    <Tippy
                        content={app !== "PMA" ? dayjs(createdAt).format("DD-MM-YY HH:mm") : dayjs(createdAt).format("HH:mm")}
                        placement={"bottom"}
                        theme="jelou">
                        <div className={`flex pl-1 text-11 font-light text-gray-400`}>{time}</div>
                    </Tippy>
                    {toUpper(by) !== "USER" && (
                        <div className="flex items-center justify-center pl-1">
                            <StatusTick status={status} color={"text-gray-400"} />
                        </div>
                    )}
                </div>
            </div>

            {!isEmpty(options) &&
                !isString(options) &&
                (toUpper(source) === "FACEBOOK" ||
                    toUpper(source) === "FB_SMOOCH" ||
                    toUpper(source) === "INSTAGRAM" ||
                    toUpper(source) === "SMOOCH") && (
                    <div className="mt-2">
                        <div className="text-center">
                            {castArray(options).map((option, index) => (
                                <span
                                    className="mb-1 block rounded-lg border-default border-primary-200 bg-white py-2 px-4 text-sm text-primary-200 shadow"
                                    key={index}>
                                    {option.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            {!isEmpty(options) &&
                !isString(options) &&
                toUpper(source) !== "FACEBOOK" &&
                toUpper(source) !== "FB_SMOOCH" &&
                toUpper(source) !== "INSTAGRAM" &&
                toUpper(source) !== "SMOOCH" && (
                    <div className={bubbleSide === "left" ? `${bubbleLeftStyle} mt-2` : `${bubbleRightStyle} mt-2`}>
                        <div className="block text-right text-13">
                            <span className="block md:mb-2">{t("pma.Envía el número de las siguientes opciones que deseas")}:</span>
                            {castArray(options).map((option, index) => (
                                <span className="block md:mb-1" key={index}>
                                    {index + 1}. {option.title}
                                </span>
                            ))}
                            <span className="mt-3 block">{t("pma.0. Para salir del menú de opciones.")}</span>
                        </div>
                    </div>
                )}
        </BubbleContainer>
    );
};

export default withTranslation()(TextBubble);
