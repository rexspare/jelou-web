import React from "react";
import get from "lodash/get";
import last from "lodash/last";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { FileIcon } from "react-file-icon";
import OptionsMenu from "./OptionsMenu";
import has from "lodash/has";
import { useSelector } from "react-redux";
import ReplyBubble from "./ReplyBubble";

import BubbleContainer from "./BubbleContainer";
import { ForwardIcon, DownloadIcon4 } from "@apps/shared/icons";
import { StatusTick } from "@apps/shared/common";

import dayjs from "dayjs";
import Tippy from "@tippyjs/react";

const DocumentBubble = (props) => {
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
        attributes,
        supportsReplies,
        dropdownRef,
        hasInternalInbox,
        message,
        messages,
        popperRef,
        repliesTo,
        inbox = false,
        createdAt,
        styles,
        showOptionsMenu,
    } = props;

    const canForward = hasInternalInbox && props.onHover;
    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);

    const bubbleLeftStyle = styles["doc-bubble-left"];
    const bubbleRightStyle = styles["doc-bubble-right"];

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

    const getExtention = (mediaName) => {
        try {
            return mediaName.match(/\.[0-9a-z]+$/i)[0].replace(".", "");
        } catch (error) {
            if (message.caption) {
                let file = message.caption.split(".");
                return last(file);
            }
            return "Unknown";
        }
    };

    console.log(message);

    const truncate = (n, len) => {
        const ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
        let filename = n.replace("." + ext, "");
        // if (filename.length <= len) {
        //     return n;
        // }
        filename = filename.substr(0, len) + (n.length > len ? "[...]" : "");
        return filename;
    };

    const getName = (fileName, mediaUrl) => {
        console.log("mediaUrl", mediaUrl);
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

    const mediaUrl = isEmpty(message?.mediaUrl) ? "" : message?.mediaUrl;

    return (
        <BubbleContainer {...props}>
            <div className={bubbleSide === "right" ? bubbleRightStyle : bubbleLeftStyle} onMouseOver={props.setHover} onMouseLeave={props.setHoverFalse} ref={dropdownRef}>
                <div className={`${bubbleSide === "right" ? "rounded-t-lg rounded-bl-lg bg-primary-600" : "rounded-t-lg rounded-br-lg bg-gray-10"} flex w-full flex-col px-4 pt-4 pb-2`}>
                    {!inbox && !isSameSenderIdOfPreviousBubble && !isEmpty(names) && <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>}
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
                    <div
                        //
                        className={`m-auto flex w-full cursor-pointer items-center justify-center truncate rounded-lg p-2 sm:p-5 ${
                            bubbleSide === "right" ? "bg-primary-200 bg-opacity-15" : "bg-gray-400 bg-opacity-10"
                        }`}
                        onClick={() => {
                            window.open(mediaUrl, "_blank");
                        }}
                    >
                        <div className="w-8 mid:w-10">
                            <FileIcon
                                color={"#E2E5E7"}
                                labelTextColor={"white"}
                                labelColor={setLabelColor(toUpper(getExtention(mediaUrl)))}
                                foldColor="#B0B7BD"
                                type={setType(toUpper(getExtention(mediaUrl)))}
                                labelUppercase
                                extension={getExtention(mediaUrl)}
                            />
                        </div>
                        <div className="flex w-40 truncate break-words">
                            <span className="max-w-full whitespace-pre-wrap break-words px-5 text-13 sm:text-15">{getName(get(message, "filename", message.caption) || "", mediaUrl)}</span>
                        </div>
                        <span className="flex text-primary-200">
                            <DownloadIcon4 className="mx-auto" width="1.563rem" height="1.25rem" strokeWidth="1.5" fill="currentColor" stroke="currentColor" />
                        </span>
                    </div>
                    <div
                        className={`flex items-center justify-end outline-none ${
                            bubbleSide === "right" ? "bg-primary-600" : "border-t-1 border-transparent bg-gray-10"
                        } h-5 w-full rounded-b-lg font-medium focus:outline-none`}
                    >
                        <div className="flex h-4 items-center justify-end">
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
                {canForward && (
                    <div className="relative" onClick={() => openNewChat(message)}>
                        <ForwardIcon className={`${bubbleSide === "left" ? "bg-bubble" : "bg-teal"} icon absolute cursor-pointer fill-current`} width="1rem" height="1rem" />
                    </div>
                )}
            </div>
        </BubbleContainer>
    );
};

export default DocumentBubble;
