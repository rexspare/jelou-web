import dayjs from "dayjs";
import uniqid from "uniqid";
import get from "lodash/get";
import has from "lodash/has";
import last from "lodash/last";
import take from "lodash/take";
import trim from "lodash/trim";
import first from "lodash/first";
import split from "lodash/split";
import { v4 as uuidv4 } from "uuid";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import isObject from "lodash/isObject";
import omit from "lodash/omit";

import { toast } from "react-toastify";
import * as Sentry from "@sentry/react";
import Clamp from "react-multiline-clamp";
import ImageLoader from "react-load-image";
import { MoonLoader } from "react-spinners";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";

import { ImageIcon1 } from "@apps/shared/icons";

import TextAreaWithEmojis from "libs/pma/ui-shared/src/lib/textAreaEmojis/TextAreaWithEmojis";
import { renderMessage as renderToastMessage } from "@apps/shared/common";

import { PreviewFacebookImage, LeaveRoom, PreviewImage, ForwardPost } from "@apps/pma/ui-shared";
import { showMobileChat, addFlows, updateFlows, updateMessage, addMessages, unsetCurrentPost, addArchivedPost, setShowDisconnectedModal } from "@apps/redux/store";
import { JelouApiV1 } from "@apps/shared/modules";
import { createMarkup, checkIfOperatorIsOnline } from "@apps/shared/utils";
import { ArchivedIcon, CommentIcon, ForwardIcon1, QuickRepliesIcon, SendReplyIcon, MoreIcon1, MessengerIcon, TwitterColoredIcon } from "@apps/shared/icons";
import { RoomAvatar } from "@apps/shared/common";
import PostReplyModal from "../post-reply-modal/post-reply-modal";
import { useTranslation } from "react-i18next";
import { MESSAGE_TYPES } from "@apps/shared/constants";

dayjs.extend(relativeTime);

const ClampText = ({ text }) => {
    const { t } = useTranslation();
    return (
        <Clamp
            withTooltip
            lines={4}
            withToggle
            showLessElement={({ toggle }) => (
                <div className="mt-4 flex w-full items-center justify-end font-bold text-primary-200 hover:underline">
                    <button type="button" className="text-sm uppercase focus:outline-none" onClick={toggle}>
                        {t("pma.Colapsar")}
                    </button>
                </div>
            )}
            showMoreElement={({ toggle }) => (
                <div className="mt-4 flex w-full items-center justify-end font-bold text-primary-200 hover:underline">
                    <button type="button" className="text-sm uppercase focus:outline-none" onClick={toggle}>
                        {t("pma.Expandir")}
                    </button>
                </div>
            )}
        >
            <p className="whitespace-pre-line leading-6 text-gray-400">{text}</p>
        </Clamp>
    );
};

const TextWithMentions = ({ text }) => {
    const pattern = /(^|[^@\w])@(\w{1,15})\b/g;
    const matchs = text.match(pattern);

    let parsedText = text;

    if (!matchs) {
        return <p className="text-base leading-6 text-gray-400">{text}</p>;
    }

    for (const match of matchs) {
        parsedText = parsedText.replaceAll(match, `<a class="text-primary-200 underline" target="_blank" href="https://twitter.com/${match}">${match}</a>`);
    }

    return <div className="text-base leading-6 text-gray-400" dangerouslySetInnerHTML={createMarkup(parsedText)}></div>;
};

const ShowImage = ({ mediaUrl }) => (
    <a href={mediaUrl} target="_blank" rel="noreferrer" className="border border-border group relative overflow-hidden rounded-md hover:border-gray-300">
        <ImageLoader src={mediaUrl}>
            <img alt="" className="h-52 w-full object-cover" />
            <div className="flex h-52 w-full items-center justify-center"></div>
            <div className="flex h-52 w-full items-center justify-center">
                <MoonLoader sizeUnit="px" size={16} color="#00b3c7" />
            </div>
        </ImageLoader>

        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-25 opacity-0 transition duration-200 ease-in-out group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </div>
    </a>
);

