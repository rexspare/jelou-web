import { useState } from "react";
import ImageLoader from "react-load-image";
import { StatusTick } from "@apps/shared/common";
import { useSelector } from "react-redux";
import ReplyBubble from "./ReplyBubble";

import BubbleContainer from "./BubbleContainer";
import OptionsMenu from "./OptionsMenu";
import { MoonLoader } from "react-spinners";

import toUpper from "lodash/toUpper";
import has from "lodash/has";

import dayjs from "dayjs";
import Tippy from "@tippyjs/react";
import { ModalHeadless } from "@apps/pma/ui-shared";

import get from "lodash/get";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";


const ImageBubble = (props) => {
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
        createdAt,
        type,
        styles,
        showOptionsMenu,
        message,
    } = props;
    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);

    const captionText = get(message, "caption", "") || get(message, "text", "");

    const { height = 1, width = 0 } = props.message;
    const [isOpen, setIsOpen] = useState(false);
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

    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    return (
        <BubbleContainer {...props}>
            <div
                className={bubbleSide === "right" ? `bubble relative flex flex-col text-13 ${bubbleRightStyle}` : `flex flex-col ${bubbleLeftStyle}`}
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}
                ref={dropdownRef}
            >
                <div className={`flex w-full flex-col overflow-hidden rounded-lg px-2 pt-2 ${bubbleSide === "right" ? "border-primary-75" : "border-bubble-left"} `}>
                    {!isSameSenderIdOfPreviousBubble && bubbleSide !== "left" && <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>}
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
                    {isMobileApp.iOSApp() || isMobileApp.AndroidApp() ? (
                        <ImageLoader src={props.message.mediaUrl}>
                            <img
                                alt={props.message.mimeType}
                                onClick={() => {
                                    setIsOpen(true);
                                }}
                                className={`object-cover ${toUpper(type) === "STICKER" ? "h-[11.875rem] w-[11.875rem]" : height > width ? "h-72 w-auto" : "h-auto w-full"} rounded-xl`}
                            />
                            <div>Error!</div>
                            <div className="flex h-72 w-72 items-center justify-center">
                                <MoonLoader size={"1.563rem"} color={"#ffffff"} />
                            </div>
                        </ImageLoader>
                    ) : (
                        <a target="_blank" rel="noopener noreferrer" href={props.message.mediaUrl}>
                            <div>
                                <LazyLoadImage
                                    className={`object-cover ${toUpper(type) === "STICKER" ? "h-[11.875rem] w-[11.875rem]" : height > width ? "h-72 w-auto" : "h-auto w-full"} rounded-xl`}
                                    effect="blur"
                                    alt={props.message.mimeType}
                                    src={props.message.mediaUrl} // use normal <img> attributes as props
                                />
                            </div>
                        </a>
                    )}
                    {captionText && <div className={`whitespace-pre-wrap break-words px-2 pt-2 text-13 font-bold leading-6 outline-none focus:outline-none`}>{captionText}</div>}
                </div>
                <div className="my-1 mr-3 flex h-4 items-center justify-end">
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
            <ModalHeadless isOpen={isOpen} closeModal={() => setIsOpen(false)} className="px-4 py-2">
                <img
                    src={props.message.mediaUrl}
                    alt={props.message.mimeType}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                    className={`object-cover ${toUpper(type) === "STICKER" ? "h-[11.875rem] w-[11.875rem]" : height > width ? "h-72 w-auto" : "h-auto w-full"} rounded-xl`}
                />
            </ModalHeadless>
        </BubbleContainer>
    );
};

export default ImageBubble;
