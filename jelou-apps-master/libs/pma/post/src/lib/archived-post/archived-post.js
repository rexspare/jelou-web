import dayjs from "dayjs";
import get from "lodash/get";
import take from "lodash/take";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import React, { useEffect, useState } from "react";
import Clamp from "react-multiline-clamp";
import ImageLoader from "react-load-image";
import { MoonLoader } from "react-spinners";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector, useDispatch } from "react-redux";
import { JelouApiV1 } from "@apps/shared/modules";
import { ArchivedIcon, CommentIcon, LikeIcon, MessengerIcon, TwitterColoredIcon } from "@apps/shared/icons";
import { RoomAvatar } from "@apps/pma/ui-shared";
import { createMarkup } from "@apps/shared/utils";
import UnarchivePost from "../unarchive-post/unarchive-post";
import { useTranslation } from "react-i18next";
import { addFlows, updateFlows } from "@apps/redux/store";

dayjs.extend(relativeTime);

const ArchivedPost = (props) => {
    const { post } = props;
    const { t } = useTranslation();
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const flows = useSelector((state) => state.flows);
    const currentPost = useSelector((state) => state.currentPost);
    const dispatch = useDispatch();

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

    // @TODO
    // Unarchiving function

    const renderMessage = () => {
        const isTwitterReplies = toLower(get(post, "recipient.type", null)) === "twitter_replies";
        const isTwitterQuote = toLower(get(post, "levelName", "")) === "quoted";
        const text = get(post, "bubble.text", "");
        const type = get(post, "bubble.type", "TEXT");
        const mediaUrl = get(post, "bubble.mediaUrl", null);
        const attachments = get(post, "attachments", null);
        const quote = get(post, "quotedStatus", null);

        if (isTwitterQuote && quote != null) {
            return <TextWithQuote mediaUrl={mediaUrl} attachments={attachments} quote={quote} text={text} t={t} />;
        }

        if (isTwitterReplies && isEmpty(attachments)) {
            return <TextWithMentions text={text} />;
        }

        if (type === "IMAGE") {
            return <TextWithImage mediaUrl={mediaUrl} attachments={attachments} text={text} t={t} quote={quote} />;
        }

        if (type === "VIDEO") {
            return (
                <div>
                    <div className={`mt-2 w-full flex-1`}>
                        <TextWithMentions text={text} />
                    </div>
                    <div className="space-x-2">
                        <video controls className={`max-h-xxsm overflow-hidden rounded-lg`}>
                            <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            );
        }

        return <ClampText text={text} t={t} />;
    };

    const getTime = () => {
        return dayjs(post?.createdAt).format(`DD MMMM YYYY - HH:mm`);
    };

    const date = getTime();
    const type = get(currentPost, "channel", null);
    const replies = get(post, "replies_count", 0);
    const defaultAvatar = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
    const avatar = get(post, "from.profilePicture", defaultAvatar);

    const SocialIcon = ({ type, username, messageId }) => {
        switch (toUpper(type)) {
            case "TWITTER_REPLIES":
                return (
                    <a href={`https://twitter.com/${username}/status/${messageId}`} target="_blank" rel="noreferrer">
                        <TwitterColoredIcon className="fill-current" width="1.375rem" height="1.375rem" />
                    </a>
                );
            default:
                return <MessengerIcon className="fill-current" height="1.25rem" width="1.25rem" />;
        }
    };

    const closeLeaveModal = () => {
        setShowLeaveModal(false);
    };

    return (
        <div className="top-0 z-10 w-full rounded-12 bg-white py-4 md:pb-3 md:pt-5">
            <div className="px-3 md:px-5">
                <div className="mb-2 flex items-center">
                    <RoomAvatar src={avatar} name={get(post, "from.names", t("pma.Desconocido"))} type={type} />
                    <div className="flex flex-1 items-start justify-between">
                        <div className="flex flex-col text-gray-400">
                            <div className="mr-1 text-base font-bold capitalize">{get(post, "from.names", "")}</div>
                            <div className="flex text-xs font-light">
                                <span>{date}</span>
                            </div>
                        </div>
                        <SocialIcon type={type} username={get(post, "from.username", "")} messageId={get(post, "messageId")} />
                    </div>
                </div>
                <div className="mb-3">{renderMessage()}</div>
                <div className="mb-3 flex items-center text-11">
                    <LikeIcon className="mr-1 fill-current text-gray-400" fillOpacity={"0.5"} width="11" height="11" />
                    <span className="text-opacity-5 mr-2 text-gray-400">0 {t("pma.Me gusta")}</span>
                    <CommentIcon className="mr-1 fill-current text-gray-400" fillOpacity={"0.5"} width="11" height="11" />
                    <span className="text-opacity-5 text-gray-400">
                        {replies} {replies === 1 ? t("pma.comentario") : t("pma.comentarios")}
                    </span>
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between px-3 md:px-5">
                <div className="flex space-x-3">
                    <button
                        className="flex items-center rounded-xs border-default !border-primary-200 bg-white px-3 py-2 text-13 font-bold text-gray-400"
                        onClick={() => setShowLeaveModal(true)}>
                        <span>
                            <ArchivedIcon width="17" height="12" className="mr-2 fill-current text-primary-200" />
                        </span>
                        <span>{t("pma.Desarchivar")}</span>
                    </button>
                </div>
            </div>
            {showLeaveModal && <UnarchivePost post={post} closeLeaveModal={closeLeaveModal} origin={"induced_by_operator"} />}
        </div>
    );
};

