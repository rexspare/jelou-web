import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import first from "lodash/first";
import has from "lodash/has";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";

import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import {
    BackIcon,
    BlueFlagIcon,
    CalendarIcon,
    FlagIcon,
    GreenFlagIcon,
    RedFlagIcon,
    StarFillIcon,
    StarOutIcon,
    YellowFlagIcon,
} from "@apps/shared/icons";
import TimelineChat from "../timeline-chat/timeline-chat";
import HistoryTickets from "../history-tickets/history-tickets";
import EmailTags from "../email-tags/email-tags";
import Tippy from "@tippyjs/react";

const EmailView = (props) => {
    const { loading, emails, setShowEmail, t, currentEmail, messages } = props;

    const userSession = useSelector((state) => state.userSession);
    const [replyInfo, setReplyInfo] = useState(false);

    const [showMenu, setShowMenu] = useState(false);

    const dueDate = get(currentEmail, "dueAt");
    const emailStatus = get(currentEmail, "status");
    const emailPriority = get(currentEmail, "priority");
    const [to, setTo] = useState({});
    const [cc, setCc] = useState([]);
    const [bcc, setBcc] = useState([]);

    const ticketIsClosed = get(currentEmail, "status", "") === "closed";

    const [buttonStyle, setButtonStyle] = useState("");

    const [referenceElement, setReferenceElement] = useState(null);
    const [firstEmail, setFirstEmail] = useState([]);
    const ElemContainerScroll = useRef(null);
    const bottomViewRef = useRef(null);
    const scrollUpRef = useRef(null);
    const [lastMessageContext, setLastMessageContext] = useState("");
    const [showingTipTap, setShowingTipTap] = useState(false);

    const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const onClickToBottom = () => {
        bottomViewRef.current.scrollIntoView({ behavior: "smooth" });
    };

    let sortedMessages = sortBy(
        messages.filter((message) => message.supportTicketId === get(currentEmail, "_id", "")),
        (data) => {
            return dayjs(data.createdAt);
        }
    );

    useEffect(() => {
        if (!isEmpty(emails)) {
            const sortedMessages = sortBy(
                messages.filter((message) => message.supportTicketId === get(currentEmail, "_id", "")),
                (data) => {
                    return dayjs(data.createdAt);
                }
            );
            setFirstEmail(first(sortedMessages));
        }
    }, [emails]);

    useEffect(() => {
        const lastMessageUser = [...sortedMessages].reverse().find((message) => message.by !== "bot");

        setLastMessageContext(`<div style="margin-left : 1.5rem"> <div style="padding-bottom : 1rem"> Reply to : ${get(
            lastMessageUser,
            "from.Email",
            ""
        )} <div/>
            <div style= "margin-left: 1rem; border-left : solid 1px gray; padding-left: 1rem; "> ${get(lastMessageUser, "htmlBody", "")}
            </div>
        </div>`);
    }, [messages]);

    useEffect(() => {
        if (get(currentEmail, "creationDetails.From", "").includes(",")) {
            const str = get(currentEmail, "creationDetails.From", "").split(",");
            setTo(str);
            return;
        }
        if (get(currentEmail, "creationDetails.From") === "") {
            setTo([]);
        } else {
            const toArray = [];
            toArray.push(get(currentEmail, "creationDetails.From", ""));
            setTo(toArray);
        }
    }, []);

    useEffect(() => {
        if (!has(currentEmail, "creationDetails.Cc", "")) return;
        if (get(currentEmail, "creationDetails.Cc", "").includes(",")) {
            const str = get(currentEmail, "creationDetails.Cc", "").split(",");
            setCc(str);
            return;
        }
        if (get(currentEmail, "creationDetails.Cc") === "") {
            setCc([]);
        } else {
            const toArray = [];
            toArray.push(get(currentEmail, "creationDetails.Cc", ""));
            setCc(toArray);
        }
    }, []);

    useEffect(() => {
        if (!has(currentEmail, "creationDetails.Bcc", "")) return;
        if (get(currentEmail, "creationDetails.Bcc", "").includes(",")) {
            setBcc(get(currentEmail, "creationDetails.Bcc", "").split(","));
            return;
        }
        if (get(currentEmail, "creationDetails.Bcc") === "") {
            setBcc([]);
        } else {
            const toArray = [];
            toArray.push(get(currentEmail, "creationDetails.Bcc", ""));
            setBcc(toArray);
        }
    }, []);

    const ref = useRef(null);

    const getButtonStyle = (dueDate) => {
        const dayInSeconds = 86400;

        const diffenceSeconds = dayjs(dueDate).diff(dayjs(), "seconds");

        if (diffenceSeconds < 1 && dueDate !== undefined) {
            setButtonStyle("red");
        }

        if (diffenceSeconds > 1 && diffenceSeconds < dayInSeconds * 3 && dueDate !== undefined) {
            setButtonStyle("orange");
        }
        if (diffenceSeconds > dayInSeconds * 3 && dueDate !== undefined) {
            setButtonStyle("green");
        }
    };

    useEffect(() => {
        getButtonStyle(dueDate);
    }, [dueDate]);

    const name = get(userSession, "names", "");

    if (loading) {
        return (
            <div className="relative hidden h-full flex-1 flex-col bg-gray-lightest sm:flex">
                <div className="relative flex h-full flex-col items-center justify-center rounded-xl bg-white text-center shadow-menu">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                        {/* <GreetingSupportIcon className="my-4" width="330" height="330" />
                        <ClipLoader size={"40px"} color="#00B3C7" /> */}
                        <div className="mt-4 flex flex-col sm:flex-row">
                            {/* <div className="mr-1 text-xl font-bold text-gray-15 text-opacity-75">{greeting}</div>
                            <div className="text-xl font-bold text-primary-200">{firstName}</div> */}
                        </div>
                        <div className="text-15 leading-normal text-gray-15 text-opacity-[0.65]">{t("Aún no tienes tickets entrantes")}</div>
                    </div>
                </div>
            </div>
        );
    }

    const notify = () => {
        toast.error(
            <div className="flex items-center justify-between">
                <div className="flex">
                    <div className="text-15">{t("Hubo un error al momento del envío. Intenta nuevamente")}</div>
                </div>

                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.6491 9.00013L17.6579 1.99094C18.114 1.53502 18.114 0.797859 17.6579 0.341939C17.202 -0.11398 16.4649 -0.11398 16.0089 0.341939L8.99989 7.35114L1.99106 0.341939C1.53493 -0.11398 0.798002 -0.11398 0.342092 0.341939C-0.114031 0.797859 -0.114031 1.53502 0.342092 1.99094L7.35093 9.00013L0.342092 16.0093C-0.114031 16.4653 -0.114031 17.2024 0.342092 17.6583C0.5693 17.8858 0.868044 18 1.16657 18C1.4651 18 1.76363 17.8858 1.99106 17.6583L8.99989 10.6491L16.0089 17.6583C16.2364 17.8858 16.5349 18 16.8334 18C17.132 18 17.4305 17.8858 17.6579 17.6583C18.114 17.2024 18.114 16.4653 17.6579 16.0093L10.6491 9.00013Z"
                        fill="#FF7777"
                    />
                </svg>
            </div>,

            { autoClose: true, position: toast.POSITION.BOTTOM_RIGHT }
        );
    };

    const closeHistoryModal = () => {
        setShowHistory(false);
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case "open":
                return "text-primary-200";
            case "new":
                return "text-yellow-1020";
            case "pending":
                return "text-red-950";
            case "closed":
                return "text-gray-400";
            case "resolved":
                return "text-green-960";
            case "draft":
                return "text-gray-400";
            default:
                break;
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case "open":
                return "bg-primary-15";
            case "new":
                return "bg-yellow-20";
            case "pending":
                return "bg-red-20";
            case "closed":
                return "bg-gray-200";
            case "resolved":
                return "bg-green-20";
            case "draft":
                return "bg-gray-20";
            default:
                break;
        }
    };

    const priorityFlagIcon = () => {
        switch (emailPriority) {
            case "urgent":
                return <RedFlagIcon height="1.26rem" width="1.26rem" />;

            case "high":
                return <YellowFlagIcon height="1.26rem" width="1.26rem" />;

            case "normal":
                return <GreenFlagIcon height="1.26rem" width="1.26rem" />;

            case "low":
                return <BlueFlagIcon height="1.26rem" width="1.26rem" />;

            default:
                return <FlagIcon height="1.26rem" width="1.26rem" className={`fill-current text-gray-400`} fillOpacity={"1"} />;
        }
    };

    return (
        <div className={`flex w-full flex-1 flex-col overflow-x-hidden`}>
            <div className="mb-3 flex items-center justify-between border-b-[1px] border-[#A6B4D040] p-4">
                <div className="flex flex-row items-center lg:flex-1">
                    <button
                        className="pr-3"
                        onClick={() => {
                            setShowEmail(false);
                        }}>
                        <BackIcon width="9" height="13" />
                    </button>
                    <span className="mx-3 text-xl font-medium text-gray-400">{`#${get(currentEmail, "number", "")}`}</span>
                    {!isEmpty([]) && (
                        <div className="relative">
                            <button
                                onMouseOver={() => setReplyInfo(true)}
                                onMouseLeave={() => setReplyInfo(false)}
                                className="mr-3 text-13 text-primary-200 underline">
                                {`${t("en respuesta a")}: `}
                            </button>

                            <Transition
                                show={replyInfo}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                className="absolute left-0 z-50 w-52">
                                <div className="flex flex-col rounded-11 bg-white p-3 shadow-email"></div>
                            </Transition>
                        </div>
                    )}

                    <div className="mt-2 mb-3 mr-6 flex pl-2">
                        <div className={`flex min-w-20 items-center justify-center rounded-1 ${getStatusBgColor(emailStatus)} px-3 py-1`}>
                            <p className={`font-bold ${getStatusTextColor(emailStatus)}`}>{t(`emailStatus.${emailStatus}`)}</p>
                        </div>
                    </div>
                    <div className="mr-6">
                        <Tippy theme={"tomato"} content={t("Favoritos")} arrow={false}>
                            {currentEmail.isFavorite ? (
                                <StarFillIcon height="1.35rem" width="1.7rem" className="fill-current text-[#D39C00]" />
                            ) : (
                                <StarOutIcon height="1.35rem" width="1.7rem" className="fill-current text-gray-400" />
                            )}
                        </Tippy>
                    </div>
                    <div className="mr-6">{priorityFlagIcon()}</div>
                    <HistoryTickets currentEmail={currentEmail} />
                </div>
                <div ref={ref}>
                    <button
                        ref={setReferenceElement}
                        className={`relative flex h-[2.0625rem] select-none items-center space-x-2 rounded-[22.5px] border-[1.5px] border-[#A6B4D080] text-[0.9375rem] disabled:cursor-not-allowed ${
                            buttonStyle === "green"
                                ? "border-secondary-425"
                                : buttonStyle === "red"
                                ? "border-secondary-250"
                                : buttonStyle === "orange"
                                ? "border-[#FF8A00]"
                                : buttonStyle === "gray" && "border-white"
                        } px-3`}
                        onClick={() => {
                            setShowMenu(!showMenu);
                        }}>
                        <CalendarIcon
                            height="1.2rem"
                            width="1.2rem"
                            className={`fill-current ${
                                buttonStyle === "green"
                                    ? "text-secondary-425"
                                    : buttonStyle === "red"
                                    ? "text-secondary-250"
                                    : buttonStyle === "orange"
                                    ? "text-[#FF8A00]"
                                    : " text-gray-400"
                            }`}
                        />
                        <p
                            className={`${
                                buttonStyle === "green"
                                    ? "text-secondary-425"
                                    : buttonStyle === "red"
                                    ? "text-secondary-250"
                                    : buttonStyle === "orange"
                                    ? "text-[#FF8A00]"
                                    : "text-gray-400"
                            }`}>
                            <span className="font-semibold">{buttonStyle === "red" ? t("monitoring.expired") : t("monitoring.expires")}</span>
                            <span>
                                {get(currentEmail, "dueAt") &&
                                    dayjs(get(currentEmail, "dueAt"))
                                        .locale(lang || "es")
                                        .format("DD MMMM YY")}{" "}
                            </span>
                        </p>
                    </button>
                    <Transition
                        show={showMenu}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        className="absolute z-100"></Transition>
                </div>
            </div>

            <div ref={ElemContainerScroll} className="mb-[2rem] flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <div className="flex w-full flex-col space-y-5 rounded-xl px-3 lg:flex-1">
                    <div className="flex w-full flex-col lg:rounded-l-xl">
                        <div className="px-4 pb-2">
                            <div className="flex flex-col">
                                <span className="text text-[2rem] font-bold text-gray-400">{get(currentEmail, "title", "")}</span>
                                <div className="mt-3 mb-4">{!ticketIsClosed && <EmailTags emailTags={get(currentEmail, "tags", [])} />}</div>
                            </div>
                        </div>

                        <div className="flex flex-1">
                            <TimelineChat sortedMessages={sortedMessages} scrollUpRef={scrollUpRef} currentEmail={currentEmail} />
                        </div>
                    </div>
                </div>

                {showDeleteMessageModal && " "}
                {!showingTipTap && (
                    <button onClick={() => onClickToBottom()} className={"bottom-14 right-10 bg-teal fixed z-10 rounded-full p-3"}></button>
                )}
            </div>
            {get(currentEmail, "newMessage", false) && (
                <div className="my-auto mr-3 mb-3 flex h-9 justify-end rounded-default">
                    <div className="z-20 flex w-fit items-center space-x-2 rounded-default bg-yellow-200 px-3 font-medium">
                        {t("Tiene un nuevo mensaje")}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withTranslation()(EmailView);