const ImagePost = ({ mediaUrl, attachments, id, realPostId, reply_comment_id, appId }) => {
    const items = attachments.length;
    const offsetItems = items - 4;
    if (id === 3 && offsetItems > 0) {
        return (
            <a
                target="_blank"
                rel="noreferrer"
                href={`https://facebook.com/permalink.php?story_fbid=${realPostId}&id=${appId}&comment_id=${realPostId}&reply_comment_id=${reply_comment_id}`}
                className={`border group relative overflow-hidden rounded-md bg-gray-500 bg-opacity-25 hover:border-gray-300 `}
            >
                <ImageLoader src={mediaUrl}>
                    <img alt="" className="h-52 w-full object-cover" />
                    <div className="flex h-52 w-full items-center justify-center"></div>
                    <div className="flex h-52 w-full items-center justify-center">
                        <MoonLoader sizeUnit="px" size={16} color="#00b3c7" />
                    </div>
                </ImageLoader>

                <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-35 text-[2rem] font-bold text-white transition duration-200 ease-in-out">
                    <MoreIcon1 className="fill-current font-bold text-white" width="33" height="33" />
                    <span className="-ml-1"> {offsetItems}</span>
                </div>
            </a>
        );
    } else {
        return (
            <a href={mediaUrl} target="_blank" rel="noreferrer" className={`border border-border group relative overflow-hidden rounded-md hover:border-gray-300`}>
                <ImageLoader src={mediaUrl}>
                    <img alt="" className="h-52 w-full object-cover" />
                    <div className="flex h-52 w-full items-center justify-center"></div>
                    <div className="flex h-52 w-full items-center justify-center">
                        <MoonLoader sizeUnit="px" size={16} color="#00b3c7" />
                    </div>
                </ImageLoader>

                <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-25 opacity-0 transition duration-200 ease-in-out group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
            </a>
        );
    }
};

const TextWithImage = ({ mediaUrl, attachments, text, messageId, botId }) => {
    const realPostId = last(split(messageId, "_")) || [];
    const reply_comment_id = last(split(messageId, "_")) || [];
    const appId = botId.replace("_Feed", "");

    return (
        <div className={`flex flex-col items-start text-left text-sm`}>
            <div className={`mb-2 w-full flex-1`}>
                <TextWithMentions text={text} />
            </div>
            {!isEmpty(attachments) ? (
                <div
                    className={`${attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"} border-all bg-transparent mid:grid mid:gap-2 mid:space-y-0 ${
                        attachments.length >= 4 ? "mid:grid-rows-2" : "mid:grid-rows-1"
                    } w-full overflow-hidden rounded-[10px]`}
                >
                    {take(attachments, 4).map((attachment, index) => (
                        <ImagePost
                            mediaUrl={get(attachment, "mediaUrl", get(attachment, "imgUrl"))}
                            key={index}
                            attachments={attachments}
                            id={index}
                            realPostId={realPostId}
                            reply_comment_id={reply_comment_id}
                            appId={appId}
                        />
                    ))}
                </div>
            ) : (
                <ImagePost mediaUrl={mediaUrl} />
            )}
        </div>
    );
};

const TextWithVideo = ({ mediaUrl, attachments, text }) => {
    return (
        <div className={`flex flex-col items-start text-left text-sm`}>
            <div className={`mb-2 w-full flex-1`}>
                <TextWithMentions text={text} />
            </div>
            {!isEmpty(mediaUrl) && (
                <a href={attachments} target="_blank" className="mt-3 flex items-center text-gray-700 opacity-75 hover:underline" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    Video
                </a>
            )}
        </div>
    );
};

const BUBBLES_TYPES = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
};

const REPLIES_TYPES = {
    TWITTER_REPLIES: "TWITTER_REPLIES",
    FACEBOOK_FEED: "FACEBOOK_FEED",
};

export const MAX_LENGTH_TWITTER_REPLIES = 280;
export const MAX_LENGTH_FACEBOOK_REPLIES = 8000;

