import dayjs from "dayjs";
import first from "lodash/first";
import toLower from "lodash/toLower";
import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import last from "lodash/last";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";
import toUpper from "lodash/toUpper";
import Turndown from "turndown";
import { v4 as uuidv4 } from "uuid";

import * as Sentry from "@sentry/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { gfm } from "turndown-plugin-gfm";

// import "./table.scss";
import { DeleteModal, ForwardEmail, MassiveModal, PeriodPicker } from "@apps/pma/ui-shared";
import { addEmail, addMessage, deleteEmail, setActualEmails, setCurrentEmail, setInputMessage, setMessages, setNotReadEmails, updateCurrentEmail, updateEmail, updateMessage } from "@apps/redux/store";
import { BackIcon, CalendarIcon, DownIcon, GreetingEmailIcon, ScrollBottomIcon, SpinnerIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { emailsViewEnable, getTime } from "@apps/shared/utils";
import { Transition } from "@headlessui/react";
import { usePopper } from "react-popper";
import { ClipLoader } from "react-spinners";

import { ErrorModal, renderMessage } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import EmailAction from "../email-action/email-action";
import EmailHistorySlideOver from "../email-history-slideover/email-history-slideover";
import EmailInputOptions from "../email-input/email-input-options";

import FollowUpEmailHistory from "../follow-up-email-history/follow-up-email-history";
import StatusOptions from "../status-options/status-options";
import { RenderButton } from "./RenderButton";
import { SeeEmail } from "./SeeEmail";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const Email = (props) => {
    const { loading, emails, setShowEmail, selectedRow, setSearch, setActualPage, showConfirmationModal, getEmail, getExpiredEmails, getNotReadEmails, from, setFrom } = props;
    const { t } = useTranslation();
    const currentEmail = useSelector((state) => state.currentEmail);
    const userSession = useSelector((state) => state.userSession);
    const showChat = useSelector((state) => state.showChat);
    const messages = useSelector((state) => state.messages);
    const time = dayjs().locale("es").format("HH:mm");
    const bots = useSelector((state) => state.bots);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const actualEmails = useSelector((state) => state.actualEmails);
    const userTeams = useSelector((state) => state.userTeams);
    const company = useSelector((state) => state.company);
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Open");
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [replyInfo, setReplyInfo] = useState(false);

    const [showMenu, setShowMenu] = useState(false);
    const [dueDate] = useState(get(currentEmail, "dueAt"));
    const [to, setTo] = useState([]);
    const [cc, setCc] = useState([]);
    const [bcc, setBcc] = useState([]);

    const [buttonStyle, setButtonStyle] = useState("");

    const [sending, setSending] = useState(false);

    const [favorite, setFavorite] = useState(null);

    const [operatorSelected, setOperatorSelected] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loadingForwading, setLoadingForwading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openResolvedModal, setOpenResolvedModal] = useState(false);
    const [type, setType] = useState({});

    const [popperElement, setPopperElement] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);
    const [firstEmail, setFirstEmail] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [defaultSignature, setDefaultSignature] = useState({});
    const ElemContainerScroll = useRef(null);
    const bottomViewRef = useRef(null);
    const scrollUpRef = useRef(null);
    const [lastMessageContext, setLastMessageContext] = useState("");
    const [showingTipTap, setShowingTipTap] = useState(false);
    const [blackListEmails, setBlackListEmails] = useState([]);

    const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
    const [showTipTap, setShowTipTap] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [followUpMessages, setFollowUpMessages] = useState([]);
    const [addedContext, setAddedContext] = useState(false);
    const [CopyPublicEmailLink, setCopyPublicEmailLink] = useState(false);

    const canViewEmails = emailsViewEnable(userTeams);

    const [warningMessage, setWarningMessage] = useState("");
    const [showWarning, setShowWarning] = useState(false);

    const onClickToBottom = () => {
        bottomViewRef.current.scrollIntoView({ behavior: "smooth" });
    };

    const emailFollowUp = !isEmpty(get(currentEmail, "parent", "")) ? currentEmail.parent : !isEmpty(get(currentEmail, "child", "")) ? get(currentEmail, "child", "") : {};

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [-30, 10],
                },
            },
        ],
        placement: "top",
    });

    let sortedMessages = sortBy(
        messages.filter((message) => message.supportTicketId === get(currentEmail, "_id", "")),
        (data) => {
            return dayjs(data.createdAt);
        }
    );

    useEffect(() => {
        const botId = get(currentEmail, "bot.id", "");
        const botInfo = bots.filter((bot) => bot.id === botId);
        const firstBotArray = first(botInfo);

        setBlackListEmails(get(firstBotArray, "properties.supportTickets.emails", []));
    }, [blackListEmails]);

    useEffect(() => {
        if (!isEmpty(emails)) {
            const sortedMessages = sortBy(
                messages.filter((message) => message.supportTicketId === get(currentEmail, "_id", "")),
                (data) => {
                    return dayjs(data.createdAt);
                }
            );
            getSignatures();
            setFirstEmail(first(sortedMessages));
        }
    }, [emails]);

    useEffect(() => {
        const lastMessageUser = [...sortedMessages].reverse().find((message) => message.by !== "bot");

        setLastMessageContext(`<div style="margin-left : 1.5rem"> <div style="padding-bottom : 1rem"> Reply to : ${get(lastMessageUser, "from.Email", "")} <div/> 
            <div style= "margin-left: 1rem; border-left : solid 1px gray; padding-left: 1rem; "> ${get(lastMessageUser, "htmlBody", "")} 
            </div> 
        </div>`);
    }, [messages]);

    const findCurrentBot = (botArray) => {
        const botId = get(currentEmail, "bot.id", null);
        return botArray.find((bot) => bot.id === botId);
    };

    const bot = findCurrentBot(bots);
    const byTeam = toUpper(get(bot, "properties.signatures.by", "")) === "TEAM";
    const byUser = toUpper(get(bot, "properties.signatures.by", "")) === "USER";

    const closeDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const closeResolvedModal = () => {
        setOpenResolvedModal(false);
    };

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
        const emailsOrdered = sortBy(emails, ["createdAt"], ["desc"]);
        const firstEmail = first(emailsOrdered);
        const To = get(firstEmail, "to[0].Email", "");
        if (To) setFrom([To]);
    }, [emails]);

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

    useOnClickOutside(ref, () => setShowMenu(false));

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

    const getFirstEmail = async () => {
        const id = get(selectedRow, "_id", "");
        const {
            data: { results },
        } = await JelouApiV1.get(`/bots/${bot.id}/emails`, {
            params: { sort: "ASC", limit: 1, supportTicketId: id },
        });
        const firstPosition = first(results, {});
        const firstTo = first(get(firstPosition, "to", []));
        const to = get(firstTo, "Email", "");

        return to;
    };

    useEffect(() => {
        getButtonStyle(dueDate);
    }, [dueDate]);

    const setDueDate = (dueDate) => {
        const { _id: keyId } = currentEmail;
        const updatedcurrentEmail = { ...currentEmail, dueAt: dueDate };
        JelouApiV1.put(`support-tickets/${keyId}/`, {
            dueAt: dueDate,
        })
            .then(() => {
                dispatch(updateCurrentEmail(updatedcurrentEmail));
                dispatch(addEmail(updatedcurrentEmail));
                getButtonStyle(dueDate);
                renderMessage(t("pma.Fecha de expiracion actualizada con exito"), MESSAGE_TYPES.SUCCESS);
            })
            .catch(({ response }) => {
                const { data } = response;
                const validationError = first(get(data, "validationError.dueAt", []));
                const languageError = get(validationError, `${lang}`);
                renderMessage(languageError, MESSAGE_TYPES.ERROR);
            });
    };

    const td = new Turndown();
    td.use(gfm);

    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));

    const greeting = getTime(time, t);

    const getSignatures = async () => {
        const { data: response } = await JelouApiV1.get("/operators/signatures");
        let data = get(response, "data", []);

        const { teamSignatures = [], usersSignatures = [] } = data;

        if (isEmpty(teamSignatures) && isEmpty(usersSignatures)) {
            setSignatures([]);
            setDefaultSignature({});
            return;
        }

        setSignatures(byTeam ? get(data, "teamSignatures", []) : byUser ? get(data, "usersSignatures", []) : get(data, "defaultSignatureTeam", []));
        if (byTeam) {
            data.defaultSignatureTeam.body = `<p><br><br>${get(data, "defaultSignatureTeam.body", "")}</p>`;
            setDefaultSignature(get(data, "defaultSignatureTeam", ""));
        }
        if (byUser) {
            const firstSignature = first(get(data, "usersSignatures", []));
            firstSignature.body = `<p><br><br>${get(firstSignature, "body", "")}</p>`;
            setDefaultSignature(firstSignature);
        }
    };
    const editFromPermission = userTeams.some((team) => team?.properties?.emails?.canEditEmailFrom);

    if (!canViewEmails) {
        return (
            <div className={`h-full flex-1 ${showChat ? "flex" : "hidden mid:flex"} relative flex-col`}>
                <div className="flex flex-1 flex-col">
                    <div className="relative flex h-full flex-col items-center justify-center bg-white text-center shadow-loading mid:rounded-xl">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-2xl font-bold text-gray-400">{greeting}</div>
                                <div className="text-2xl font-bold text-primary-200">{firstName}</div>
                            </div>
                            <GreetingEmailIcon className="my-10" width="213" height="198" />
                            <div className="text-lg font-bold leading-normal text-gray-400">{t("pma.Parece que no tienes acceso a esta sección")}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="relative hidden h-full flex-1 flex-col rounded-xl bg-gray-lightest sm:flex">
                <div className="relative flex h-full flex-col items-center justify-center rounded-xl bg-white text-center shadow-loading">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                        <GreetingEmailIcon className="my-4" width="330" height="330" />
                        <ClipLoader size={"40px"} color="#00B3C7" />
                        <div className="mt-4 flex flex-col sm:flex-row">
                            <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                            <div className="text-xl font-bold text-primary-200">{firstName}</div>
                        </div>
                        <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">
                            {!canViewEmails ? t("pma.Parece que no tienes acceso a esta sección") : t("pma.Aún no tienes emails entrantes")}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const notifyError = (msg) => {
        toast.error(
            <div className="flex items-center justify-between">
                <div className="flex">
                    <div className="text-15 text-red-600">{msg}</div>
                </div>
            </div>,

            { autoClose: true, position: toast.POSITION.BOTTOM_RIGHT }
        );
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(String(email).toLowerCase())) {
            return email;
        }
    };

    const resetFrom = () => {
        const emailsOrdered = sortBy(emails, ["createdAt"], ["desc"]);
        const firstEmail = first(emailsOrdered);

        const To = get(firstEmail, "to[0].Email", "");
        if (To) setFrom(To);
    };

    const sendMessage = async (editorRef) => {
        if (editFromPermission && isEmpty(from)) {
            setShowEmailError(true);
            notifyError(t("pma.Debes agregar un remitente"));
            return;
        }
        if (isEmpty(to)) {
            notifyError(t("pma.Debes agregar al menos un destinatario"));
            return;
        }

        const allEmails = [...to, ...cc, ...bcc, ...from];
        const allEmailsToCheck = [...to, ...cc, ...bcc];
        const invalidEmails = allEmails.filter((email) => !validateEmail(email));

        const blackListEmailsFiltered = allEmailsToCheck.filter((email) => blackListEmails.includes(toLower(email)));

        if (!isEmpty(blackListEmailsFiltered)) {
            setWarningMessage("pma.No está permitido enviar al siguiente destinatario: " + blackListEmailsFiltered.join(", "));
            setShowWarning(true);
            return;
        }

        if (!isEmpty(invalidEmails)) {
            invalidEmails.forEach((email, index) => {
                invalidEmails[index] = '"' + email + '"';
            });

            setWarningMessage("Asegúrate de que todas las direcciones tengan el formato correcto: " + invalidEmails.join(", "));
            setShowWarning(true);
            return;
        }

        let textToSend = text;

        if (currentEmail.ticketStatus === "closed") {
            notifyError(t("pma.No puedes responder a un ticket cerrado"));
            return;
        }

        setSending(true);

        let message;

        const creationDetails = get(currentEmail, "creationDetails", {});
        const firstTo = await getFirstEmail();

        message = {
            botId: get(currentEmail, "bot.id", get(bot, "id")),
            context: lastMessageContext,
            type: "MAIL",
            text: textToSend,
            quotedMessageId: get(last(emails), "emailId", null),
            ...(attachments ? { attachments: attachments } : {}),
            supportTicketId: get(currentEmail, "_id"),
            userId: get(currentEmail, "user.id", null),
            from: {
                Name: get(currentEmail, "bot.name"),
                Email: !isEmpty(from) ? from.toString() : get(currentEmail, "bot.email"),
            },
            to: to,
            sender: {
                names: get(userSession, "names", ""),
            },
            by: "OPERATOR",
        };

        const formMessage = {
            ...message,
            bubble: {
                quotedMessageId: get(last(emails), "emailId", null),
                ...(attachments ? { attachments: attachments } : {}),
                text: textToSend,
                type: "MAIL",
                From: !isEmpty(from) ? from.toString() : firstTo,
                To: to.join(),
                ...(!isEmpty(cc) ? { Cc: cc.join() } : {}),
                ...(!isEmpty(bcc) ? { Bcc: bcc.join() } : {}),
            },
            id: uuidv4(),
        };

        const keyId = get(currentEmail, "_id", "");

        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
            dispatch(
                updateMessage({
                    ...message,
                    ...formMessage,
                    status: "FAILED",
                })
            );
            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Mail ) Send Message Failed With: ${error.message}`));
            setSending(false);
        });

        const updatedcurrentEmail = {
            ...currentEmail,
            creationDetails: { ...creationDetails, Cc: cc.join(), Bcc: bcc.join(), From: to.join() },
        };

        JelouApiV1.put(`support-tickets/${keyId}`, {
            creationDetails: {
                ...creationDetails,
                Cc: cc.join(),
                Bcc: bcc.join(),
                ...(!isEmpty(from) ? { From: from.toString() } : { From: to.join() }),
            },
        })
            .then(() => {
                setShowTipTap(false);
                resetFrom();
                dispatch(updateEmail(updatedcurrentEmail));
            })
            .catch((error) => {
                console.log(error);
            });

        scrollUpRef.current?.scrollIntoView();

        if (text !== "<p></p>" && text !== "") {
            dispatch(addMessage({ ...formMessage, htmlBody: text, cc, bcc, createdAt: dayjs().format() }));
        }

        setSending(false);
        setAttachments([]);

        setText("");
        dispatch(setInputMessage({ roomId: currentEmail.roomId, text: "" }));
    };

    const settingFavorite = () => {
        const { _id: keyId } = currentEmail;
        setFavorite(!favorite);
        const updatedcurrentEmail = { ...currentEmail, isFavorite: !favorite };
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        JelouApiV1.put(`support-tickets/${keyId}`, {
            isFavorite: !favorite,
        }).catch((error) => console.log("ERROR: ", error));
    };

    const setPriority = (priority) => {
        const { _id: keyId } = currentEmail;
        const updatedcurrentEmail = { ...currentEmail, priority };
        dispatch(addEmail(updatedcurrentEmail));
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        JelouApiV1.put(`support-tickets/${keyId}`, {
            priority,
        }).catch((error) => console.log("ERROR: ", error));
    };

    const setState = (status, del) => {
        const { _id: keyId } = currentEmail;
        // currentEmail.status = status;
        let updatedcurrentEmail = { ...currentEmail };
        updatedcurrentEmail.status = status;
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        if (status !== "closed") {
            dispatch(addEmail(updatedcurrentEmail));
        }
        JelouApiV1.put(`support-tickets/${keyId}`, {
            status,
            ...(status === "closed" ? { dynamicEventId: type.key } : {}),
        });
        if (status === "closed") {
            dispatch(setActualEmails(actualEmails - 1));
            setTimeout(() => {
                getNotReadEmails();
                getExpiredEmails();
            }, 1000);
        }
    };

    const onChangeForward = (operator) => {
        setOperatorSelected(operator);
    };

    const closeModal = () => {
        setShowForwardModal(false);
        setOperatorSelected(null);
    };

    const closeHistoryModal = () => {
        setShowHistory(false);
    };

    const forwardTransfer = () => {
        const id = get(currentEmail, "_id");
        const { value } = operatorSelected;

        const payload = {
            origin: "transfer",
            operatorId: value,
            supportTicketId: id,
        };

        setLoadingForwading(true);

        JelouApiV1.post(`/support-tickets/assign`, payload)
            .then(() => {
                setSuccess(true);
                setLoadingForwading(false);

                setTimeout(() => {
                    setShowEmail(false);
                    setOperatorSelected(null);
                    setSuccess(false);
                    dispatch(deleteEmail(currentEmail._id));
                }, 1000);
            })
            .catch((err) => {
                console.error("ERROR", err);
                setLoadingForwading(false);
                setSuccess(false);
                setOperatorSelected(null);
            });
    };

    const confirmDelete = () => {
        const { _id: id } = currentEmail;
        dispatch(deleteEmail(id));
        setState("closed", true);
        setOpenDeleteModal(false);
        setShowEmail(false);
    };

    const confirmTicketResolved = () => {
        setState("resolved", false);
        setOpenResolvedModal(false);
    };

    const handleEditorChange = (e) => {
        setText(e.target.getContent());
    };

    const acceptNewEmail = () => {
        const updatedcurrentEmail = { ...currentEmail, read: true, newMessage: false };
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        getEmail(updatedcurrentEmail);
        dispatch(setNotReadEmails({ operation: "subtract", value: 1 }));
    };

    const ignoreNewEmail = () => {
        const updatedcurrentEmail = { ...currentEmail, newMessage: false };
        dispatch(updateCurrentEmail(updatedcurrentEmail));
    };

    const disabled = get(currentEmail, "status", "") === "closed";

    const onCloseMessageModal = () => {
        setShowDeleteMessageModal(false);
    };

    const onConfirmDeleteMessage = () => {
        setShowTipTap(false);
        setShowDeleteMessageModal(false);
        setShowingTipTap(false);
        setAddedContext(false);
    };

    const RenderTeam = ({ team }) => {
        const badgeStyle = "justify-center inline-flex items-center h-[20px] px-2 rounded-[7px] text-[10px] font-bold w-fit";
        return <span className={`${badgeStyle} bg-[#209F8B26] uppercase text-[#209F8B]`}>{`${"equipo: "} ${t(team)}`}</span>;
    };

    const getEmailInfo = async (id) => {
        const { data } = await JelouApiV1.get(`bots/${bot.id}/emails`, {
            params: {
                supportTicketId: id,
            },
        });
        const response = get(data, "results", []);
        setFollowUpMessages(response);
    };

    const showTicket = (id) => {
        getEmail(id);
        getEmailInfo(id);
        setShowHistory(true);
    };

    const handleCopyPublicEmailLinkClick = () => {
        const id = get(selectedRow, "_id", "");
        const publicEmailURl = `${window.location.origin}/email/${bot.id}/${id}`;

        setCopyPublicEmailLink(true);
        navigator.clipboard.writeText(publicEmailURl).then(() => {
            setCopyPublicEmailLink(false);
            window.open(publicEmailURl, "_blank");
        });
    };

    const showPublcEmailLink = get(company, "properties.operatorView.supportTickets.showPublicLinkBtn", false);

    return (
        <div className={`${showChat ? "flex flex-col" : "hidden mid:flex mid:flex-col"} w-full flex-1 overflow-x-hidden`}>
            <div className="mb-3 flex items-center justify-between gap-4 border-b-[1px] border-[#A6B4D040] p-4">
                <div className="flex flex-row items-center mid:flex-1">
                    <button
                        className="pr-3"
                        onClick={() => {
                            setShowEmail(false);
                            dispatch(setMessages([]));
                            dispatch(setCurrentEmail({}));
                        }}
                    >
                        <BackIcon width="9" height="13" />
                    </button>
                    <span className="mx-3 text-xl font-medium text-gray-400">{`#${get(selectedRow, "number", "")}`}</span>
                    {!isEmpty(emailFollowUp) && (
                        <div className="relative">
                            <button
                                onMouseOver={() => setReplyInfo(true)}
                                onMouseLeave={() => setReplyInfo(false)}
                                onClick={() => showTicket(emailFollowUp._id)}
                                className="mr-3 text-13 text-primary-200 underline"
                            >
                                {`${t("pma.en respuesta a")}: `}
                                <b>{get(emailFollowUp, "number", 20)}</b>
                            </button>

                            <Transition
                                show={replyInfo}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                className="absolute left-0 z-50 w-72"
                            >
                                <div className="flex flex-col rounded-11 bg-white p-3 shadow-email">
                                    <span className="mb-1 text-13 font-bold text-gray-400">{`${t(`Ticket`)} #${emailFollowUp.number}`}</span>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-13 font-bold text-[#A2AABA]">{emailFollowUp.title}</span>
                                        <span className="mb-2 text-13 font-bold text-gray-400">{get(emailFollowUp, "creationDetails.From", "")}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <RenderButton status={get(emailFollowUp, "status", "")} />
                                        {!isEmpty(get(emailFollowUp, "team.name", "")) && <RenderTeam team={get(emailFollowUp, "team.name", "")} />}
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    )}
                    <StatusOptions setState={setState} setOpenResolvedModal={setOpenResolvedModal} setType={setType} setOpenDeleteModal={setOpenDeleteModal} bot={bot} />
                    <EmailAction
                        currentEmail={currentEmail}
                        settingFavorite={settingFavorite}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setOpenResolvedModal={setOpenResolvedModal}
                        setType={setType}
                        openDeleteModal={openDeleteModal}
                        setState={setState}
                        showConfirmationModal={showConfirmationModal}
                        setShowForwardModal={setShowForwardModal}
                        setPriority={setPriority}
                        setSearch={setSearch}
                        setActualPage={setActualPage}
                    />
                    {showForwardModal && (
                        <ForwardEmail
                            closeModal={closeModal}
                            submitChange={forwardTransfer}
                            onChange={onChangeForward}
                            success={success}
                            operatorSelected={operatorSelected}
                            bot={bot}
                            loadingForwading={loadingForwading}
                            changeParse
                        />
                    )}
                    {/* Show the history of replys of parent's email closed status */}
                    {showHistory && <FollowUpEmailHistory closeModal={closeHistoryModal} supportTicketFollowUp={emailFollowUp} followUpMessages={followUpMessages} />}
                    <EmailHistorySlideOver />
                </div>
                {showPublcEmailLink && (
                    <button
                        disabled={CopyPublicEmailLink}
                        onClick={handleCopyPublicEmailLinkClick}
                        className="grid h-8 w-44 place-content-center rounded-full bg-primary-200 px-4 py-2 text-13 font-bold text-white hover:bg-primary-100 disabled:cursor-not-allowed"
                    >
                        {CopyPublicEmailLink ? <SpinnerIcon /> : t("pma.Copiar enlace directo")}
                    </button>
                )}
                <div ref={ref}>
                    <button
                        disabled={disabled}
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
                        }}
                    >
                        <CalendarIcon
                            height="1.2rem"
                            width="1.2rem"
                            className={`fill-current ${
                                buttonStyle === "green" ? "text-secondary-425" : buttonStyle === "red" ? "text-secondary-250" : buttonStyle === "orange" ? "text-[#FF8A00]" : " text-gray-400"
                            }`}
                        />
                        <p
                            className={`${
                                buttonStyle === "green" ? "text-secondary-425" : buttonStyle === "red" ? "text-secondary-250" : buttonStyle === "orange" ? "text-[#FF8A00]" : "text-gray-400"
                            }`}
                        >
                            <span className="font-semibold">{!dueDate ? t("pma.Seleccione una fecha") : buttonStyle === "red" ? t("pma.Expiro") : t("pma.Expira")}</span>
                            <span>{get(currentEmail, "dueAt") && dayjs(get(currentEmail, "dueAt")).locale(lang).format("DD MMMM YY")} </span>
                        </p>
                        <DownIcon
                            height="1rem"
                            width="0.75rem"
                            className={`${
                                buttonStyle === "green" ? "text-secondary-425" : buttonStyle === "red" ? "text-secondary-250" : buttonStyle === "orange" ? "text-[#FF8A00]" : "text-gray-400"
                            }  fill-current`}
                        />
                    </button>
                    <Transition
                        show={showMenu}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        className="absolute z-100"
                    >
                        <PeriodPicker
                            styles={styles}
                            attributes={attributes}
                            setShowMenu={setShowMenu}
                            expirationDate={new Date(dueDate)}
                            setDueDate={setDueDate}
                            getButtonStyle={getButtonStyle}
                            setPopperElement={setPopperElement}
                        />
                    </Transition>
                </div>
            </div>

            <div ref={ElemContainerScroll} className="mb-[2rem] flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <div className="flex w-full flex-col space-y-5 rounded-xl px-3 mid:flex-1">
                    <SeeEmail currentEmail={currentEmail} scrollUpRef={scrollUpRef} selectedRow={selectedRow} sortedMessages={sortedMessages} />
                    <EmailInputOptions
                        setShowEmailError={setShowEmailError}
                        showEmailError={showEmailError}
                        editFromPermission={editFromPermission}
                        blackListEmails={blackListEmails}
                        setShowingTipTap={setShowingTipTap}
                        bottomViewRef={bottomViewRef}
                        lastMessageContext={lastMessageContext}
                        defaultSignature={defaultSignature}
                        setShowTipTap={setShowTipTap}
                        showTipTap={showTipTap}
                        setShowDeleteMessageModal={setShowDeleteMessageModal}
                        ElemContainerScroll={ElemContainerScroll.current}
                        sendMessage={sendMessage}
                        messages={messages}
                        bot={bot}
                        text={text}
                        setText={setText}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        setSelectedOption={setSelectedOption}
                        selectedOption={selectedOption}
                        firstEmail={firstEmail}
                        sending={sending}
                        setSending={setSending}
                        to={to}
                        setTo={setTo}
                        cc={cc}
                        setCc={setCc}
                        bcc={bcc}
                        setBcc={setBcc}
                        from={from}
                        setFrom={setFrom}
                        disabled={disabled}
                        signatures={signatures}
                        handleEditorChange={handleEditorChange}
                        setDefaultSignature={setDefaultSignature}
                        setSignatures={setSignatures}
                        addedContext={addedContext}
                        setAddedContext={setAddedContext}
                    />
                </div>
                {openDeleteModal && <MassiveModal close={closeDeleteModal} type={type} confirm={confirmDelete} />}
                {openResolvedModal && <MassiveModal close={closeResolvedModal} type={type} confirm={confirmTicketResolved} />}
                {showDeleteMessageModal && <DeleteModal action={"eliminar"} close={onCloseMessageModal} confirm={onConfirmDeleteMessage} label={"este mensaje"} />}
                {!showingTipTap && (
                    <button onClick={() => onClickToBottom()} className={"fixed bottom-[3.5rem] right-[2.5rem] z-10 rounded-full bg-primary-200 p-3"}>
                        <ScrollBottomIcon width="1.2rem" height="1.2rem" />
                    </button>
                )}
                {showWarning && (
                    <ErrorModal
                        title={"Formato incompleto"}
                        onClose={() => {
                            setShowWarning(false);
                            setWarningMessage("");
                        }}
                        maxWidth={"md:min-w-84 md:max-w-lg"}
                    >
                        <div className="space-y-2">
                            <h3 className="text-grey-300 text-15 font-semibold">{warningMessage}</h3>
                        </div>
                    </ErrorModal>
                )}
            </div>
            {get(currentEmail, "newMessage", false) && (
                <div className="my-auto mb-3 mr-3 flex h-9 justify-end rounded-default">
                    <div className="z-20 flex w-fit items-center space-x-2 rounded-default bg-yellow-200 px-3 font-medium">
                        {t("pma.Tiene un nuevo mensaje")}
                        <button className="ml-2 mr-1 font-medium underline" onClick={() => acceptNewEmail()}>
                            {t("pma.Aceptar")}
                        </button>
                        <button className="font-medium underline" onClick={() => ignoreNewEmail()}>
                            {t("pma.Ignorar")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Email;
