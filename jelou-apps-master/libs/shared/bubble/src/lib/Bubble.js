import { USER_TYPES } from "@apps/shared/constants";
import copy from "copy-to-clipboard";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import styles from '../bubble.module.scss';

/* Lodash Operations */
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";

import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

/* Bubbles */
import AttachmentsBubble from "./components/AttachmentsBubble";
import AudioBubble from "./components/AudioBubble";
import CallToActionBubble from "./components/CallToActionBubble";
import ContactBubble from "./components/ContactBubble";
import DocumentBubble from "./components/DocumentBubble";
import EventBubble from "./components/EventBubble";
import GenericBubble from "./components/GenericBubble";
import ImageBubble from "./components/ImageBubble";
import LocationBubble from "./components/LocationBubble";
import QuickReplyBubble from "./components/QuickreplyBubble";
import ReplyStoryBubble from "./components/ReplyStoryBubble";
import TextBubble from "./components/TextBubble";
import VideoBubble from "./components/VideoBubble";

import { setReplyId } from "@apps/redux/store";
import { withTranslation } from "react-i18next";
import BubbleNotSupported from "./components/BubbleNotSupported";
import StoryMentionBubble from "./components/StoryMentionBubble";

dayjs.extend(relativeTime);

const Bubble = (props) => {
    const { openNewChat, prevBubble, inbox, styles, app, messageId } = props;
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
    const lang = localStorage.getItem("lang") || "es";

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
    const isRelativeTime = dayjs().diff(dayjs(), "hour") < 20;

    const getFullTime = get(company, "properties.pma.fullTime", false);
    const showOptionsMenu = app === "PMA";

    const getTimeExtended = () => {
        return dayjs(createdAt).format(`DD/MM/YY - HH:mm`);
    };

    const getTime = () => {
        const showAsRelativeTime = dayjs().diff(dayjs(createdAt), "hour") < 20;

        const showFullTime = dayjs().diff(dayjs(createdAt), "hour") > 24;

        if (getFullTime) {
            return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
        }
        if (showFullTime) {
            return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
        }
        if (showAsRelativeTime) {
            return dayjs()
                .locale(lang || "es")
                .to(dayjs(createdAt));
        }

        return dayjs(createdAt).format(`HH:mm`);
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
    const time = app === "MONITORING" ? getTimeExtended() : getTime();
    let from = get(message, "from", null);

    if (!from) {
        from = get(props, "message.from", null);
    }

    const nameFromMessage = by !== "user" ? get(props.message, "sender.names", get(props.message, "sender.name", null)) : null;

    const renderBubble = () => {
        const replyMessage = repliesTo;
        const source = get(currentRoom, "source", get(currentRoom, "bot.type", null));

        switch (toUpper(type)) {
            case "TEXT":
                if (!isEmpty(text)) {
                    return (
                        <TextBubble
                            app={app}
                            showOptionsMenu={showOptionsMenu}
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
                            from={app !== "PMA" ? nameFromMessage : from}
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
            case "SHARE":
            case "STICKER":
                return (
                    <ImageBubble
                        showOptionsMenu={showOptionsMenu}
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
            case "ATTACHMENTS":
                return (
                    <AttachmentsBubble
                        showOptionsMenu={showOptionsMenu}
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

            case "STORY_MENTION":
                return (
                    <StoryMentionBubble
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
                        showOptionsMenu={showOptionsMenu}
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
                        showOptionsMenu={showOptionsMenu}
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
                        showOptionsMenu={showOptionsMenu}
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
                        showOptionsMenu={showOptionsMenu}
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
                        showOptionsMenu={showOptionsMenu}
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
                        showOptionsMenu={showOptionsMenu}
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
                    <QuickReplyBubble
                        showOptionsMenu={showOptionsMenu}
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        repliesTo={replyMessage}
                        by={by}
                        app={app}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        from={from}
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
            case "CALL_TO_ACTION":
                return (
                    <CallToActionBubble
                        showOptionsMenu={showOptionsMenu}
                        message={message}
                        bubbleSide={bubbleSide}
                        time={time}
                        operatorId={operatorId}
                        botId={botId}
                        status={status}
                        repliesTo={replyMessage}
                        by={by}
                        app={app}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        from={from}
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
                return <EventBubble time={time} message={message} rawEvent={props.message} />;
            case toUpper(undefined):
                return (
                    <TextBubble
                        app={app}
                        showOptionsMenu={showOptionsMenu}
                        message={props?.message.message}
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
                        from={app !== "PMA" ? nameFromMessage : from}
                        isSameSenderIdOfPreviousBubble={isSameSenderIdOfPreviousBubble}
                        handleSelectChange={handleSelectChange}
                        copyToClipboard={copyToClipboard}
                        open={open}
                        setOpen={setOpen}
                        handleReply={handleReply}
                        messages={message}
                        supportsReplies={supportsReplies}
                        dropdownRef={dropdownRef}
                        inbox={inbox}
                        createdAt={createdAt}
                        isRelativeTime={isRelativeTime}
                        textError={textError}
                        styles={styles}
                    />
                );

            default:
                return <BubbleNotSupported />;
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
        <div id={messageId}>
            {toUpper(by) === "USER" ? (
                <div>
                    <div className={`flex ${bubbleStyle} ${styles["bubble-no-padding"]}`}>
                        <div className={`ml-5 ${toUpper(type) === "EVENT" || toUpper(type) === "EVENT_CUSTOM" ? "w-full" : ""}`}>{renderBubble()}</div>
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