const Post = (props) => {
    const { post } = props;
    const { t } = useTranslation();
    const bots = useSelector((state) => state.bots);
    const flows = useSelector((state) => state.flows);
    const company = useSelector((state) => state.company);
    const currentPost = useSelector((state) => state.currentPost);
    const userSession = useSelector((state) => state.userSession);
    const statusOperator = useSelector((state) => state.statusOperator);

    const [leaving, setLeaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [text, setText] = useState("");
    const [operatorSelected, setOperatorSelected] = useState({});
    const [success, setSuccess] = useState(false);
    const [loadingForwading, setLoadingForwading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const dispatch = useDispatch();
    const [showSendMessage, setShowSendMessage] = useState(false);

    const findCurrentBot = (botArray) => {
        const botId = get(currentPost, "bot.id", null);
        return botArray.find((bot) => bot.id === botId);
    };

    const copyToClipBoard = (mess) => {
        setText(mess);
        closeShowMessage();
    };

    useEffect(() => {
        const botFlows = flows.find((flow) => flow.botId === get(currentPost, "bot.id", currentPost.appId));

        if (isEmpty(botFlows) && isEmpty(flows)) {
            getFlows(true);
        }

        if (isEmpty(botFlows) && !isEmpty(flows)) {
            getFlows();
        }
    }, []);

    const getFlows = async (add = false) => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${get(currentPost, "bot.id")}/flows`, {
                params: {
                    shouldPaginate: false,
                    state: true,
                },
            });
            const flows = data.results.map((flow) => {
                return {
                    ...flow,
                    value: flow.id,
                    label: flow.title,
                    botId: get(currentPost, "bot.id", currentPost.appId),
                };
            });
            if (add) {
                dispatch(addFlows(flows));
            } else {
                dispatch(updateFlows(flows));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const bot = findCurrentBot(bots);

    const closeLeaveModal = () => {
        setShowLeaveModal(false);
    };

    const closeShowMessage = () => {
        setShowSendMessage(false);
    };

    const TextWithQuote = ({ mediaUrl, attachments, quote, text, t }) => {
        let isVideo = quote.bubble.type === toUpper("VIDEO");
        let isImage = quote.bubble.type === toUpper(BUBBLES_TYPES.IMAGE);

        const getQuoteTime = () => {
            return dayjs(quote.createdAt).format(`DD MMMM YYYY - HH:mm`);
        };

        const quotedate = getQuoteTime();

        return (
            <div className={`mt-2 flex flex-col items-start text-left text-sm`}>
                <div className={`mt-2 w-full flex-1`}>
                    <TextWithMentions text={text} />
                </div>

                <div className={`border mt-2 flex w-full flex-col rounded-lg border-default border-gray-100 border-opacity-35 p-2`}>
                    <div className="flex "></div>
                    <div className=" text-15 font-bold text-gray-400">
                        <img alt="" className="relative mr-2 inline-block h-6 w-6 rounded-full" src={quote.from.profilePicture} />
                        {quote.from.names}
                        <span className="pl-2 text-13 font-light">
                            {`@${quote.from.username}`} · {quotedate}
                        </span>
                    </div>
                    <div className="py-2 text-gray-400">{quote.bubble.text}</div>
                    {isVideo ? (
                        <div className="space-x-2">
                            <video controls className={`max-h-xxsm overflow-hidden rounded-lg`}>
                                <source src={quote.bubble.mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        ""
                    )}
                    {isImage && !isEmpty(quote.attachments) && quote.attachments.length > 1 ? (
                        <div className="flex space-x-2">
                            {take(quote.attachments, 10).map((attachment, index) => (
                                <ShowImage mediaUrl={get(quote, "bubble.mediaUrl", get(quote, "attachments.mediaUrl", ""))} key={index} />
                            ))}
                        </div>
                    ) : (
                        ""
                    )}

                    {isImage && quote.attachments.length === 1 ? <ShowImage mediaUrl={get(quote, "bubble.mediaUrl", get(quote, "attachments.mediaUrl", ""))} /> : ""}
                </div>
            </div>
        );
    };

    const renderMessage = () => {
        const isTwitterQuote = toLower(get(post, "levelName", "")) === "quoted";
        const isTwitterReplies = toLower(get(post, "recipient.type", null)) === REPLIES_TYPES.TWITTER_REPLIES.toLocaleLowerCase();

        const text = get(post, "bubble.textClean", get(post, "bubble.text", ""));
        const type = get(post, "bubble.type", BUBBLES_TYPES.TEXT);
        const mediaUrl = get(post, "mediaUrl", null);
        const attachments = isEmpty(get(post, "attachments", null)) ? get(post, "bubble.attachments", []) : get(post, "attachments", null);
        const quote = get(post, "quotedStatus", null);

        if (isTwitterQuote && quote != null) {
            return <TextWithQuote mediaUrl={mediaUrl} attachments={attachments} quote={quote} text={text} t={t} />;
        }

        if (isTwitterReplies && isEmpty(attachments)) {
            return <TextWithMentions text={text} />;
        }

        if (type === BUBBLES_TYPES.TEXT && !isEmpty(attachments)) {
            return <TextWithImage mediaUrl={mediaUrl} attachments={attachments} text={text} messageId={get(post, "messageId", "")} botId={get(post, "recipientId", "")} />;
        }

        if (type === BUBBLES_TYPES.IMAGE) {
            return <TextWithImage mediaUrl={mediaUrl} attachments={attachments} text={text} messageId={get(post, "messageId", "")} botId={get(post, "recipientId", "")} />;
        }

        if (type === "VIDEO") {
            return <TextWithVideo mediaUrl={mediaUrl} attachments={attachments} text={text} messageId={get(post, "messageId", "")} botId={get(post, "recipientId", "")} />;
        }

        return <ClampText text={text} t={t} />;
    };

    const getTime = () => {
        return dayjs(post?.createdAt).format(`DD MMMM YYYY - HH:mm`);
    };

    function archivePost(onClose, flowId = null, motive = null) {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        setLeaving(true);
        let userId = post?.senderId;
        const senderId = post?.senderId;

        const { lang } = userSession;

        const { operatorId } = userSession;
        let paramsObj = {
            operatorId,
            ...(motive ? { dynamicEventId: motive?.id } : {}),
        };

        JelouApiV1.post(`/company/${post.company?.id}/reply/${post?.messageId}/close`, paramsObj)
            .then(async (resp) => {
                const { data } = resp;
                let status = get(data, "status", 1);
                if (status !== 0) {
                    onClose();
                    sessionStorage.removeItem("unarchiveRoom");
                    dispatch(addArchivedPost(currentPost));
                    dispatch(unsetCurrentPost());
                } else {
                    renderToastMessage(get(data, "error.clientMessages.es", data.message), MESSAGE_TYPES.ERROR);
                }

                // Set user to flow if flowId is not null
                const onLeaveFlowId = get(bot, "properties.onLeaveFlowId", null);
                if (flowId) {
                    await JelouApiV1.post(`/bots/${get(currentPost, "bot.id")}/users/${senderId}/flow/${flowId}`);
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
            })
            .catch((error) => {
                const errorResponse = get(error, "response.data.error.clientMessages", null);
                var messageError = null;
                if (!isEmpty(errorResponse)) {
                    for (const [key, value] of Object.entries(errorResponse)) {
                        if (key === lang) {
                            messageError = value;
                        } else if (lang === "pt") {
                            messageError = "Nenhum operador disponível foi encontrado no momento";
                        }
                    }
                }
                setLeaving(false);
                renderToastMessage(messageError, MESSAGE_TYPES.ERROR);
            });
    }

    const handleChange = (event) => {
        const text = event.target.value;
        setText(text);
    };

    const sendMessage = (value) => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        if (isEmpty(trim(text)) || sending) {
            renderToastMessage("No puedes hacer una publicación sin texto", MESSAGE_TYPES.ERROR);
            return;
        }

        setSending(true);

        const isBubbleIMG = !isEmpty(attachments);

        const message = {
            botId: get(bot, "id", null),
            userId: get(post, "messageId", null),
            id: uuidv4(),
            bubble: {
                text: isEmpty(value) ? text : value,
                type: isBubbleIMG ? BUBBLES_TYPES.IMAGE : BUBBLES_TYPES.TEXT,
                quotedMessageId: get(post, "messageId", null),
                ...(isBubbleIMG ? { attachments: attachments } : {}),
                ...(isBubbleIMG ? { mediaUrl: first(attachments).imgUrl } : {}),
                ...(isBubbleIMG ? { caption: text } : {}),
            },
        };

        const formMessage = {
            ...message,
            createdAt: dayjs().valueOf(),
            inReplyTo: get(post, "messageId", null),
            from: {
                names: userSession.names,
                avatar: userSession.names,
                botName: get(bot, "properties.page.name", bot.name),
                profilePicture: get(bot, "properties.page.profilePicture", bot.imageUrl),
            },
            by: "OPERATOR",
            ...(isBubbleIMG ? { attachments: attachments } : {}),
            ...(isBubbleIMG ? { mediaUrl: first(attachments).imgUrl } : {}),
        };

        dispatch(addMessages(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(message, ["source"])).catch((error) => {
            dispatch(
                updateMessage({
                    ...formMessage,
                    status: "FAILED",
                })
            );
            setText("");
            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Post ) Send Message Failed With: ${error.message}`));
        });
        setText("");
        setAttachments([]);
        setSending(false);
        setOpenPreview(false);
    };

    const onChangeForward = (operator) => {
        setOperatorSelected(operator);
    };

    const closeModal = () => {
        setShowForwardModal(false);
        setOperatorSelected(null);
    };

    const forwardPost = () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }

        const { roomId } = post;
        const { value, label } = operatorSelected;

        const payload = {
            from: {
                referenceId: userSession.providerId,
                memberType: "operator",
            },
            to: {
                referenceId: value,
                memberType: "operator",
            },
            replyId: get(post, "_id", null),
        };

        setLoadingForwading(true);

        JelouApiV1.post(`/rooms/${roomId}/members/transfer`, payload)
            .then((res) => {
                const { data } = res;
                const type = get(data, "data.type", "");
                if (type === "OPERATOR_NOT_FOUND") {
                    toast.error(`Hubo un error al transferir la publicación, tal vez el operador ${label} no se encuentra disponible`, {
                        autoClose: true,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                } else {
                    setShowForwardModal(false);
                    setSuccess(true);
                    dispatch(showMobileChat());
                }
                setLoadingForwading(false);
                setOperatorSelected(null);
            })
            .catch((err) => {
                console.error("ERROR", err);
                setLoadingForwading(false);
                setSuccess(false);
                setOperatorSelected(null);
            });
    };

    const date = getTime();
    const type = get(currentPost, "channel", null);
    const maxLength = toUpper(type) === REPLIES_TYPES.TWITTER_REPLIES ? MAX_LENGTH_TWITTER_REPLIES : MAX_LENGTH_FACEBOOK_REPLIES;
    const replies = get(post, "replies_count", 0);

    const defaultAvatar = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
    const avatar = get(post, "from.profilePicture", defaultAvatar);

    const canSwitch = get(bot, "properties.operatorView.canSwitch") ? get(bot, "properties.operatorView.canSwitch") : get(company, "properties.operatorView.canSwitch", false);

    const SocialIcon = ({ type, username, messageId, botId }) => {
        const realPostId = first(split(messageId, "_")) || [];
        const reply_comment_id = last(split(messageId, "_")) || [];
        const appId = botId.replace("_Feed", "");

        switch (toUpper(type)) {
            case REPLIES_TYPES.TWITTER_REPLIES:
                return (
                    <a href={`https://twitter.com/${username}/status/${messageId}`} target="_blank" rel="noreferrer">
                        <TwitterColoredIcon className="fill-current" width="1.375rem" height="1.375rem" />
                    </a>
                );
            default:
                return (
                    <a href={`https://facebook.com/permalink.php?story_fbid=${realPostId}&id=${appId}&comment_id=${realPostId}&reply_comment_id=${reply_comment_id}`} target="_blank" rel="noreferrer">
                        <MessengerIcon className="fill-current" height="1.25rem" width="1.25rem" />
                    </a>
                );
        }
    };

    const imageAcceptance = () => {
        return "image/jpg, image/jpeg, image/png";
    };

    const [openPreview, setOpenPreview] = useState(false);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (formData) => {
        const { appId } = currentPost;
        const { Company } = userSession;
        const { clientId, clientSecret } = Company;

        const auth = {
            username: clientId,
            password: clientSecret,
        };

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            auth,
        };

        return JelouApiV1.post(`/bots/${appId}/images/upload`, formData, config)

            .then(({ data }) => {
                return data;
            })
            .catch(({ error }) => {
                if (has(error, "response.data")) {
                    Sentry.setExtra("error", get(error, "response.data"));
                } else {
                    Sentry.setExtra("error", error);
                }

                Sentry.captureException(new Error("Error uploading file."));
                return error;
            });
    };

    const handleImage = async (evt) => {
        try {
            const { target } = evt;
            const file = target.files[0];
            var reader = new FileReader();
            const fileType = file.type.split("/").pop();
            let fileName = file.name.replace(/ /g, "_");
            fileName = uniqid() + `-${fileName}`;
            fileName = toLower(`${fileName}`);
            const path = `images/${fileName}`;
            const kbSize = file.size / 1000;

            evt.target.value = null;

            // Verify that the file is supported.
            const acceptance = imageAcceptance().split(",");
            const isFileType = !!acceptance.find((acp) => fileType === acp.replace("image/", "").replace(/\s+/, ""));

            if (!isFileType) {
                toast.error(`${t("pma.Formato de imagen no soportado")}`, {
                    autoClose: true,
                    position: toast.POSITION.BOTTOM_CENTER,
                });
                return;
            }

            reader.onloadend = async () => {
                setUploading(true);
                setOpenPreview(true);

                if (kbSize > "25000") {
                    toast.error(`${t("pma.Imagen no soportada, intente una menos pesada")}`, {
                        autoClose: true,
                        position: toast.POSITION.BOTTOM_CENTER,
                    });
                    return;
                }
            };

            if (file) {
                reader.readAsDataURL(file);
                const formData = new FormData();
                formData.append(BUBBLES_TYPES.IMAGE.toLocaleLowerCase(), file);
                formData.append("path", path);
                const imgUrl = await uploadFile(formData);

                const attachment = toUpper(type) === REPLIES_TYPES.FACEBOOK_FEED ? [{ mediaUrl: imgUrl, imgUrl, name: file.name, type: file.type }] : [...attachments, { imgUrl, fileName }];

                setAttachments(attachment);

                setUploading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    /** @type {React.MutableRefObject<HTMLInputElement>} inputHandleImgRef  */
    const inputHandleImgRef = useRef(null);

    return (
        <div className="top-0 z-10 w-full rounded-3 bg-white py-4 md:pb-3 md:pt-5">
            <div className="border-grey-300 border-b-default border-opacity-25">
                <div className="px-3 md:px-5">
                    <div className="mb-2 flex items-center">
                        <RoomAvatar src={avatar} name={get(post, "from.names", t("pma.Desconocido"))} />
                        <div className="flex flex-1 items-start justify-between">
                            <div className="flex flex-col text-gray-400">
                                <div className="mr-1 text-base font-bold capitalize">{get(post, "from.names", "")}</div>
                                <div className="flex text-xs font-light">
                                    <span>{date}</span>
                                </div>
                            </div>
                            <SocialIcon type={type} username={get(post, "from.username", "")} messageId={get(post, "messageId", "")} botId={get(post, "recipientId", "")} />
                        </div>
                    </div>
                    <div className="mb-3">{renderMessage()}</div>
                    <div className="mb-3 flex items-center text-11">
                        <CommentIcon className="mr-1 fill-current text-gray-400" fillOpacity={"0.5"} width="11" height="11" />
                        <span className="text-opacity-5 text-gray-400">
                            {replies} {replies === 1 ? t("pma.comentario") : t("pma.comentarios")}
                        </span>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex space-x-3">
                            <button
                                className="flex items-center rounded-xs border-default !border-primary-200 bg-white px-3 py-2 text-13 font-bold text-gray-400"
                                onClick={() => setShowForwardModal(true)}
                            >
                                <span>
                                    <ForwardIcon1 width="17" height="12" className="mr-2 fill-current text-primary-200" />
                                </span>
                                <span>{t("pma.Transferir")}</span>
                            </button>
                        </div>

                        <div className="flex">
                            <button
                                className="flex items-center rounded-xs border-default !border-primary-200 bg-white px-3 py-2 text-13 font-bold text-gray-400"
                                onClick={() => setShowLeaveModal(true)}
                            >
                                <span>
                                    <ArchivedIcon width="17" height="12" className="mr-2 fill-current text-primary-200" />
                                </span>
                                <span>{t("pma.Archivar")}</span>
                            </button>
                        </div>
                    </div>
                    <TextAreaWithEmojis text={text} setText={setText} maxLength={maxLength} handleChange={handleChange} />
                    <div className="flex justify-end">
                        <div className="pointer-events-none mb-1 mr-2 mt-0 flex select-none items-end text-sm font-semibold text-gray-600 opacity-50">
                            {toUpper(type) === REPLIES_TYPES.TWITTER_REPLIES ? text.length + " / " + maxLength : ""}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between px-3 md:px-5">
                <div className="flex gap-2">
                    <button onClick={() => setShowSendMessage(true)} className="m-auto flex h-8 w-8 cursor-pointer items-center rounded-full bg-primary-200 hover:bg-primary-100">
                        <QuickRepliesIcon className="m-2 fill-current text-transparent" width="1.063rem" height="1.313rem" />
                    </button>

                    <button onClick={() => inputHandleImgRef.current.click()}>
                        <span className="fill-current text-gray-400">
                            <ImageIcon1 width="22" height="22" />
                        </span>
                        <input ref={inputHandleImgRef} hidden onChange={handleImage} type="file" accept={imageAcceptance()} />
                    </button>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="flex items-center rounded-full border-default !border-transparent bg-primary-200 px-3 py-2 text-13 font-bold text-white hover:bg-primary-100 disabled:cursor-not-allowed"
                        disabled={sending}
                        onClick={() => sendMessage()}
                    >
                        {sending ? (
                            <div className="mr-2">
                                <MoonLoader sizeUnit="px" size={16} color="#ffffff" />
                            </div>
                        ) : (
                            <span>
                                <SendReplyIcon width="15" height="11" className="mr-2 fill-current text-white" />
                            </span>
                        )}
                        <span>{t("pma.Enviar")}</span>
                    </button>
                </div>
            </div>
            {canSwitch && showForwardModal && (
                <ForwardPost
                    closeModal={closeModal}
                    submitChange={forwardPost}
                    onChange={onChangeForward}
                    success={success}
                    operatorSelected={operatorSelected}
                    bot={bot}
                    loadingForwading={loadingForwading}
                />
            )}
            {showSendMessage && <PostReplyModal onClose={closeShowMessage} copyToClipBoard={copyToClipBoard} />}
            {showLeaveModal && <LeaveRoom names={get(post, "from.names", "")} closeLeaveModal={closeLeaveModal} leaveRoom={archivePost} leaving={leaving} flows={flows} bot={bot} type={"reply_end"} />}
            {openPreview && toUpper(type) === REPLIES_TYPES.TWITTER_REPLIES ? (
                <PreviewImage
                    text={text}
                    type={type}
                    setText={setText}
                    sending={sending}
                    uploading={uploading}
                    attachments={attachments}
                    submitChange={sendMessage}
                    handleChange={handleChange}
                    setAttachments={setAttachments}
                    closePreview={() => setOpenPreview(false)}
                />
            ) : openPreview && toUpper(type) === REPLIES_TYPES.FACEBOOK_FEED && isEmpty(attachments) === false ? (
                <PreviewFacebookImage
                    isOpen={openPreview}
                    onClose={() => {
                        setOpenPreview(false);
                        setAttachments([]);
                    }}
                    loadingSending={uploading}
                    handleChange={handleChange}
                    selectedFile={first(attachments)}
                    showFBReplies
                    submitChange={sendMessage}
                    text={text}
                    setText={setText}
                />
            ) : null}
        </div>
    );
};

export default Post;
