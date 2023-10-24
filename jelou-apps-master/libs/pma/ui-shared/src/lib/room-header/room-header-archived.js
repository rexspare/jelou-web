import axios from "axios";
import get from "lodash/get";
import Tippy from "@tippyjs/react";
import emojiStrip from "emoji-strip";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useTranslation, withTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { MessengerIcon, WebColoredIcon, TwitterColoredIcon, WhatsappColoredIcon, InstagramColoredIcon } from "@apps/shared/icons";
import { Tag } from "../../index.js";
import { TagIcon, RecoverIcon, ArrowIcon, ChevronLeftIcon, MoreOptionsIcon, ChevronRightIcon, DownIcon, MobileOptionsIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import RecoverRoom from "../recover-room/recover-room";
import RoomAvatar from "../room-avatar/room-avatar";
import { setRecoverChat, deleteRoomArchived, setArchivedMessage, setCurrentRoomAfterRecover, showMobileChat, unsetCurrentArchivedRoom, setShowDisconnectedModal } from "@apps/redux/store";
import { onlySpaces, parseMessage, checkIfOperatorIsOnline } from "@apps/shared/utils";
import { useNavigate } from "react-router-dom";
import { useOnClickOutside } from "@apps/shared/hooks";
import UniqueHsmModal from "../unique-hsm-modal/unique-hsm-modal";
import { ClipLoader } from "react-spinners";

const RoomHeader = (props) => {
    const { mobileMenu, setMobileMenu, openInfo, usersId, currentRoom, flows, setShowConversationSidebarMobile } = props;
    const { t } = useTranslation();
    const groupId = get(currentRoom, "user.groupId", "");
    const storedParams = useSelector((state) => state.storedParams);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const bots = useSelector((state) => state.bots);
    const navigate = useNavigate();

    const { search = [] } = currentRoom;
    const dispatch = useDispatch();
    const activeBtn = true;
    const [showRecoverModal, setShowRecoverModal] = useState(false);
    const [recovering, setRecovering] = useState(false);
    const [errors, setErrors] = useState("");
    const [chatTags] = useState([]);
    const [showArrows, setShowArrows] = useState(false);
    const [roomAvatar, setRoomAvatar] = useState("");
    const totalSearch = search.length || 1;
    const [numberSearch, setNumberSearch] = useState(1);
    const [showUniqueModal, setShowUniqueModal] = useState(false);
    const [sendHsm, setSendHsm] = useState(false);
    const [inManualState, setInManualState] = useState(false);

    const isMountedRef = useRef(null);
    const { bot, _id } = currentRoom;
    const type = get(bot, "type", false);
    const showSender = toUpper(type) === "WHATSAPP";
    const isFacebook = toUpper(type) === "FACEBOOK";
    const isTwitter = toUpper(type) === "TWITTER";
    const isInstagram = toUpper(type) === "INSTAGRAM";
    const [cancelToken, setCancelToken] = useState();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const statusOperator = useSelector((state) => state.statusOperator);

    useEffect(() => {
        if (!isEmpty(chatTags)) {
            const slider = document.querySelector("#horizontal-draggable-tags");
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener("mousedown", (e) => {
                isDown = true;
                slider.classList.add("active");
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener("mouseleave", () => {
                isDown = false;
                slider.classList.remove("active");
            });
            slider.addEventListener("mouseup", () => {
                isDown = false;
                slider.classList.remove("active");
            });
            slider.addEventListener("mousemove", (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2; //scroll-fast
                slider.scrollLeft = scrollLeft - walk;
            });
        }
        isMountedRef.current = true;
        return () => (isMountedRef.current = false);
    }, []);

    function onRecoverRoom() {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        recoverRoom();
        // setShowRecoverModal(true);
    }

    const closeRecoverModal = () => {
        setErrors("");
        setInManualState(false);
        setSendHsm(false);
        setShowRecoverModal(false);
    };

    const getName = () => {
        let name = get(storedParams, "name", get(currentRoom, "user.names", "Desconocido"));
        if (onlySpaces(name) || isEmpty(name)) {
            name = get(currentRoom, "user.names", t("pma.Desconocido"));
            if (onlySpaces(name) || isEmpty(name)) {
                name = "Desconocido";
            }
        }
        return name;
    };

    useEffect(() => {
        let src = get(currentRoom, "metadata.profilePicture");

        if (isEmpty(src)) {
            src = get(currentRoom, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    }, [currentRoom]);

    const getLegalId = () => {
        let legalId = storedParams.legalId ? storedParams.legalId : get(usersId, "legalId", "");
        return legalId;
    };

    const names = getName();
    const legalId = getLegalId();
    const findCurrentBot = (botArray) => {
        return botArray.find((bot) => bot.id === get(currentRoom, "bot.id", {}));
    };

    const currentBot = findCurrentBot(bots);

    const canRecover = get(currentBot, "properties.operatorView.canRecoverChat")
        ? get(currentBot, "properties.operatorView.canRecoverChat")
        : get(company, "properties.operatorView.canRecoverChat", false);

    const canRecoverWeb = get(currentBot, "properties.operatorView.canRecoverWeb")
        ? get(currentBot, "properties.operatorView.canRecoverWeb")
        : get(company, "properties.operatorView.canRecoverWeb", false);

    const whatsappRoom = toUpper(get(currentRoom, "bot.type", "")) === "WHATSAPP";

    function recoverRoom() {
        setRecovering(true);
        const hasResumeConversations = get(company, "properties.operatorView.hasResumeConversations", false);
        let paramsObj = {
            userId: get(currentRoom, "_id", currentRoom.id),
            operatorId: userSession.operatorId,
            origin: "induced_by_operator",
            ...(hasResumeConversations ? { resumeConversation: true } : {}),
        };

        JelouApiV1.post(`/conversations/${get(currentRoom, "bot.id")}/start`, paramsObj)
            .then(async (resp) => {
                const { data } = resp;
                let status = get(data, "status", 1);
                if (status !== 0) {
                    closeRecoverModal();
                    dispatch(deleteRoomArchived(currentRoom._id));
                    navigate("/pma/chats");
                    dispatch(setCurrentRoomAfterRecover(groupId));
                    dispatch(setRecoverChat());
                } else {
                    const key = get(data, "error.key", "");
                    setShowRecoverModal(true);
                    if (toUpper(key) === "USER_IN_MANUAL_STATE") {
                        setInManualState(true);
                        setSendHsm(false);
                    } else {
                        if (whatsappRoom) {
                            setSendHsm(true);
                        } else {
                            setSendHsm(false);
                        }
                    }
                    setErrors(get(data, "error.clientMessages.es", data.message));
                }
                setRecovering(false);
            })
            .catch((error) => {
                const { response } = error;
                const { data } = response;
                const message = get(data, `error.clientMessages.${lang}`, data.message);
                setRecovering(false);
                console.log("error ", error);
                setErrors(message);
            });
    }

    const previousSearch = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);
        let number = numberSearch - 1;
        const userId = currentRoom._id;
        // dispatch(setLoadingMessage(true));
        if (numberSearch > 1) {
            setNumberSearch(number);
            const { id } = search[numberSearch];
            const roomId = get(search[numberSearch], "room.id", "");
            resultMessage(roomId, hasEnabledEvents, id, userId);
        }
    };

    const forwardSearch = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);
        let number = numberSearch + 1;
        const userId = currentRoom._id;
        // dispatch(setLoadingMessage(true));
        if (numberSearch < totalSearch) {
            setNumberSearch(number);
            const { id } = search[numberSearch];
            const roomId = get(search[numberSearch], "room.id", "");
            resultMessage(roomId, hasEnabledEvents, id, userId);
        }
    };

    const searchActual = async () => {
        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);
        const { id } = search[numberSearch];
        const roomId = get(search[numberSearch], "room.id", "");
        const userId = currentRoom._id;
        resultMessage(roomId, hasEnabledEvents, id, userId);
    };

    const resultMessage = async (roomId, hasEnabledEvents = true, id, userId) => {
        try {
            if (!isEmpty(cancelToken)) {
                await cancelToken.cancel("Operation canceled due to new request.");
            }
            const source = axios.CancelToken.source();
            setCancelToken(source);
            const { data } = await JelouApiV1.get(`/rooms/${roomId}/messages`, {
                params: {
                    limit: 10,
                    ...(hasEnabledEvents ? { events: true } : {}),
                    direction: "adjacent",
                    _id: id,
                    limitUp: 9,
                    limitBottom: 1,
                },
                cancelToken: source.token,
            });
            const { results } = data;
            let updatedConversation = [];
            for (const message of results) {
                updatedConversation.push({
                    ...parseMessage(message),
                    roomId: userId,
                    userId,
                    appId: bot.id,
                });
            }

            dispatch(setArchivedMessage(updatedConversation));
        } catch (error) {
            console.error(error);
            if (get(error, "__CANCEL__")) {
                setErrors(error);
            } else {
                setErrors(error);
            }
        }
    };

    const mobileRef = useRef(null);

    useOnClickOutside(mobileRef, () => setMobileMenu(false));

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
        <>
            <div
                className={`fixed top-[3.25rem] flex flex-col sm:relative md:top-0 mid:flex-col ${
                    !isEmpty(chatTags) ? `h-20 mid:h-32` : `h-12 sm:h-16 mid:h-18 2xl:h-20`
                } border-btm border-tp z-10 w-full items-center bg-white sm:z-0 sm:items-stretch md:border-t-0`}
            >
                <div className="border-btm z-10 flex w-full flex-row items-center bg-white px-4 py-2 sm:relative sm:z-50 sm:h-full sm:items-stretch sm:border-0 sm:!border-none md:top-0 md:z-50 mid:z-10 mid:flex-col mid:border-t-transparent">
                    <div className="my-auto flex flex-row items-center">
                        <div className={`flex flex-col ${type && "sm:pr-2"}`}>
                            <div
                                className="flex items-center"
                                onClick={() => {
                                    if (isMobile) {
                                        dispatch(showMobileChat());
                                        setMobileMenu(false);
                                        dispatch(unsetCurrentArchivedRoom());
                                    }
                                }}
                            >
                                <ArrowIcon className="mr-4 flex fill-current text-primary-200 mid:hidden" width="1.25rem" height="1.938rem" />
                                <div className="hidden md:flex">
                                    <RoomAvatar src={roomAvatar} name={emojiStrip(names)} type={type} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`leading-normal ${names.length > 35 ? "w-64 truncate 2xl:w-88" : ""} text-13 font-bold text-gray-400 sm:text-sm 2xl:text-15`}>{names}</span>
                                    <div className="hidden flex-row md:flex">
                                        {type && (
                                            <div className="hidden md:flex">
                                                <div className="flex items-center justify-center text-base font-medium text-gray-400">
                                                    {showSender && <span className="pr-2 font-medium sm:text-xs 2xl:text-13">{`${currentRoom._id.replace("@c.us", "")}`}</span>}
                                                </div>
                                            </div>
                                        )}
                                        {isFacebook && (
                                            <div className="hidden md:flex">
                                                <div className="flex items-center justify-center text-base font-medium text-gray-400">
                                                    <span className="pr-2 font-medium sm:text-xs 2xl:text-13">{get(currentRoom, "user.metadata.names", "")}</span>
                                                </div>
                                            </div>
                                        )}
                                        {isTwitter && (
                                            <div
                                                className={`} flex text-xs font-light
                                                text-gray-400`}
                                            >
                                                <span className="pr-2 font-medium sm:text-xs 2xl:text-13">{get(currentRoom, "user.metadata.names", "")}</span>
                                                <a
                                                    href={`https://twitter.com/${get(currentRoom, "user.metadata.username")}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:text-primary border-lft flex items-center px-2 hover:underline"
                                                >
                                                    {`@${get(currentRoom, "user.metadata.username")}`}{" "}
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
                                        {isInstagram && (
                                            <div className="hidden md:flex">
                                                <div className="flex items-center justify-center text-base font-medium text-gray-400">
                                                    <span className="pr-2 font-medium sm:text-xs 2xl:text-13">{get(currentRoom, "user.metadata.names", "")}</span>
                                                </div>
                                            </div>
                                        )}
                                        {legalId && (
                                            <div className="hidden md:flex">
                                                <p
                                                    className={`overflow-hidden truncate ${
                                                        (currentRoom.metadata?.names ||
                                                            toUpper(type) === "WHATSAPP" ||
                                                            toUpper(type) === "FACEBOOK" ||
                                                            toUpper(type) === "TWITTER" ||
                                                            toUpper(type) === "INSTAGRAM") &&
                                                        "border-lft pl-2"
                                                    } w-30 font-medium text-gray-400 sm:text-xs 2xl:text-13`}
                                                >{`C.I. ${legalId}`}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block mid:flex">
                            <div className="absolute inset-y-0 right-[1.25rem] top-[1rem] hidden mid:flex">
                                {((canRecover && type !== "Web") || canRecoverWeb) && (
                                    <span
                                        className={`${
                                            activeBtn ? "cursor-pointer bg-primary-600 text-primary-200" : "cursor-not-allowed bg-gray-10 text-gray-400"
                                        } ml-2 flex h-10 items-center rounded-full px-5 `}
                                        onClick={activeBtn ? onRecoverRoom : null}
                                        disabled={!activeBtn}
                                    >
                                        {recovering ? (
                                            <ClipLoader color={"#00B3C7"} size="1rem" />
                                        ) : (
                                            <RecoverIcon strokeWidth="1.5" stroke="currentColor" fill="#03b2cb" className="fill-current" width="1rem" height="1rem" />
                                        )}
                                        <span className="hidden pl-2 lg:block">{t("pma.Contactar")}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {!isEmpty(chatTags) && (
                        <div className="hidden items-center space-x-1 mid:flex">
                            <Tippy content={t("pma.Etiquetas")} placement={"bottom"}>
                                <span className="flex w-6">
                                    <TagIcon className="font-bold" width="1.25rem" height="1.188rem" />
                                </span>
                            </Tippy>
                            <div
                                id="horizontal-draggable-tags"
                                className={`relative flex flex-nowrap space-x-1 overflow-x-auto`}
                                onMouseOver={() => {
                                    if (!showArrows) setShowArrows(true);
                                }}
                                onMouseLeave={() => {
                                    if (showArrows) setShowArrows(false);
                                }}
                                style={{ overflow: "hidden", cursor: "move" }}
                            >
                                {showArrows && (
                                    <div className="sticky left-0 h-6 flex-none">
                                        <ChevronLeftIcon className="font-bold" fill="white" width="1.25rem" height="1.25rem" />
                                    </div>
                                )}
                                {!isEmpty(chatTags) &&
                                    chatTags.map((tag, index) => {
                                        return (
                                            <div className="h-6 flex-none">
                                                <Tag tag={tag} isList={true} readOnly={true} key={index} />
                                            </div>
                                        );
                                    })}
                                {showArrows && (
                                    <div className="sticky right-0 h-6 flex-none">
                                        <ChevronRightIcon className="font-bold" fill-current="text-white" width="1.25rem" height="1.25rem" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* mobile */}
                    <div className="flex flex-1 justify-end mid:hidden">
                        <span
                            className={`mr-3 flex cursor-pointer items-center text-gray-400`}
                            onClick={() => {
                                setShowConversationSidebarMobile(true);
                            }}
                        >
                            <MobileOptionsIcon className="mx-auto" color={"#7E819F"} width="1.063rem" height="1.938rem" />
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
                    {showRecoverModal && (
                        <RecoverRoom
                            names={names}
                            closeRecoverModal={closeRecoverModal}
                            recoverRoom={recoverRoom}
                            flows={flows}
                            bot={bot}
                            errors={errors}
                            recovering={recovering}
                            setShowUniqueModal={setShowUniqueModal}
                            whatsappRoom={toUpper(get(currentRoom, "bot.type", "")) === "WHATSAPP"}
                            sendHsm={sendHsm}
                            inManualState={inManualState}
                        />
                    )}
                </div>
                {mobileMenu && (
                    <div className="flex h-10 w-full items-center justify-between bg-white px-5 py-2 shadow-lg sm:mt-0 sm:h-14 sm:py-1 mid:hidden" ref={mobileRef}>
                        {type && (
                            <div className="flex w-full justify-between">
                                <div className="flex mid:hidden">
                                    <div className="flex items-center justify-center text-base font-medium text-gray-450">
                                        <SocialIcon type={type} />
                                        {showSender && <span className="pl-2 text-xs font-medium sm:text-13">{`${_id.replace("@c.us", "")}`}</span>}
                                    </div>
                                </div>
                                {((canRecover && type !== "Web") || canRecoverWeb) && (
                                    <div className="flex mid:hidden">
                                        <div className="flex items-center justify-center text-base font-medium text-gray-450">
                                            <span
                                                className={`${
                                                    activeBtn ? "cursor-pointer bg-primary-600 text-primary-200" : "cursor-not-allowed bg-gray-10 text-gray-400"
                                                } ml-2 flex h-8 items-center rounded-full px-5 text-13 sm:h-10 sm:text-base `}
                                                onClick={activeBtn ? onRecoverRoom : null}
                                                disabled={!activeBtn}
                                            >
                                                <RecoverIcon strokeWidth="1.5" stroke="currentColor" fill="#03b2cb" className="fill-current" width="0.813rem" height="0.875rem" />{" "}
                                                <span className="pl-2 text-13 md:text-base mid:block">{t("pma.Contactar")}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!isEmpty(search) && (
                <div className="border-btm z-10 flex w-full flex-row items-center bg-white px-4 py-1 text-15 text-gray-400">
                    <span>
                        Resultados{" "}
                        <button onClick={searchActual} className="font-semibold hover:text-primary-200">
                            {numberSearch}
                        </button>{" "}
                        de {totalSearch}
                    </span>
                    <button disabled={numberSearch >= totalSearch} onClick={forwardSearch}>
                        <DownIcon className={`my-1 ml-3 h-6 rotate-180 transform fill-current text-primary-200`} />
                    </button>
                    <button disabled={numberSearch <= 1} onClick={previousSearch}>
                        <DownIcon className={`my-1 ml-3 h-6 fill-current text-primary-200`} />
                    </button>
                </div>
            )}
            <UniqueHsmModal openModal={showUniqueModal} currentRoom={currentRoom} closeModal={() => setShowUniqueModal(false)} />
        </>
    );
};

const SocialIcon = (props) => {
    const size = props.size ? props.size : "1.25rem";

    switch (toUpper(props.type)) {
        case "TWITTER_REPLIES":
        case "TWITTER":
            return <TwitterColoredIcon className="fill-current" height={size} width={size} />;
        case "WHATSAPP":
        case "GUPSHUP":
        case "SMOOCH":
        case "TWILIO":
        case "WAVY":
        case "VENOM":
            return <WhatsappColoredIcon className="fill-current" height={size} width={size} />;
        case "FACEBOOK":
        case "FB_SMOOCH":
        case "FACEBOOK_COMMENTS":
            return <MessengerIcon className="fill-current" height={size} width={size} />;
        case "INSTAGRAM":
            return <InstagramColoredIcon className="fill-current" height={size} width={size} />;
        default:
            return <WebColoredIcon className="fill-current" height={size} width={size} />;
    }
};

export default withTranslation()(RoomHeader);
