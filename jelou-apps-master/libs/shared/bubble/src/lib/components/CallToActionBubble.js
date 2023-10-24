import { StatusTick } from "@apps/shared/common";
import { DownloadIcon2, ExitIcon, WarningIcon } from "@apps/shared/icons";
import { formatMessage } from "@apps/shared/utils";
import { LinkIcon, PhoneIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import castArray from "lodash/castArray";
import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import last from "lodash/last";
import toUpper from "lodash/toUpper";
import React from "react";
import { FileIcon } from "react-file-icon";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import ImageLoader from "react-load-image";
import { useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import BubbleContainer from "./BubbleContainer";

const CallToActionBubble = (props) => {
    const {
        bubbleSide,
        styles,
        repliesTo,
        from,
        isSameSenderIdOfPreviousBubble,
        botId,
        operatorId,
        dropdownRef,
        field,
        query,
        status,
        by,
        time,
        createdAt,
        messages,
    } = props;
    const buttonsCall = get(messages, "bubble.buttons", []);
    const style = {};
    const text = isObject(props.message.text) ? "Invalid message" : props.message.text;
    const { t } = useTranslation();
    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);

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

    if (has(from, "name")) {
        names = from.name;
    }

    if (botId) {
        const bot = bots.find((bot) => bot.id === botId);
        names = bot?.name;
    }

    let rightStyles = props.message.quotedMessageId ? bubbleRightStylewReply : bubbleRightStyle;

    if (isSameSenderIdOfPreviousBubble) {
        rightStyles = `${rightStyles} ${styles["bubble-right-child"]}`;
    }

    const getExtention = (mediaName) => {
        try {
            return mediaName.match(/\.[0-9a-z]+$/i)[0].replace(".", "");
        } catch (error) {
            if (props.message.caption) {
                let file = props.message.caption.split(".");
                return last(file);
            }
            return "Unknown";
        }
    };

    const truncate = (n, len) => {
        const ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
        let filename = n.replace("." + ext, "");
        filename = filename.substr(0, len) + (n.length > len ? "[...]" : "");
        return filename;
    };

    const getName = (fileName, mediaUrl) => {
        let file = fileName;

        if (isEmpty(file)) {
            let media = mediaUrl.split("/");
            file = last(media);
        }

        const name = getExtention(file);

        return truncate(file.replace(`.${name}`, ""), 20);
    };

    const setType = (type) => {
        switch (toUpper(type)) {
            case "PDF":
                return "acrobat";
            case "DOC":
                return "document";
            case "DOCX":
                return "document";
            case "PPT":
                return "presentation";
            case "PPTX":
                return "presentation";
            case "XLS":
                return "spreadsheet";
            case "XLSX":
                return "spreadsheet";
            default:
                return "acrobat";
        }
    };

    const setLabelColor = (type) => {
        switch (toUpper(type)) {
            case "PDF":
                return "#F15642";
            case "DOC":
                return "#2A8BF2";
            case "DOCX":
                return "#2A8BF2";
            case "PPT":
                return "#D14423";
            case "PPTX":
                return "#D14423";
            case "XLS":
                return "#1A754C";
            case "XLSX":
                return "#1A754C";
            default:
                return "#F15642";
        }
    };

    const showQuickReplies = () => {
        const subtypeQuickReply = toUpper(get(props, "message.subType", ""));

        switch (subtypeQuickReply) {
            case "TEXT":
                return formatMessage(text);
            case "IMAGE": {
                const caption = get(props, "message.caption", "");
                const mediaUrl = get(props, "message.mediaUrl", "");
                const { height = 1, width = 0 } = props.message;
                return (
                    <>
                        <a target="_blank" rel="noopener noreferrer" href={mediaUrl}>
                            <ImageLoader src={mediaUrl}>
                                <img
                                    alt={props.message.mimeType}
                                    className={`object-cover ${height > width ? "h-72 w-auto" : "h-auto w-full"} rounded-xl`}
                                />
                                <div className="flex items-center justify-center space-x-3">
                                    <WarningIcon width="1rem" height="1rem" className="fill-current text-gray-400" />
                                    <span>{t("clients.Error al cargar imagen en plataforma")}</span>
                                    <WarningIcon width="1rem" height="1rem" className="fill-current text-gray-400" />
                                </div>
                                <div className="flex h-72 w-72 items-center justify-center">
                                    <MoonLoader size={"1.563rem"} color={"#ffffff"} />
                                </div>
                            </ImageLoader>
                        </a>
                        {caption && (
                            <div className={`whitespace-pre-wrap break-words px-4 pt-2 font-medium text-gray-400 outline-none focus:outline-none`}>
                                {caption}
                            </div>
                        )}
                    </>
                );
            }
            case "VIDEO": {
                const captionVideo = get(props, "message.caption", "");
                const mediaUrlVideo = get(props, "message.mediaUrl", "");
                return (
                    <>
                        <video controls className={`max-h-xxsm overflow-hidden rounded-lg`}>
                            <source src={mediaUrlVideo} type="video/mp4" />
                            <div className="flex items-center justify-center space-x-3">
                                <WarningIcon width="1rem" height="1rem" className="fill-current text-gray-400" />
                                <span>{t("clients.Your browser does not support the video tag.")}</span>
                                <WarningIcon width="1rem" height="1rem" className="fill-current text-gray-400" />
                            </div>
                        </video>
                        {captionVideo && (
                            <div
                                className={`${
                                    bubbleSide === "right" ? "text-white" : "text-gray-500"
                                } flex h-8 w-full items-center rounded-b-lg pl-4 font-medium outline-none focus:outline-none`}>
                                {captionVideo}
                            </div>
                        )}
                    </>
                );
            }
            case "DOCUMENT": {
                const message = get(props, "message", {});
                return (
                    <div
                        className={`m-auto flex cursor-pointer items-center justify-center truncate rounded-lg p-2 sm:p-3 ${
                            bubbleSide === "right" ? "bg-primary-200 bg-opacity-15" : "bg-gray-400 bg-opacity-10"
                        }`}
                        onClick={() => {
                            window.open(message.mediaUrl, "_blank");
                        }}>
                        <div className="h-auto w-10">
                            <FileIcon
                                color={"#E2E5E7"}
                                labelTextColor={"white"}
                                size={30}
                                labelColor={setLabelColor(toUpper(getExtention(message.mediaUrl)))}
                                foldColor="#B0B7BD"
                                type={setType(toUpper(getExtention(message.mediaUrl)))}
                                labelUppercase
                                extension={getExtention(message.mediaUrl)}
                            />
                        </div>
                        <div className="flex w-40 truncate break-words">
                            <span className="max-w-full whitespace-pre-wrap break-words px-5 text-13 sm:text-15">
                                {getName(message.caption || "", message.mediaUrl)}
                            </span>
                        </div>
                        <span className="flex text-gray-400">
                            <DownloadIcon2
                                width="1.25rem"
                                height="1.125rem"
                                className="mr-2"
                                strokeWidth="1.5"
                                fill="currentColor"
                                stroke="currentColor"
                            />
                        </span>
                    </div>
                );
            }
            default:
                return formatMessage(text);
        }
    };

    return (
        <BubbleContainer {...props}>
            <div
                className={`bubble relative flex flex-col text-13 ${bubbleSide === "left" ? `${bubbleLeftStyle}` : `${rightStyles}`}`}
                style={style}
                ref={dropdownRef}>
                {!isSameSenderIdOfPreviousBubble && !isEmpty(names) && (
                    <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>
                )}
                {!isEmpty(field) && field[0] === "text" && !isEmpty(query) ? (
                    <div className={`max-w-full whitespace-pre-wrap break-words text-13`}>
                        <Highlighter highlightClassName="YourHighlightClass" searchWords={[query]} autoEscape={true} textToHighlight={text} />
                    </div>
                ) : (
                    showQuickReplies()
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
            {!isEmpty(buttonsCall) && (
                <div className="mt-2">
                    <div className="text-center">
                        {buttonsCall.map(({ text, type, phone_number, url }, index) =>
                            type === "PHONE_NUMBER" ? (
                                <Tippy content={phone_number} theme="jelou" placement="bottom">
                                    <div
                                        key={`${index}-btn-action`}
                                        className="mb-1 flex items-center justify-center rounded-lg border-1 border-primary-200 bg-white py-2 px-4 text-sm text-primary-200 shadow">
                                        <PhoneIcon width={16} height={16} className="mr-1" />
                                        <div className=" pl-1">{text}</div>
                                    </div>
                                </Tippy>
                            ) : type === "URL" ? (
                                <Tippy content={url} theme="jelou" placement="bottom">
                                    <div
                                        key={`${index}-btn-action`}
                                        className="mb-1 flex items-center justify-center  rounded-lg border-1 border-primary-200 bg-white py-2 px-4 text-sm text-primary-200 shadow">
                                        <ExitIcon width={16} height={16} className="mr-1" />
                                        <div className=" pl-1">{text}</div>
                                    </div>
                                </Tippy>
                            ) : (
                                ""
                            )
                        )}
                    </div>
                </div>
            )}
        </BubbleContainer>
    );
};

export default CallToActionBubble;
