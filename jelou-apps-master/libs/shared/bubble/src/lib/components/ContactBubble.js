import dayjs from "dayjs";
import get from "lodash/get";
import has from "lodash/has";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import first from "lodash/first";
import { useSelector } from "react-redux";
import { useTranslation, withTranslation } from "react-i18next";
import Avatar from "react-avatar";

import OptionsMenu from "./OptionsMenu";
import ReplyBubble from "./ReplyBubble";
import BubbleContainer from "./BubbleContainer";
import { StatusTick } from "@apps/shared/common";
import { useEffect, useState } from "react";

const TextBubble = (props) => {
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
        messages,
        openNewChat,
        setOpen,
        open,
        handleReply,
        supportsReplies,
        dropdownRef,
        popperRef,
        repliesTo,
        inbox = false,
        createdAt,
        styles,
        showOptionsMenu,
    } = props;
    const { t } = useTranslation();
    const contacts = get(props.message, "contacts", []);
    const contact = first(contacts);

    const phones = get(contact, "phones", []);
    const emails = get(contact, "emails", []);

    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);
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

    if (has(from, "name")) {
        names = from.name;
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

    const getName = ({ name }) => {
        if (has(name, "first_name")) {
            return name.first_name;
        }
        if (has(name, "formatted_name")) {
            return name.formatted_name;
        }

        return t("Desconocido");
    };

    const [name, setName] = useState(getName(contact));

    useEffect(() => {
        setName(getName(contact));
    }, [contact]);

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

                <div className="flex">
                    <Avatar
                        src={"https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg"}
                        name={name}
                        className={`mr-3`}
                        fgColor={"#767993"}
                        size="2.438rem"
                        round={true}
                        color={"#D7EAFF"}
                        textSizeRatio={2}
                    />
                    <div className="flex flex-col">
                        {name}
                        {phones.map((phone, idx) => {
                            return <div key={idx}>{phone.phone}</div>;
                        })}
                        {emails.map((email, idx) => {
                            return <div key={idx}>{email.email}</div>;
                        })}
                    </div>
                </div>

                <div className="mt-1 flex h-4 items-center justify-end">
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
        </BubbleContainer>
    );
};

export default withTranslation()(TextBubble);