export default ArchivedPost;

const ClampText = ({ text, t }) => {
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
            )}>
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
        parsedText = parsedText.replaceAll(
            match,
            `<a class="text-primary-200 underline" target="_blank" href="https://twitter.com/${match}">${match}</a>`
        );
    }

    return <div className="text-base leading-6 text-gray-400" dangerouslySetInnerHTML={createMarkup(parsedText)}></div>;
};

const ShowImage = ({ mediaUrl }) => (
    <a
        href={mediaUrl}
        target="_blank"
        className="border border-border group relative overflow-hidden rounded-md hover:border-gray-300"
        rel="noreferrer">
        <ImageLoader src={mediaUrl}>
            <img alt="" className="h-52 w-full object-cover" />
            <div className="flex h-52 w-full items-center justify-center"></div>
            <div className="flex h-52 w-full items-center justify-center">
                <MoonLoader sizeUnit="px" size={16} color="#00b3c7" />
            </div>
        </ImageLoader>

        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-25 opacity-0 transition duration-200 ease-in-out group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
        </div>
    </a>
);

const TextWithImage = ({ mediaUrl, attachments, text, t }) => {
    return (
        <div className={`flex flex-col items-start text-left text-sm`}>
            {!isEmpty(attachments) ? (
                <div className="flex space-x-2">
                    {take(attachments, 10).map((attachment, index) => (
                        <ShowImage mediaUrl={attachment.mediaUrl} key={index} />
                    ))}
                </div>
            ) : (
                <ShowImage mediaUrl={mediaUrl} />
            )}
            <div className={`mt-2 w-full flex-1`}>
                <TextWithMentions text={text} />
            </div>
        </div>
    );
};

const TextWithQuote = ({ mediaUrl, attachments, quote, text, t }) => {
    let isVideo = quote.bubble.type === toUpper("VIDEO");
    let isImage = quote.bubble.type === toUpper("IMAGE");
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
                <div className="flex"></div>
                <div className="text-15 font-bold text-gray-400">
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
                            <ShowImage mediaUrl={attachment.mediaUrl} key={index} />
                        ))}
                    </div>
                ) : (
                    ""
                )}
                {isImage && quote.attachments.length === 1 ? (
                    <ShowImage mediaUrl={get(quote, "bubble.mediaUrl", get(quote, "attachments.mediaUrl", ""))} />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};
