/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from "dayjs";
import get from "lodash/get";
import Tippy from "@tippyjs/react";
import { v4 as uuidv4 } from "uuid";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import has from "lodash/has";
import omit from "lodash/omit";

import { toast } from "react-toastify";
import isObject from "lodash/isObject";
import * as Sentry from "@sentry/react";
import { BeatLoader } from "react-spinners";
import { useTranslation, withTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RoomAvatar, Source } from "@apps/shared/common";
import LeaveRoom from "../leave-room/leave-room";
import SwitchOperator from "../switch-operator/switch-operator";
import AudioCallOption from "../call-options/audio-call-option";
import VideoCallOption from "../call-options/video-call-option";
import { JelouApiV1 } from "@apps/shared/modules";
import { DownloadFile } from "@apps/pma/service";
import { deleteRoom, addMessage, showMobileChat, unsetCurrentRoom, setShowDisconnectedModal } from "@apps/redux/store";
import { CloseIcon, ArrowIcon, ForwardIcon, DownloadIcon4, MoreOptionsIcon, MobileOptionsIcon, ManagedIcon, NotManagedIcon } from "@apps/shared/icons";
import { ORIGINS_ROOMS_ICONS } from "@apps/shared/constants";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";

const RoomHeader = (props) => {
    const { hasSidebarSettingsEnabled, mobileMenu, openInfo, setMobileMenu, flows, usersId, currentRoom, sidebarChanged, verifyStatus, setVerifyStatus, company, setShowConversationSidebarMobile } =
        props;
    const { t } = useTranslation();
    const userSession = useSelector((state) => state.userSession);
    const statusOperator = useSelector((state) => state.statusOperator);
    const storedParams = useSelector((state) => state.storedParams);
    const bots = useSelector((state) => state.bots);
    const metadata = get(currentRoom, "metadata", {});
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(null);
    const [selectLoading, setSelectLoading] = useState(false);
    const [switchLoading, setSwitchLoading] = useState(false);
    const [tempOperator, setTempOperator] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [success] = useState(false);
    const [openCallOptions, setOpenCallOptions] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isEmpty(operators)) {
            getOperators();
        }
        //pedir tags de user
        if (!isEmpty(currentRoom) && !isEmpty(currentRoom.conversation)) {
            let currentChatTags = currentRoom.tags;
            if (!isEmpty(currentChatTags)) {
                if (typeof currentChatTags === "string") {
                    currentChatTags = currentChatTags
                        .slice(1, -1)
                        .trim()
                        .split(",")
                        .map((id) => {
                            return parseInt(id);
                        });
                } else {
                    currentChatTags = currentChatTags.map((tagObj) => {
                        return parseInt(tagObj.id);
                    });
                }
            }
        }
    }, [currentRoom]);

    useEffect(() => {
        setVerifyStatus(true);
    }, []);

    async function downloadChat() {
        setLoading(true);
        const { id, appId } = currentRoom;
        const response = await JelouApiV1.get(`/bots/${appId}/conversations/${id}/download`, {
            responseType: "blob",
        });
        setLoading(false);
        return DownloadFile(response);
    }

    function onLeaveRoom() {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        setShowLeaveModal(true);
    }

    const closeLeaveModal = () => {
        setShowLeaveModal(false);
    };

    function leaveRoom(onClose, flowId = null, motive = null) {
        try {
            setLeaving(true);
            const { id, senderId } = currentRoom;
            const bot = findCurrentBot(bots);
            let userId = senderId.toString();
            userId = userId.replace("+", "");

            JelouApiV1.post(`/conversations/${bot.id}/close`, {
                operatorId: userSession.providerId,
                userId,
                ...(motive ? { dynamicEventId: motive.id } : {}),
            })
                .catch((err) => {
                    setLeaving(false);
                    console.error("err", err);
                })
                .then(async () => {
                    // Remove room and messages
                    dispatch(deleteRoom(id));

                    // Set user to flow if flowId is not null
                    const onLeaveFlowId = get(bot, "properties.onLeaveFlowId", null);
                    if (flowId) {
                        await JelouApiV1.post(`/bots/${currentRoom.appId}/users/${senderId}/flow/${flowId}`);
                    }

                    if (onLeaveFlowId && !flowId) {
                        try {
                            const ttl = get(bot, "properties.onLeaveFlowIdTtl", 3600);
                            await JelouApiV1.post(`/company/${company.id}/store`, {
                                key: `${bot.id}:user:${userId}:flow_id`,
                                value: `${onLeaveFlowId}`,
                                ttl,
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    setLeaving(false);
                    onClose();
                });

            setUserCache();
        } catch (err) {
            setLeaving(false);
            console.log("err on close conversation", err);
        }
    }

    const setUserCache = () => {
        const { senderId: userId, appId: botId } = currentRoom;
        const { operatorId } = userSession;
        JelouApiV1.post(`/bots/${botId}/users/${userId}/cache`, {
            params: {
                isBroadcastUser: false,
                operatorId,
            },
        }).catch((err) => {
            console.error("==err", err);
        });
    };

    const findCurrentBot = (botArray) => {
        const botId = get(currentRoom, "bot.id", null);
        return botArray.find((bot) => bot.id === botId);
    };

    const bot = findCurrentBot(bots);

    const getName = () => {
        const data = { ...storedParams };
        if (isEmpty(data.name)) {
            delete data.name;
        }

        let name = get(data, "fullName", get(data, "name", get(currentRoom, "name", "")));
        name = !isEmpty(name) && name.trim();
        if (isEmpty(name)) {
            name = currentRoom.metadata?.names;
            name = !isEmpty(name) && name.trim();
        }

        if (isEmpty(name)) {
            name = t("pma.Desconocido");
        }

        return name;
    };

    const getLegalId = () => {
        let legalId = storedParams.legalId ? storedParams.legalId : get(usersId, "legalId", "");
        return legalId;
    };

    const { source, senderId, _id = "" } = currentRoom;

    const hasPlugin = get(bot, "properties.operatorView.plugin");
    const names = getName();
    const legalId = getLegalId();
    const showSender = toUpper(source) === "WAVY" || toUpper(source) === "SMOOCH" || toUpper(source) === "WHATSAPP" || toUpper(source) === "VENOM" || toUpper(source) === "GUPSHUP";
    const companyPermission = company.id === 35 ? true : false;
    const userTeams = useSelector((state) => state.userTeams);
    const isGEACabinaTeam = userTeams?.some((team) => team?.id === 603);
    const sidebarValidations = hasSidebarSettingsEnabled || hasPlugin ? sidebarChanged && verifyStatus : true;
    let activeBtn = companyPermission ? companyPermission : sidebarValidations;

    activeBtn = isGEACabinaTeam
        ? isGEACabinaTeam
        : has(company, "properties.operatorView.forceClose")
        ? get(company, "properties.operatorView.forceClose", activeBtn)
        : companyPermission
        ? companyPermission
        : sidebarValidations;

    const getAll = get(bot, "properties.operatorView.getAllOperators") ? get(bot, "properties.operatorView.getAllOperators") : get(company, "properties.operatorView.getAllOperators", false);
    const getAllTeams = get(bot, "properties.operatorView.byAllTeams") ? get(bot, "properties.operatorView.byAllTeams") : get(company, "properties.operatorView.byAllTeams", false);

    /**
        property for transfer to only my team
    */
    const getAllMyTeams = get(bot, "properties.operatorView.transferMyTeams", false);

    const getTeamIds = () => {
        const TeamScopes = get(userSession, "TeamScopes", []);
        return TeamScopes.map((scope) => scope.teamId);
    };

    function getOperators() {
        let teams = getTeamIds();
        const { appId } = currentRoom;
        const byScope = get(bot, "properties.operatorView.hasTeamAssignationScope")
            ? get(bot, "properties.operatorView.hasTeamAssignationScope")
            : get(company, "properties.operatorView.hasTeamAssignationScope", false);
        if (!appId) {
            return;
        }
        setSelectLoading(true);
        setLoadingOptions(true);
        JelouApiV1.get(`/operators`, {
            params: {
                active: 1,
                ...(!getAll ? { status: "online" } : {}),
                ...(byScope && !isEmpty(teams) ? { teams: [teams] } : {}),
            },
        })
            .then((res) => {
                if (res.data === "Servicio no disponible") {
                    return;
                }

                const data = parseOperators(res.data);
                setSelectLoading(false);
                setOperators(data);
                setLoadingOptions(false);
            })
            .catch((err) => {
                console.log("=== ERROR", err);
                setLoadingOptions(false);
                setSelectLoading(false);
            });
    }

    function parseOperators(operatorsArray) {
        let operators = [];
        let operatorTeam = "";
        operatorsArray.forEach((operator) => {
            if (!isEmpty(operator.team)) {
                operatorTeam = ` - ${operator.team}`;
            } else {
                operatorTeam = "";
            }
            if (operator.providerId !== userSession.providerId) {
                operators.push({
                    value: `${operator.providerId}`,
                    label: `${operator.names}${operatorTeam}`,
                    companyId: operator.companyId,
                });
            }
        });
        return operators;
    }

    function handlechange(option) {
        setTempOperator(option);
    }

    function submitChange() {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        const { senderId, appId } = currentRoom;
        const { value, label } = tempOperator;
        const payload = {
            userId: senderId,
            ...(byTeam || getAllTeams ? { teamId: value } : { operatorId: value }),
        };
        setSwitchLoading(true);

        JelouApiV1.post(`/conversations/${appId}/transfer`, payload)
            .then((res) => {
                const { data } = res;
                const type = get(data, "data.type", "");
                if (type === "OPERATOR_NOT_FOUND") {
                    toast.error(`No se pudo encontrar operadores en el equipo de ${label}`, {
                        autoClose: true,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                } else {
                    setShowModal(false);
                    dispatch(showMobileChat());
                }
                setSwitchLoading(false);
                setOperators([]);
                setTempOperator(null);
            })
            .catch((err) => {
                console.error("ERROR", err);
                setSwitchLoading(false);
                setOperators([]);
                setTempOperator(null);
            });
    }

    const closeModal = () => {
        setShowModal(false);
        setTempOperator(null);
    };

    const getCallShortId = async () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        setLoadingAudio(true);
        JelouApiV1.get(`companies/${company.id}/videocalls/link`, {
            params: {
                operatorId: userSession.operatorId,
                clientId: currentRoom.senderId,
                roomId: currentRoom.id,
                type: "call",
            },
        })
            .then((result) => {
                const callUrl = get(result, "data.data.url", "");
                if (isEmpty(callUrl)) throw new Error("call url not received");

                setLoadingAudio(false);
                sendCallUrl(callUrl);
            })
            .catch((error) => {
                setLoadingAudio(false);
                console.error(`Error: ${error}`);
                Sentry.configureScope((scope) => {
                    const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                    scope.setExtra("errorResponse", data);
                });

                Sentry.captureException(new Error(`( Room: Video Call Url ) Get Url Failed With: ${error.message}`));
            });
    };

    const getVideoCallShortId = async () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        setLoadingVideo(true);
        JelouApiV1.get(`companies/${company.id}/videocalls/link`, {
            params: {
                operatorId: userSession.operatorId,
                clientId: currentRoom.senderId,
                roomId: currentRoom.id,
                type: "videocall",
            },
        })
            .then((result) => {
                const callUrl = get(result, "data.data.url", "");
                if (isEmpty(callUrl)) throw new Error("videocall url not received");
                sendCallUrl(callUrl, true);
                setLoadingVideo(false);
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                setLoadingVideo(false);
                Sentry.configureScope((scope) => {
                    const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                    scope.setExtra("errorResponse", data);
                });

                Sentry.captureException(new Error(`( Room: Video Call Url ) Get Url Failed With: ${error.message}`));
            });
    };

    const sendCallUrl = (callUrl, isVideo = false) => {
        const { appId, source, senderId } = props.currentRoom;
        const messageData = {
            appId,
            senderId,
            by: "operator",
            source: source,
            roomId: currentRoom.id,
            message: {
                type: "TEXT",
                text: `Por favor ingresa al siguiente link para ${isVideo ? `hacer videollamada` : `hablar`} con un operador ${callUrl}`,
            },
            createdAt: dayjs().valueOf(),
        };

        //SEND MESSAGE
        const formMessage = {
            ...messageData,
            botId: appId,
            userId: senderId,
            bubble: {
                type: "TEXT",
                text: `Por favor ingresa al siguiente link para ${isVideo ? `hacer videollamada` : `hablar`} con un operador ${callUrl}`,
            },
            id: uuidv4(),
        };

        // Add message to Redux
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
            console.error("Error on send message", error.response);

            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Room: Call Url ) Send Message Failed With: ${error.message}`));
        });
    };

    const type = get(bot, "type", false);

    const canSwitch = get(bot, "properties.operatorView.canSwitch") ? get(bot, "properties.operatorView.canSwitch") : get(company, "properties.operatorView.canSwitch", true);

    const byTeam = get(bot, "properties.operatorView.byTeam") ? get(bot, "properties.operatorView.byTeam") : get(company, "properties.operatorView.byTeam", false);

    const byScopes = get(bot, "properties.operatorView.hasTeamAssignationScope")
        ? get(bot, "properties.operatorView.hasTeamAssignationScope")
        : get(company, "properties.operatorView.hasTeamAssignationScope", false);

    const hasCallsEnabled = get(bot, "properties.operatorView.enableCalls")
        ? get(bot, "properties.operatorView.enableCalls") && toUpper(type) !== "FACEBOOK_FEED"
        : get(company, "properties.operatorView.enableCalls", false) && toUpper(type) !== "FACEBOOK_FEED";

    const hasVideocallsEnabled = get(bot, "properties.operatorView.enableVideoCalls")
        ? get(bot, "properties.operatorView.enableVideoCalls") && toUpper(type) !== "FACEBOOK_FEED"
        : get(company, "properties.operatorView.enableVideoCalls", false) && toUpper(type) !== "FACEBOOK_FEED";

    const placeholder = byTeam || getAllTeams || getAllMyTeams ? t("pma.Seleccionar equipo") : t("pma.Seleccionar operador");

    const noOptionsMessage = () => {
        if (byTeam || getAllTeams || getAllMyTeams) {
            return t("pma.No se encontró equipo");
        } else {
            return t("pma.No se encontró operador");
        }
    };

    const { wasReplied, origin } = currentRoom?.conversation || {};
    const { color: originColor, bg: bgOrigin, Icon: OrginIcon = null } = ORIGINS_ROOMS_ICONS[origin] ?? {};

    const { RepliedIcon, replieColor, replieTippyLabel, replieBg } = wasReplied
        ? { RepliedIcon: ManagedIcon, replieColor: "#209F8B", replieBg: "#E9F5F3", replieTippyLabel: t("origin.managed") }
        : { RepliedIcon: NotManagedIcon, replieColor: "#C1272D", replieBg: "#FDEFED", replieTippyLabel: t("origin.unmanaged") };

    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    const isMobile = isMobileApp.iOSApp() || isMobileApp.AndroidApp();

    return (
        <div className="border-tp border-btm fixed top-[2.75rem] z-10 flex w-full flex-col items-center bg-white sm:relative sm:z-50 sm:items-stretch md:top-0 md:z-50 mid:z-10 mid:flex-col mid:border-t-transparent">
            <div className="z-10 flex w-full flex-row items-center bg-white px-4 py-3 sm:relative sm:z-50 sm:items-stretch md:top-0 md:z-50 mid:z-10 mid:flex-col mid:border-t-transparent">
                <div className="flex flex-row items-center">
                    <div className={`flex flex-col ${source && toUpper(type) !== "TWITTER" && "sm:pr-2"}`}>
                        <div className="flex items-center">
                            <div
                                className="flex mid:hidden"
                                onClick={() => {
                                    dispatch(unsetCurrentRoom());
                                    dispatch(showMobileChat());
                                    setMobileMenu(false);
                                }}
                            >
                                <ArrowIcon className="mr-2 flex fill-current text-primary-200 mid:hidden" width="1.25rem" height="0.938rem" />
                            </div>
                            <div className="flex">
                                <RoomAvatar src={get(currentRoom, "metadata.profilePicture") || get(currentRoom, "avatarUrl")} name={names} type={type} />
                            </div>
                            <div className="flex flex-col">
                                <span className={`leading-normal ${names.length > 35 && "w-64 truncate xxl:w-72"} text-13 font-bold text-gray-400 sm:text-sm 2xl:text-15`}>{names}</span>
                                <div className="block gap-4 xxl:flex">
                                    <div className="flex items-center justify-start">
                                        {currentRoom.metadata?.names && !(isMobileApp.iOSApp() || isMobileApp.AndroidApp()) && (
                                            <p className="overflow-hidden truncate pr-2 font-medium text-gray-400 sm:text-xs 2xl:text-13">{currentRoom.metadata?.names}</p>
                                        )}
                                        {source && toUpper(type) !== "TWITTER" && (
                                            <div className="hidden md:flex">
                                                <div className="hidden md:flex">
                                                    <div className="flex items-center justify-center text-base font-medium text-gray-400">
                                                        {showSender && (
                                                            <span className="border-lft px-2 font-medium sm:text-xs 2xl:text-13">
                                                                {`${senderId.replace("@c.us", "")}` || `${_id.replace("@c.us", "")}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {toUpper(source) === "FACEBOOK_FEED" && (
                                                    <div className="ml-3 hidden md:flex">
                                                        <span className="inline-flex items-center rounded-md bg-purple-200 px-2.5 py-0.5 text-sm font-medium text-purple-800">{t("pma.Público")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {toUpper(type) === "TWITTER" && (
                                            <div className={`border-lft flex text-xs font-light text-gray-400 ${(legalId || currentRoom.metadata?.names) && "px-2"}`}>
                                                <a
                                                    href={`https://twitter.com/${currentRoom.metadata?.username}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center hover:text-primary-200 hover:underline"
                                                >
                                                    {`@${currentRoom.metadata?.username}`}{" "}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1" width="0.875rem" height="0.875rem" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                        {toUpper(type) === "INSTAGRAM" && (
                                            <div className={`flex text-xs font-light text-gray-450 ${legalId && "pr-2"}`}>
                                                <a
                                                    href={`https://instagram.com/${get(metadata, "username", "")}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center hover:text-primary-200 hover:underline"
                                                >
                                                    {`@${get(metadata, "username", "")}`}{" "}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1" width="0.875rem" height="0.875rem" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                        {legalId && (
                                            <div className="hidden md:flex">
                                                <p
                                                    className={`overflow-hidden truncate ${
                                                        (currentRoom.metadata?.names || toUpper(type) === "TWITTER" || toUpper(type) === "INSTAGRAM") && "border-lft pl-2"
                                                    } w-30 font-medium text-gray-400 sm:text-xs 2xl:text-13`}
                                                >{`C.I. ${legalId}`}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {OrginIcon && (
                                            <Tippy
                                                arrow={false}
                                                placement="top"
                                                theme="badgeChat"
                                                visible={!isMobile}
                                                content={
                                                    <p
                                                        style={{ color: originColor, borderColor: originColor }}
                                                        className="flex items-center gap-2 rounded-10 border-1.5 bg-white p-2 font-medium mid:hidden"
                                                    >
                                                        <span className="text-grey-300">{t("origin.origin")}:</span> <OrginIcon width={15} height={15} /> {t(`origin.${origin}`)}
                                                    </p>
                                                }
                                            >
                                                <p
                                                    style={{ backgroundColor: bgOrigin, color: originColor }}
                                                    className="flex items-center gap-2 whitespace-nowrap rounded-xs px-2 py-0.5 text-xs font-medium"
                                                >
                                                    <OrginIcon width={13} height={13} /> <span className="hidden md:flex">{t(`origin.${origin}`)}</span>
                                                </p>
                                            </Tippy>
                                        )}
                                        {RepliedIcon && (
                                            <Tippy
                                                arrow={false}
                                                placement="top"
                                                theme="badgeChat"
                                                visible={!isMobile}
                                                content={
                                                    <p
                                                        style={{ color: replieColor, borderColor: replieColor }}
                                                        className="flex items-center gap-2 rounded-10 border-1.5 bg-white p-2 font-medium mid:hidden"
                                                    >
                                                        <RepliedIcon width={15} height={15} />
                                                        {replieTippyLabel}
                                                    </p>
                                                }
                                            >
                                                <p
                                                    style={{ backgroundColor: replieBg, color: replieColor }}
                                                    className="flex items-center gap-2 whitespace-nowrap rounded-xs px-2 py-0.5 text-xs font-medium"
                                                >
                                                    <RepliedIcon width={13} height={13} /> <span className="hidden md:flex">{replieTippyLabel}</span>
                                                </p>
                                            </Tippy>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {source && toUpper(type) !== "TWITTER" && (
                        <div className="hidden md:flex">
                            {toUpper(source) === "FACEBOOK_FEED" && (
                                <div className="ml-3 hidden md:flex">
                                    <span className="inline-flex items-center rounded-md bg-purple-200 px-2.5 py-0.5 text-sm font-medium text-purple-800">{t("pma.Público")}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="hidden flex-1 justify-end md:ml-2 mid:flex xxl:ml-0">
                        {hasCallsEnabled && (
                            <Tippy theme="jelou" content={t("pma.Llamar")} placement={"bottom"}>
                                {loadingAudio ? (
                                    <span className="border-normal flex h-10 w-10 cursor-not-allowed items-center pl-2 md:h-10 2xl:mt-1">
                                        <BeatLoader color={"#00B3C7"} size={"0.25rem"} />
                                    </span>
                                ) : (
                                    <span className="border-normal flex h-10 w-10 cursor-pointer items-center pl-2 md:h-10 2xl:mt-1">
                                        <AudioCallOption getCallShortId={getCallShortId} openCallOptions={openCallOptions} setOpenCallOptions={setOpenCallOptions} />
                                    </span>
                                )}
                            </Tippy>
                        )}
                        {hasVideocallsEnabled && (
                            <Tippy theme="jelou" content={t("pma.Video")} placement={"bottom"}>
                                {loadingVideo ? (
                                    <span className="border-normal flex h-10 w-10 cursor-not-allowed items-center 2xl:h-12">
                                        <BeatLoader color={"#00B3C7"} size={"0.25rem"} />
                                    </span>
                                ) : (
                                    <span className="border-normal flex h-10 w-10 cursor-pointer items-center 2xl:h-12">
                                        <VideoCallOption getVideoCallShortId={getVideoCallShortId} openCallOptions={openCallOptions} setOpenCallOptions={setOpenCallOptions} />
                                    </span>
                                )}
                            </Tippy>
                        )}
                        {canSwitch && (
                            <Tippy theme="jelou" content={t("pma.Transferir")} placement={"bottom"}>
                                <span className="border-normal flex h-10 w-10 cursor-pointer items-center justify-center 2xl:h-12" onClick={() => setShowModal(true)}>
                                    <ForwardIcon className="mx-auto fill-current text-primary-200" width="1.5625rem" height="1.125rem" strokeWidth="1.5" stroke="currentColor" />
                                </span>
                            </Tippy>
                        )}
                        <Tippy theme="jelou" content={t("pma.Descargar")} placement={"bottom"}>
                            <span className="border-normal flex h-10 w-10 items-center text-primary-200 2xl:h-12">
                                {loading ? (
                                    <span className="mx-auto cursor-not-allowed">
                                        <BeatLoader color={"#00B3C7"} size={"0.25rem"} />
                                    </span>
                                ) : (
                                    <span className="mx-auto cursor-pointer" onClick={downloadChat}>
                                        <DownloadIcon4 fill={"#00B3C7"} className="mx-auto" width="1.125rem" height="1.313rem" />
                                    </span>
                                )}
                            </span>
                        </Tippy>
                        <Tippy theme="jelou" content={t("pma.Cerrar")} placement={"bottom"}>
                            <span
                                className={`${
                                    activeBtn ? "cursor-pointer text-gray-500 hover:text-gray-600" : "cursor-not-allowed text-gray-400"
                                } border-normal flex h-10 w-10 items-center justify-center md:pt-1 2xl:h-12`}
                                onClick={activeBtn ? onLeaveRoom : null}
                                disabled={!activeBtn}
                            >
                                <CloseIcon className="mx-auto fill-current" width="1rem" height="1rem" />
                            </span>
                        </Tippy>
                    </div>
                </div>
                {/* mobile */}
                <div className="flex flex-1 justify-end mid:hidden">
                    <span
                        className={`mr-3 flex cursor-pointer items-center text-gray-400`}
                        onClick={() => {
                            setShowConversationSidebarMobile(true);
                        }}
                    >
                        <MobileOptionsIcon className="mx-auto" width="1.25rem" height="1.125rem" />
                    </span>
                    <span className={`mr-2 flex cursor-pointer items-center`} onClick={openInfo}>
                        <MoreOptionsIcon
                            className={`mx-auto ${mobileMenu ? "text-white" : "text-gray-400"}`}
                            width="0.75rem"
                            height="0.75rem"
                            strokeWidth="1.5"
                            fill="currentColor"
                            stroke="currentColor"
                        />
                    </span>
                </div>
            </div>
            {canSwitch && showModal && (
                <SwitchOperator
                    operators={operators}
                    closeModal={closeModal}
                    submitChange={submitChange}
                    handleChange={handlechange}
                    loading={switchLoading}
                    getOnlineOperators={getOperators}
                    tempOperator={tempOperator}
                    selectLoading={selectLoading}
                    loadingOptions={loadingOptions}
                    byTeam={byTeam}
                    byScopes={byScopes}
                    success={success}
                    getAll={getAll}
                    getAllTeams={getAllTeams}
                    getAllMyTeams={getAllMyTeams}
                    placeholder={placeholder}
                    noOptionsMessage={noOptionsMessage}
                />
            )}
            {showLeaveModal && <LeaveRoom names={names} closeLeaveModal={closeLeaveModal} leaveRoom={leaveRoom} leaving={leaving} flows={flows} bot={bot} type={"conversation_end"} />}
            {mobileMenu && (
                <div className="mt-2 flex w-full items-center justify-between border-t-default border-gray-100 border-opacity-25 px-5 py-1 shadow-md sm:mt-0 mid:hidden">
                    {source && (
                        <div className="flex mid:hidden">
                            <div className="flex items-center justify-center text-base font-medium text-gray-450">
                                <Source source={source} />
                                {showSender && <span className="pl-2 text-13 font-medium">{`${senderId.replace("@c.us", "")}` || `${_id.replace("@c.us", "")}`}</span>}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-1 justify-end">
                        {canSwitch && (
                            <span className="border-normal flex h-10 w-10 cursor-pointer items-center 2xl:h-12" onClick={() => setShowModal(true)}>
                                <ForwardIcon className="mx-auto fill-current text-primary-200" width="1.5rem" height="1.313rem" strokeWidth="1.5" stroke="currentColor" />
                            </span>
                        )}
                        <span className="border-normal flex h-10 w-10 cursor-pointer items-center justify-center 2xl:h-12">
                            {loading ? (
                                <span className="mx-auto">
                                    <BeatLoader color={"#00B3C7"} size={"0.25rem"} />
                                </span>
                            ) : (
                                <span className="mx-auto text-primary-200" onClick={downloadChat}>
                                    <DownloadIcon4 className="mx-auto" width="1.563rem" height="1.25rem" strokeWidth="1.5" fill="currentColor" stroke="currentColor" />
                                </span>
                            )}
                        </span>
                        <span
                            className={`${
                                activeBtn ? "cursor-pointer text-gray-400 hover:text-gray-600" : "cursor-not-allowed text-gray-400"
                            } border-normal flex h-10 w-10 items-center justify-center 2xl:h-12`}
                            onClick={activeBtn ? onLeaveRoom : null}
                            disabled={!activeBtn}
                        >
                            <CloseIcon className="mx-auto fill-current" width="1rem" height="1rem" />
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withTranslation()(RoomHeader);
