import React, { useEffect, useRef, useState } from "react";
import { PmaSidebar } from "@apps/pma/sidebar";
import EmailInbox from "./email-inbox/email-inbox";
import dayjs from "dayjs";
import toString from "lodash/toString";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import get from "lodash/get";
import { JelouApiV1, JelouApiPma } from "@apps/shared/modules";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    addEmail,
    deleteEmail,
    deleteEmailQuerySearch,
    deleteEmailSearchBy,
    getOperatorsPma,
    setActualEmails,
    setActualTray,
    setCurrentEmail,
    setEmails,
    setIsLoadingEmails,
    setNextDraftRoom,
    setNotReadEmails,
    setShowDraft,
    unsetCurrentEmail,
    updateEmail,
} from "@apps/redux/store";
import { useParams } from "react-router-dom";
import qs from "qs";
import { currentSectionPma } from "@apps/shared/constants";
import withSubscription from "./hoc-emails";
import { ChatManagerContext } from "@apps/pma/context";
import OutboundEmailWindow from "./outbound-email/OutboundEmailWindow";
import isEqual from "lodash/isEqual";
import { BlueFlagIcon, FlagIcon, GreenFlagIcon, RedFlagIcon, YellowFlagIcon } from "@apps/shared/icons";
import OpeningAnotherDraftModal from "./modals/OpeningAnotherDraftModal";
import SentConfirmationModal from "./modals/SentConfirmationModal";
import CloseEmailModal from "./modals/CloseEmailModal";
import DiscardEmailModal from "./modals/DiscardEmailModal";
import DraftSavedModal from "./modals/DraftSavedModal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const PmaEmails = (props) => {
    const { showEmail, setShowEmail, getExpiredEmails, getNotReadEmails, getAllEmails, setExpirationEmails } = props;
    // const [sound, setSound] = useState(JSON.parse(localStorage.getItem("activeSound")));
    // const [showModal, setShowModal] = useState(false);
    const userSession = useSelector((state) => state.userSession);
    const emailQuerySearch = useSelector((state) => state.emailQuerySearch);
    const emailSearchBy = useSelector((state) => state.emailSearchBy);
    const bots = useSelector((state) => state.bots);
    const nextDraftRoom = useSelector((state) => state.nextDraftRoom);
    const currentEmail = useSelector((state) => state.currentEmail);
    const showDraft = useSelector((state) => state.showDraft);
    const messages = useSelector((state) => state.messages);
    const actualTray = useSelector((state) => state.actualTray);
    const allOperators = useSelector((state) => state.operators);
    const company = useSelector((state) => state.company);

    const [to, setTo] = useState([]);
    const [cc, setCc] = useState([]);
    const [bcc, setBcc] = useState([]);
    const [from, setFrom] = useState([]);

    const [textMessage, setTextMessage] = useState("");
    const [title, setTitle] = useState("");
    const [assignationType, setAssignationType] = useState("operator");
    const [emailAssignation, setEmailAssignation] = useState("");
    const [chatTags, setChatTags] = useState([]);
    const [createEmailPermission, setCreateEmailPermission] = useState(false);
    const [showSentModal, setShowSentModal] = useState(false);
    const [minimizedOutboundWindow, setMinimizedOutboundWindow] = useState(false);
    const [outboundDueDate, setOutboundDueDate] = useState(null);
    const [openCloseEmailModal, setOpenCloseEmailModal] = useState(false);
    const [openDiscardEmailModal, setOpenDiscardEmailModal] = useState(false);
    const [openSavedDraftModal, setOpenSavedDraftModal] = useState(false);
    const [isFavoriteOutbound, setIsFavoriteOutbound] = useState(false);
    const [expirationDate, setExpirationDate] = useState(null);
    const [savedDate, setSavedDate] = useState(null);
    const [emailNumber, setEmailNumber] = useState(null);
    const [isSavedToday, setIsSavedToday] = useState(null);
    const [emailId, setEmailId] = useState(null);
    const [emailsTeams, setEmailsTeams] = useState([]);
    const [operators, setOperators] = useState([]);
    const [gotEmailOperators, setGotEmailOperators] = useState(false);
    const [saveDraftLoading, setSaveDraftLoading] = useState(false);
    const [loadingDeleteDraft, setLoadingDeleteDraft] = useState(false);
    const [sendIsLoading, setSendIsLoading] = useState(false);
    const [blockCreationTicket, setBlockCreationTicket] = useState(false);
    const [openNextDraftModal, setOpenNextDraftModal] = useState(false);
    const [prevEmailAssignation, setPrevEmailAssignation] = useState(null);
    const [prevEmailBody, setPrevEmailBody] = useState([]);
    const [actualEmailBody, setActualEmailBody] = useState([]);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const emailBodyHasChanged = !isEqual(prevEmailBody, actualEmailBody);
    const [attachments, setAttachments] = useState([]);
    const [showOutboundWindow, setShowOutboundWindow] = useState(false);
    const [allTeams, setAllTeams] = useState([]);
    const [signatures, setSignatures] = useState([]);

    const [defaultSignature, setDefaultSignature] = useState({});

    const findCurrentBot = (botArray) => {
        return botArray.find((bot) => bot.type === "email");
    };

    const bot = findCurrentBot(bots);
    const byTeam = toUpper(get(bot, "properties.signatures.by", "")) === "TEAM";
    const byUser = toUpper(get(bot, "properties.signatures.by", "")) === "USER";

    const permissions = get(userSession, "permissions", []);

    useEffect(() => {
        if (!isEmpty(permissions)) {
            setCreateEmailPermission(permissions.some((permission) => permission.includes("create_email")));
        }
    }, [userSession]);

    useEffect(() => {
        return () => {
            unsetCurrentEmail();
        };
    });

    const [actualPage, setActualPage] = useState(1);
    const [status, setStatus] = useState({});
    const [emailsTags, setEmailsTags] = useState({});
    const [dueDate, setDueDate] = useState({});
    const [priority, setPriority] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);
    const [read, setRead] = useState({});
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingSearchEmail, setLoadingSearchEmail] = useState(false);
    const [cancelToken, setCancelToken] = useState();
    const actualEmails = useSelector((state) => state.actualEmails);

    const { t } = useTranslation();

    const notify = (msg) => {
        toast.success(
            <div className="flex items-center justify-between">
                <div className="flex">
                    <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                            fill="#0CA010"
                        />
                    </svg>
                    <div className="text-15">{t(msg)}</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const dispatch = useDispatch();
    const { section } = useParams();

    const emailAssignationRef = useRef("");

    const botId = get(bot, "id", "");

    const convertStringToArray = (string) => {
        let stringConverted;
        if (string?.includes(",")) {
            const array = string.split(",");
            stringConverted = array;
            return stringConverted;
        }
        if (isEmpty(string)) {
            stringConverted = [];
        } else {
            const toArray = [];
            toArray.push(string);
            stringConverted = [...toArray];
        }

        return stringConverted;
    };

    const parseOperators = (operatorsArray) => {
        const { operatorId, names } = userSession;
        let operators = [];
        operatorsArray.forEach((operator) => {
            if (operator.providerId !== userSession.providerId) {
                operators.push({
                    value: operator.id,
                    name: operator.names,
                });
            }
        });
        operators.push({
            value: operatorId,
            name: `${names} (Yo)`,
        });

        setGotEmailOperators(true);

        return operators;
    };

    const getOperators = async () => {
        const botId = get(bot, "id");
        const companyId = get(company, "id");
        const teams = get(bot, "properties.supportTickets.teams", "");
        if (!botId) {
            return;
        }
        try {
            const { data: response } = await JelouApiPma.get(`/v1/company/${companyId}/teams/operators`, {
                params: {
                    active: 1,
                    teams,
                },
            });
            let data = get(response, "data", []);
            setOperators(parseOperators(data));

            setGotEmailOperators(true);
        } catch (error) {
            console.log("=== ERROR", error);
        }
    };

    useEffect(() => {
        if (!gotEmailOperators && botId) {
            getOperators();
        }
    }, [gotEmailOperators, botId]);

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

    useEffect(() => {
        if (bot) {
            getSignatures();
        }
    }, [bot]);

    const onCreateEmail = () => {
        const meOperator = get(userSession, "operatorId", null);
        const defaultDueDate = dayjs().add(3, "day");
        dispatch(setShowDraft(false));
        setBlockCreationTicket(false);
        setShowOutboundWindow(true);
        setEmailAssignation(meOperator);
        setOutboundDueDate(defaultDueDate);
        configPrevEmailBody({ defaultDueDate, meOperator });
    };

    const getTeams = () => {
        const { id } = company;
        JelouApiV1.get(`/company/${id}/teams`, {
            params: {
                limit: 200,
            },
        })
            .then(({ data }) => {
                const { results } = data;
                let activeTeams = [];
                activeTeams = results.filter((result) => result.state === true);
                setAllTeams(activeTeams);
            })

            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (!isEmpty(userSession)) {
            getTeams();
        }
    }, [userSession]);

    useEffect(() => {
        if (!isEmpty(nextDraftRoom)) {
            setOpenNextDraftModal(true);
        }
    }, [nextDraftRoom]);

    useEffect(() => {
        dispatch(getOperatorsPma());
    }, []);

    useEffect(() => {
        setDraftLoaded(false);

        if (!isEmpty(nextDraftRoom)) {
            return;
        }
        if (currentEmail?.status === "draft" && showDraft) {
            const creationDetailsByDefault = {
                to: [],
                Cc: [],
                Bcc: [],
            };
            const { isFavorite, number, priority, dueAt, _id: emailId, tags, updateAt, title = "", creationDetails = creationDetailsByDefault, assignedTo } = currentEmail;

            const team = get(currentEmail, "team", {});
            if (isEmpty(team)) {
                setAssignationType("operator");
                const operatorAssignatedId = get(assignedTo, "id", {});
                setEmailAssignation(operatorAssignatedId);
            } else {
                setAssignationType("team");
                const teamAssignatedId = get(team, "id", {});
                setEmailAssignation(teamAssignatedId);
            }

            let message = first(sortBy(messages.filter((message) => message.supportTicketId === get(currentEmail, "_id", ""))));
            const { To: toString = [], Cc: ccString = [], Bcc: bccString = [] } = creationDetails;

            const toArray = convertStringToArray(toString);
            const ccArray = convertStringToArray(ccString);
            const bccArray = convertStringToArray(bccString);

            const textBody = get(message, "textBody", "");
            const attachments = get(message, "attachments", []);

            const priorityParsed = first(priorityArray.filter((priorityObj) => priorityObj.value === priority));
            setOutboundDueDate(dueAt);
            setShowOutboundWindow(true);
            setIsFavoriteOutbound(isFavorite);
            setEmailNumber(number);
            setEmailPriority(priorityParsed);
            setEmailId(emailId);
            setChatTags(tags);
            setSavedDate(updateAt);
            setTitle(title);
            setTextMessage(textBody);
            setAttachments(attachments);
            setTo(toArray ? toArray : []);
            setCc(ccArray ? ccArray : []);
            setBcc(bccArray ? bccArray : []);
            setDraftLoaded(true);
        }
    }, [currentEmail, messages, nextDraftRoom]);

    useEffect(() => {
        if (draftLoaded) {
            configPrevEmailBody({ defaultDueDate: outboundDueDate, meOperator: emailAssignation });
        }
    }, [draftLoaded]);

    const viewDrafEmail = () => {
        setOpenSavedDraftModal(false);
    };

    const onCloseEmailModal = () => {
        setOpenCloseEmailModal(false);
    };

    const onConfirmCloseEmailModal = () => {
        handleSaveDraft(true, true);
        setBlockCreationTicket(true);
    };

    const onCloseDiscardEmailModal = () => {
        setOpenDiscardEmailModal(false);
    };
    const onCloseSavedDraftModal = () => {
        setOpenSavedDraftModal(false);
    };

    const onExitSentModal = () => {
        setShowSentModal(false);
        setShowOutboundWindow(false);
        cleanEmailBody();
        // dispatch(deleteEmail(emailId));
        setBlockCreationTicket(true);
    };

    const onExitSavedDrafModal = () => {
        setOpenSavedDraftModal(false);
        setShowOutboundWindow(false);
        cleanEmailBody();
        setBlockCreationTicket(true);
    };

    const onGoBackNextDraftModal = () => {
        setOpenNextDraftModal(false);
    };

    const onConfirmGoNextDraft = async () => {
        try {
            const promise = new Promise((resolve, reject) => {
                const result = updateEmailDraft(true);
                resolve(result);
            });
            await promise.then((response) => {
                dispatch(setCurrentEmail(nextDraftRoom));
                dispatch(setNextDraftRoom({}));
                setOpenNextDraftModal(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const discardEmailDraft = () => {
        setBlockCreationTicket(true);
        if (emailId) {
            discardEmail(emailId);
            cleanEmailBody();
        } else {
            setOpenCloseEmailModal(false);
            setShowOutboundWindow(false);
            setOpenDiscardEmailModal(false);
            cleanEmailBody();
        }
    };

    const saveEmailDraft = (manualDraftSaved = false) => {
        setOpenCloseEmailModal(false);
        setShowOutboundWindow(false);
    };

    useEffect(() => {
        if (isEmpty(actualTray)) {
            dispatch(setActualTray("InAtention"));
        }
    }, [actualTray]);

    const priorityArray = [
        {
            icon: <RedFlagIcon height="1.26rem" width="1.26rem" />,
            name: t("pma.urgent"),
            value: "urgent",
        },

        {
            icon: <YellowFlagIcon height="1.26rem" width="1.26rem" />,
            name: t("pma.high"),
            value: "high",
        },
        {
            icon: <GreenFlagIcon height="1.26rem" width="1.26rem" />,

            name: t("pma.normal"),
            value: "normal",
        },
        {
            icon: <BlueFlagIcon height="1.26rem" width="1.26rem" />,
            name: t("pma.low"),
            value: "low",
        },
        {
            icon: <FlagIcon height="1.26rem" width="1.26rem" className={`fill-current text-gray-400 `} fillOpacity={"1"} />,
            name: t("pma.none"),
            value: "none",
        },
    ];

    const [emailPriority, setEmailPriority] = useState({
        icon: <FlagIcon height="1.26rem" width="1.26rem" className={`fill-current text-gray-400 `} fillOpacity={"1"} />,

        value: "none",
        name: t("pma.none"),
    });

    const configPrevEmailBody = (asyncValues) => {
        const { defaultDueDate, meOperator: emailAssignationByDefault } = asyncValues;
        const formattedDueDate = dayjs(outboundDueDate === null ? defaultDueDate : outboundDueDate).format("DD MM YY");
        const emailBody = {
            to,
            cc,
            bcc,
            title,
            textMessage,
            chatTags,
            emailPriority,
            isFavoriteOutbound,
            ...(!isEmpty(emailAssignation) ? { emailAssignation: emailAssignation } : { emailAssignation: emailAssignationByDefault }),
            formattedDueDate,
        };
        setPrevEmailBody(emailBody);
    };

    useEffect(() => {
        const formattedDueDate = dayjs(outboundDueDate).format("DD MM YY");

        const emailBody = { to, cc, bcc, title, textMessage, chatTags, emailPriority, isFavoriteOutbound, emailAssignation, formattedDueDate };
        setActualEmailBody(emailBody);
    }, [to, cc, bcc, title, textMessage, chatTags, emailAssignation, emailPriority, isFavoriteOutbound, outboundDueDate]);

    const getOperatorObject = (operatorId) => {
        const operatorObject = first(allOperators.filter((operator) => operator.id === operatorId));
        return operatorObject;
    };
    const getTeamObject = (teamId) => {
        const teamObject = first(allTeams.filter((team) => team.id === teamId));
        return teamObject;
    };

    const createEmail = async (manualDraftSaved, send = false) => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        let ticketId;
        const fromCreation = [get(userSession, "email", "")];

        let operatorInfo;
        let teamInfo;
        if (assignationType === "operator") {
            operatorInfo = getOperatorObject(emailAssignation);
        } else {
            teamInfo = getTeamObject(emailAssignation);
        }

        const source = axios.CancelToken.source();
        setCancelToken(source);
        setSaveDraftLoading(true);
        try {
            setCancelToken(source);
            setSaveDraftLoading(true);
            await JelouApiPma.post(`v1/support-tickets?send=${send}`, {
                ...(!isEmpty(title) ? { title: title } : {}),
                isFavorite: isFavoriteOutbound,
                ...(send ? {} : { status: "draft" }),
                priority: emailPriority.value,
                ...(assignationType === "operator" ? { assignedTo: operatorInfo } : { assignedTo: {} }), // Operator Object
                ...(assignationType === "team" ? { team: teamInfo } : { team: {} }), // Team Object
                ...(!isEmpty(chatTags) ? { tags: chatTags } : {}), // Tags array Object
                ...(!isEmpty(outboundDueDate) ? { dueAt: outboundDueDate } : {}),
                ...(!isEmpty(textMessage) ? { content: textMessage } : { content: "" }), // Html o Text, same operator message PMA
                botId,
                ...(!isEmpty(to) ? { To: toString(to) } : {}),
                ...(!isEmpty(cc) ? { Cc: toString(cc) } : {}),
                ...(!isEmpty(bcc) ? { Bcc: toString(bcc) } : {}),
                // clientInfo, // Client object info {name, id, _metadata.... etc}
                ...(!isEmpty(attachments) ? { attachments: attachments } : {}), //  same operator message PMA
            }).then((response) => {
                const { data } = response;
                const { data: responseData } = data;
                const { createdAt, _id, number } = responseData;
                setEmailId(_id);
                ticketId = _id;
                setEmailNumber(number);
                const isTodayTest = dayjs().isSame(createdAt, "day");
                setIsSavedToday(isTodayTest);
                const creationDetailsUpdated = { Cc: cc.toString(), Bcc: bcc.toString(), From: fromCreation.toString(), To: to.toString() };
                const updatedEmailDraft = { ...responseData, creationDetailsUpdated };
                if (actualTray === "draft" && !send) {
                    dispatch(addEmail(updatedEmailDraft));
                }

                setSavedDate(createdAt);
                notify(`${t("pma.ticketWithNumber")} ${number} ${t("pma.successfullyCreated")}`);
            });

            await JelouApiPma.put(`v1/support-tickets/${ticketId}`, {
                creationDetails: { Cc: cc.toString(), Bcc: bcc.toString(), From: fromCreation.toString(), To: to.toString() },
            });

            setSaveDraftLoading(false);
            return true;
        } catch (error) {
            setSaveDraftLoading(false);
            console.log(error);
        }
    };

    const discardEmail = async (emailId) => {
        setLoadingDeleteDraft(true);
        try {
            await JelouApiPma.delete(`v1/support-tickets/${emailId}`, {});
            dispatch(deleteEmail(emailId));
            notify("Borrador eliminado correctamente");
            setShowOutboundWindow(false);
            setOpenDiscardEmailModal(false);
            setOpenCloseEmailModal(false);
            setLoadingDeleteDraft(false);
        } catch (error) {
            setLoadingDeleteDraft(false);
            console.log(error);
        }
    };

    const handleSaveDraft = (manualDraftSaved, closeAll = false) => {
        if (emailNumber === null) {
            createEmail(manualDraftSaved, closeAll);
        } else {
            updateEmailDraft(manualDraftSaved, closeAll);
        }
    };

    useEffect(() => {
        if (!emailId && !isEmpty(userSession) && emailAssignation && !blockCreationTicket) {
            const triggerCreationTicket = title || !isEmpty(to) || !isEmpty(cc) || isFavoriteOutbound || !isEmpty(bcc) || textMessage || emailAssignation !== userSession.operatorId;
            if (triggerCreationTicket && !saveDraftLoading) {
                handleSaveDraft(true);
            }
        }

        // return () => {
        //     cancelCreateEmail();
        // };
    }, [to, cc, bcc, textMessage, emailAssignation, isFavoriteOutbound, priority, title, emailId, userSession]);

    // const cancelCreateEmail = () => {
    //     if (cancelToken) {
    //         cancelToken.cancel("Operation canceled by the user.");
    //     }
    // };

    useEffect(() => {
        let interval;
        if (emailId && emailBodyHasChanged) {
            interval = setInterval(async () => {
                await updateEmailDraft();
            }, 10 * 6000);
        }

        return () => clearInterval(interval);
    }, [emailId, emailBodyHasChanged]);

    const sendEmail = async () => {
        if (isEmpty(to) || !title || !emailAssignation || !textMessage) {
            alert("Campos requeridos vacios");
            return;
        }
        let operatorInfo;
        let teamInfo;
        if (assignationType === "operator") {
            operatorInfo = getOperatorObject(emailAssignation);
        } else {
            teamInfo = getTeamObject(emailAssignation);
        }

        handleSaveDraft(false);

        try {
            setSendIsLoading(true);
            // if (showDraft) {
            await JelouApiPma.put(`v1/support-tickets/${emailId}?send=true`, {
                ...(!isEmpty(title) ? { title: title } : {}),
                isFavorite: isFavoriteOutbound,
                priority: emailPriority.value,
                ...(assignationType === "operator" ? { assignedTo: operatorInfo } : { assignedTo: {} }), // Operator Object
                ...(assignationType === "team" ? { team: teamInfo } : { team: {} }), // Team Object
                ...(!isEmpty(chatTags) ? { tags: chatTags } : {}), // Tags array Object
                ...(!isEmpty(outboundDueDate) ? { dueAt: outboundDueDate } : {}),
                ...(!isEmpty(textMessage) ? { content: textMessage } : {}), // Html o Text, same operator message PMA
                botId,
                ...(!isEmpty(to) ? { to: toString(to) } : {}),
                ...(!isEmpty(cc) ? { cc: toString(cc) } : {}),
                ...(!isEmpty(bcc) ? { bcc: toString(bcc) } : {}),
                // clientInfo, // Client object info {name, id, _metadata.... etc}
                ...(!isEmpty(attachments) ? { attachments: attachments } : {}), //  same operator message PMA
            }).then((response) => {
                const { data } = response;
                const { data: responseData } = data;
                const { _id } = responseData;
                JelouApiPma.put(`v1/support-tickets/${_id}`, {
                    creationDetails: { Cc: cc.toString(), Bcc: bcc.toString(), From: to.toString(), To: to.toString() },
                });
                if (actualTray === "draft") {
                    dispatch(deleteEmail(_id));
                }
                if (actualTray === "sentByOperator") {
                    dispatch(addEmail(responseData));
                    if (operatorInfo.id === userSession.operatorId) {
                        dispatch(setActualEmails(actualEmails + 1));
                        dispatch(setNotReadEmails({ operation: "add", value: 1 }));
                    }
                }
            });
            setSendIsLoading(false);

            setShowSentModal(true);
        } catch (error) {
            setSendIsLoading(false);
            console.log(error);
        }
    };

    const cleanEmailBody = () => {
        setEmailId(null);
        setIsFavoriteOutbound(false);
        setAssignationType("operator");
        setEmailAssignation({});
        setAttachments([]);
        setTitle("");
        setTo([]);
        setCc([]);
        setBcc([]);
        setOutboundDueDate(null);
        setMinimizedOutboundWindow(false);
        setEmailPriority({
            icon: <FlagIcon height="1.26rem" width="1.26rem" className={`fill-current text-gray-400 `} fillOpacity={"1"} />,

            value: "none",
            name: t("pma.none"),
        });
        setChatTags([]);
        setEmailNumber(null);
        setSavedDate(null);
        setGotEmailOperators(false);
        setTextMessage("");
        dispatch(setShowDraft(false));
        dispatch(unsetCurrentEmail());
        setDraftLoaded(false);
    };

    useEffect(() => {
        if (toUpper(section) === currentSectionPma.EMAILS) {
            getExpiredEmails();
            getNotReadEmails();
            getAllEmails();
        }
    }, [section]);

    const sendAssignedTo = () => {
        return assignationType === "operator" && emailAssignationRef.current !== emailAssignation;
    };

    const updateEmailDraft = async (manualDraftSaved, closeAll = false) => {
        let operatorInfo;
        const fromCreation = [get(userSession, "email", "")];

        let teamInfo;
        if (assignationType === "operator") {
            operatorInfo = getOperatorObject(emailAssignation);
        } else {
            teamInfo = getTeamObject(emailAssignation);
        }
        setSaveDraftLoading(true);
        try {
            await JelouApiPma.put(`v1/support-tickets/${emailId}?send=false`, {
                ...(!isEmpty(title) ? { title: title } : {}),
                isFavorite: isFavoriteOutbound,
                priority: emailPriority.value,
                status: "draft",
                ...(sendAssignedTo() ? { assignedTo: operatorInfo } : {}), // Operator Object
                ...(assignationType === "team" ? { team: teamInfo } : { team: {} }), // Team Object
                tags: chatTags, // Tags array Object
                ...(!isEmpty(outboundDueDate) ? { dueAt: outboundDueDate } : {}),
                ...(!isEmpty(textMessage) ? { content: textMessage } : {}), // Html o Text, same operator message PMA
                ...(!isEmpty(to) ? { to: toString(to) } : {}),
                ...(!isEmpty(cc) ? { cc: toString(cc) } : {}),
                ...(!isEmpty(bcc) ? { bcc: toString(bcc) } : {}),
                // clientInfo, // Client object info {name, id, _metadata.... etc}
                ...(!isEmpty(attachments) ? { attachments: attachments } : {}), //  same operator message PMA
            }).then((response) => {
                const { data } = response;
                const { data: responseData } = data;
                const { updatedAt } = responseData;
                const creationDetailsUpdated = { Cc: cc.toString(), Bcc: bcc.toString(), From: fromCreation.toString(), To: to.toString() };
                const isTodayTest = dayjs().isSame(updatedAt, "day");
                setIsSavedToday(isTodayTest);
                setSavedDate(updatedAt);
                configPrevEmailBody({ defaultDueDate: outboundDueDate, meOperator: emailAssignation });
                dispatch(updateEmail({ ...responseData, creationDetails: creationDetailsUpdated, tags: chatTags }));
                if (emailAssignationRef.current !== emailAssignation) {
                    emailAssignationRef.current = emailAssignation;
                }
            });

            await JelouApiPma.put(`v1/support-tickets/${emailId}`, {
                creationDetails: { Cc: cc.toString(), Bcc: bcc.toString(), From: fromCreation.toString(), To: to.toString() },
            });

            setSaveDraftLoading(false);
        } catch (error) {
            console.log(error);
            setSaveDraftLoading(false);
        }

        if (manualDraftSaved) {
            setOpenSavedDraftModal(true);
        }
        if (manualDraftSaved && closeAll) {
            setOpenCloseEmailModal(false);
            saveEmailDraft();
            cleanEmailBody();
            setOpenSavedDraftModal(true);
        }
    };

    const cleanFilters = () => {
        setActualPage(1);
        setStatus({});
        setEmailsTags({});
        setDueDate({});
        setPriority({});
        setIsFavorite({});
        setRead({});
        dispatch(deleteEmailQuerySearch());
        dispatch(deleteEmailSearchBy());
    };

    useEffect(() => {
        if (section !== "emails") {
            dispatch(deleteEmailQuerySearch());
            dispatch(deleteEmailSearchBy());
        }
    }, [section]);

    const getEmails = async () => {
        try {
            if (!isEmpty(cancelToken)) {
                await cancelToken.cancel("Operation canceled due to new request.");
            }
            if (emailQuerySearch) {
                setLoadingSearchEmail(true);
            }
            dispatch(setIsLoadingEmails(true));
            const viewSentByOperator = toLower(actualTray) === toLower("sentByOperator");
            const source = axios.CancelToken.source();
            setCancelToken(source);
            const searchBy = emailSearchBy.searchBy ? emailSearchBy.searchBy : "text";
            const { data } = await JelouApiV1.get(`/support-tickets`, {
                params: {
                    sort: "DESC",
                    limit: 50,
                    page: actualPage,
                    ...(status ? { status: status } : {}),
                    ...(viewSentByOperator ? { createdBy: userSession.operatorId } : {}),
                    ...(actualTray === "sentByOperator" ? {} : { operatorId: userSession.operatorId }),
                    ...(emailsTags ? { tags: [emailsTags] } : {}),
                    ...(dueDate ? { dueDate: { lte: dueDate } } : {}),
                    ...(priority ? { priority: priority } : {}),
                    ...(isFavorite ? { isFavorite: isFavorite } : {}),
                    ...(read ? { read: read } : {}),
                    ...(status !== "closed" ? { onlyInbound: true } : {}),
                    ...(emailQuerySearch ? { search: emailQuerySearch } : {}),
                    ...(emailSearchBy && emailQuerySearch ? { searchBy } : emailQuerySearch ? { searchBy: "number,title" } : {}),
                    // operatorId: userSession.operatorId,
                },
                cancelToken: source.token,
                paramsSerializer: function (params) {
                    return qs.stringify(params);
                },
            });
            setLoadingSearchEmail(false);
            dispatch(setIsLoadingEmails(false));
            setTotalPages(get(data, "pagination.totalPages", 0));
            setTotal(get(data, "pagination.total", 0));
            dispatch(setEmails(get(data, "results", []), section));
        } catch (error) {
            setLoadingSearchEmail(false);
            dispatch(setIsLoadingEmails(false));

            console.log(error);
        }
    };

    return (
        <div className="flex flex-1 flex-col overflow-y-hidden p-0 mid:pt-4">
            <div className="flex w-full flex-1 overflow-x-hidden">
                <PmaSidebar
                    createEmailPermission={createEmailPermission}
                    onCreateEmail={onCreateEmail}
                    getEmails={getEmails}
                    showEmail={showEmail}
                    setShowEmail={setShowEmail}
                    total={total}
                    totalPages={totalPages}
                    actualPage={actualPage}
                    setActualPage={setActualPage}
                    status={status}
                    setStatus={setStatus}
                    ticketTags={emailsTags}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    priority={priority}
                    setPriority={setPriority}
                    isFavorite={isFavorite}
                    setIsFavorite={setIsFavorite}
                    read={read}
                    setRead={setRead}
                    loadingSearchEmail={loadingSearchEmail}
                    getExpiredEmails={getExpiredEmails}
                    getNotReadEmails={getNotReadEmails}
                    getAllEmails={getAllEmails}
                    cleanFilters={cleanFilters}
                    setTotal={setTotal}
                    setExpirationEmails={setExpirationEmails}
                    setTotalPages={setTotalPages}
                    user={userSession}
                    setEmailsTags={setEmailsTags}
                />
                <EmailInbox
                    getEmails={getEmails}
                    showEmail={showEmail}
                    setShowEmail={setShowEmail}
                    total={total}
                    from={from}
                    setFrom={setFrom}
                    totalPages={totalPages}
                    actualPage={actualPage}
                    setActualPage={setActualPage}
                    status={status}
                    loadingSearchEmail={loadingSearchEmail}
                    getExpiredEmails={getExpiredEmails}
                    getNotReadEmails={getNotReadEmails}
                    getAllEmails={getAllEmails}
                />
            </div>
            {showOutboundWindow && (
                <OutboundEmailWindow
                    defaultSignature={defaultSignature}
                    emailAssignationRef={emailAssignationRef}
                    setDefaultSignature={setDefaultSignature}
                    allOperators={allOperators}
                    signatures={signatures}
                    setSignatures={setSignatures}
                    allTeams={allTeams}
                    emailBodyHasChanged={emailBodyHasChanged}
                    prevEmailAssignation={prevEmailAssignation}
                    setPrevEmailAssignation={setPrevEmailAssignation}
                    sendIsLoading={sendIsLoading}
                    teamsAssigantion={emailsTeams}
                    setEmailsTeams={setEmailsTeams}
                    emailsTeams={emailsTeams}
                    outboundLoading={saveDraftLoading}
                    sendEmail={sendEmail}
                    cleanEmailBody={cleanEmailBody}
                    gotEmailOperators={gotEmailOperators}
                    setGotEmailOperators={setGotEmailOperators}
                    operators={operators}
                    setOperators={setOperators}
                    emailNumber={emailNumber}
                    handleSaveDraft={handleSaveDraft}
                    isSavedToday={isSavedToday}
                    savedDate={savedDate}
                    to={to}
                    cc={cc}
                    bcc={bcc}
                    assignationType={assignationType}
                    textMessage={textMessage}
                    emailAssignation={emailAssignation}
                    setIsFavoriteOutbound={setIsFavoriteOutbound}
                    isFavoriteOutbound={isFavoriteOutbound}
                    emailPriority={emailPriority}
                    attachments={attachments}
                    outboundDueDate={outboundDueDate}
                    setBlockCreationTicket={setBlockCreationTicket}
                    setAttachments={setAttachments}
                    setOutboundDueDate={setOutboundDueDate}
                    setChatTags={setChatTags}
                    priorityArray={priorityArray}
                    setExpirationDate={setExpirationDate}
                    expirationDate={expirationDate}
                    setEmailPriority={setEmailPriority}
                    chatTags={chatTags}
                    setOpenSavedDraftModal={setOpenSavedDraftModal}
                    setOpenDiscardEmailModal={setOpenDiscardEmailModal}
                    setOpenCloseEmailModal={setOpenCloseEmailModal}
                    bot={bot}
                    showOutboundWindow={showOutboundWindow}
                    setShowOutboundWindow={setShowOutboundWindow}
                    setEmailAssignation={setEmailAssignation}
                    setTo={setTo}
                    setCc={setCc}
                    setBcc={setBcc}
                    title={title}
                    setTitle={setTitle}
                    setAssignationType={setAssignationType}
                    setTextMessage={setTextMessage}
                    minimizedOutboundWindow={minimizedOutboundWindow}
                    setMinimizedOutboundWindow={setMinimizedOutboundWindow}
                />
            )}
            {openNextDraftModal && <OpeningAnotherDraftModal isLoading={saveDraftLoading} onClose={onGoBackNextDraftModal} onConfirm={onConfirmGoNextDraft} />}
            {showSentModal && <SentConfirmationModal t={t} onExit={onExitSentModal} onClose={onExitSentModal} emailNumber={emailNumber} />}
            {openCloseEmailModal && (
                <CloseEmailModal
                    t={t}
                    onDiscard={discardEmailDraft}
                    onSave={onConfirmCloseEmailModal}
                    onClose={onCloseEmailModal}
                    isLoadingDiscard={loadingDeleteDraft}
                    saveIsLoading={saveDraftLoading}
                />
            )}
            {openDiscardEmailModal && <DiscardEmailModal t={t} isLoading={loadingDeleteDraft} onConfirm={discardEmailDraft} onClose={onCloseDiscardEmailModal} />}
            {openSavedDraftModal && <DraftSavedModal t={t} onClose={onCloseSavedDraftModal} onConfirm={viewDrafEmail} onExit={onExitSavedDrafModal} />}
        </div>
    );
};

const EmailsWithSubscription = withSubscription(PmaEmails, ChatManagerContext);

export default EmailsWithSubscription;
// export default PmaEmails;
