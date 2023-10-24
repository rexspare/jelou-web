import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { USER_TYPES } from "@apps/shared/constants";
import copy from "copy-to-clipboard";

// import styles from '../bubble.module.scss';

/* Lodash Operations */
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import "dayjs/locale/es";
import "dayjs/locale/en";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

/* Bubbles */
import TextBubble from "./TextBubble";
import ImageBubble from "./ImageBubble";
import VideoBubble from "./VideoBubble";
import EventBubble from "./EventBubble";
import AudioBubble from "./AudioBubble";
import GenericBubble from "./GenericBubble";
import ContactBubble from "./ContactBubble";
import LocationBubble from "./LocationBubble";
import DocumentBubble from "./DocumentBubble";
import ReplyStoryBubble from "./ReplyStoryBubble";

import { setReplyId } from "@apps/redux/store";
import { withTranslation } from "react-i18next";

dayjs.extend(relativeTime);

const Bubble = (props) => {
    const { openNewChat, prevBubble, inbox, styles } = props;
    const dropdownRef = useRef();
    const dispatch = useDispatch();
    const { by, status = "", createdAt } = props.message;
    let message = props.message.message || props.message.bubble;
    const repliesTo = get(props, "message.bubble.replyTo", get(message, "replyTo", null));
    let operatorId = props.message._id;
    const currentRoom = useSelector((state) => state.currentRoom);
    const company = useSelector((state) => state.company);
    const [onHover, setOnHover] = useState(false);
    const [open, setOpen] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const [popperRef] = useState(null);

    operatorId = by === "operator" ? get(props.message, "operatorId", get(props.message, "sender.providerId")) : null;
    const { type, text, textError } = message || {};
    let { appId: botId, userId } = props.message;
    botId = by === "bot" && botId ? botId : by === "bot" ? userId : null;
    const hasInternalInbox = get(props.company, "properties.hasInternalInbox", false);

    if (!props.message || !message) {
        return <div></div>;
    }

    const prevBubbleType = get(prevBubble, "message.type", "");
    // Check if prev bubble is from the same user and prev bubble is not an EVENT
    const previousSenderId = toUpper(prevBubbleType) !== "EVENT" ? get(prevBubble, "senderId", null) : null;
    const currentSenderId = get(props, "message.senderId", "");
    const currentOperatorId = get(props, "message.operatorId", "");
    const isSameSenderIdOfPreviousBubble = previousSenderId === currentSenderId || previousSenderId === currentOperatorId;
    const isRelativeTime = dayjs().diff(dayjs(createdAt), "hour") < 20;

    const getFullTime = get(company, "properties.pma.fullTime", false);

    const getTime = () => {
        const showAsRelativeTime = dayjs().diff(dayjs(createdAt), "hour") < 20;

        if (getFullTime) {
            return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
        }
        if (showAsRelativeTime) {
            return dayjs()
                .locale(lang || "es")
                .to(dayjs(createdAt));
        }

        return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
    };

    const setHover = () => {
        setOnHover(true);
    };

    const setHoverFalse = () => {
        setOnHover(false);
    };

    const getStyles = () => {
        if (by === USER_TYPES.OPERATOR || by === USER_TYPES.BOT || by === USER_TYPES.BROADCAST) {
            return `${styles.bubble} ${styles["bubble--right"]}`;
        }
        return styles.bubble;
    };

    const getSide = () => {
        if (by === USER_TYPES.OPERATOR || by === USER_TYPES.BROADCAST || by === USER_TYPES.BOT) {
            return "right";
        }
        if (by === USER_TYPES.USER) {
            return "left";
        }
    };
    const bubbleStyle = getStyles();
    const bubbleSide = getSide();
    const time = getTime();
    let from = get(message, "from", null);

    if (!from) {
        from = get(props, "message.from", null);
    }

    const renderBubble = () => {
        const replyMessage = repliesTo;
        const source = get(currentRoom, "source", get(currentRoom, "bot.type", null));

        switch (toUpper(type)) {
            case "TEXT":
                if (!isEmpty(text)) {
                    return (
                        <TextBubble
                            message={message}
                            bubbleSide={bubbleSide}
                            time={time}
                            operatorId={operatorId}
                            botId={botId}
                            status={status}
                            openNewChat={props.openNewChat}
                            setHover={setHover}
                            setHoverFalse={setHoverFalse}
                            onHover={onHover}
                            hasInternalInbox={hasInternalInbox}
                            repliesTo={replyMessage}
                            source={source}
                            by={by}
                            from={from}
                            isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                            handleSelectChange={handleSelectChange}
                            copyToClipboard={copyToClipboard}
                            open={open}
                            setOpen={setOpen}
                            handleReply={handleReply}
                            messages={props.message}
                            supportsReplies={supportsReplies}
                            dropdownRef={dropdownRef}
                            inbox={inbox}
                            createdAt={createdAt}
                            isRelativeTime={isRelativeTime}
                            textError={textError}
                            styles={styles}
                        />
                    );
                } else {
                    return;
                }
            case "IMAGE":
            case "STICKER":
                return (
                    <ImageBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        openNewChat={props.openNewChat}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        hasInternalInbox={hasInternalInbox}
                        repliesTo={replyMessage}
                        by={by}
                        from={from}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        type={type}
                        styles={styles}
                    />
                );
            case "REPLY_STORY":
                return (
                    <ReplyStoryBubble
                        bubbleSide={bubbleSide}
                        time={time}
                        status={status}
                        by={by}
                        operatorId={operatorId}
                        botId={botId}
                        from={from}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        dropdownRef={dropdownRef}
                        message={message}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "LOCATION":
                return (
                    <LocationBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        openNewChat={props.openNewChat}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "GENERIC":
                return (
                    <GenericBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        openNewChat={props.openNewChat}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        hasInternalInbox={hasInternalInbox}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "DOCUMENT":
            case "FILE":
                return (
                    <DocumentBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        openNewChat={props.openNewChat}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        hasInternalInbox={hasInternalInbox}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "AUDIO":
                return (
                    <AudioBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        openNewChat={props.openNewChat}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        hasInternalInbox={hasInternalInbox}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                        type={type}
                    />
                );
            case "VIDEO":
                return (
                    <VideoBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        openNewChat={openNewChat}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "CONTACTS":
                return (
                    <ContactBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        openNewChat={openNewChat}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "POSTBACK":
            case "QUICK_REPLY":
                return (
                    <TextBubble
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        repliesTo={replyMessage}
                        by={by}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        openNewChat={openNewChat}
                        handleReply={handleReply}
                        messages={props.message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        popperRef={popperRef}
                        setHover={setHover}
                        setHoverFalse={setHoverFalse}
                        onHover={onHover}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );
            case "EVENT":
            case "EVENT_CUSTOM":
                return <EventBubble message={message} rawEvent={props.message} />;
            default:
                return <div />;
        }
    };

    const handleSelectChange = ({ target }) => {
        const value = target.value;

        switch (value) {
            case "forward":
                openNewChat(props.message);
                setOpen(false);
                break;
            case "copy":
                copyToClipboard(props.message);
                break;
            default:
                console.log(`Sorry, we are out of ${value}.`);
        }

        target.value = "...";
    };

    const copyToClipboard = (mess) => {
        const { message } = mess;
        const { text } = message;

        copy(text);

        setOpen(false);
    };

    const handleReply = () => {
        dispatch(setReplyId(props.message.messageId ? props.message.messageId : props.message.id));
        setOpen(false);
    };

    const supportsReplies = get(currentRoom, "source", null) === "venom";

    return (
        <div>
            {toUpper(by) === "USER" ? (
                <div>
                    <div className={`flex ${bubbleStyle} ${styles["bubble-no-padding"]}`}>
                        <div className={`ml-5 ${toUpper(type) === "EVENT" || toUpper(type) === "EVENT_CUSTOM" ? "w-full" : ""}`}>
                            {renderBubble()}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className={`${bubbleStyle} ${styles["bubble-no-padding"]}`}>{renderBubble()}</div>
                </div>
            )}
        </div>
    );
};

export default withTranslation()(Bubble);
