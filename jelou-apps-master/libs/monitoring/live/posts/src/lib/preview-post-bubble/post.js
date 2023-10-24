import dayjs from "dayjs";
import get from "lodash/get";
import last from "lodash/last";
import take from "lodash/take";
import split from "lodash/split";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";

import Clamp from "react-multiline-clamp";
import ImageLoader from "react-load-image";
import { MoonLoader } from "react-spinners";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { addFlows, updateFlows } from "@apps/redux/store";
import { JelouApiV1 } from "@apps/shared/modules";
import { createMarkup } from "@apps/shared/utils";
import { CommentIcon, MoreIcon1 } from "@apps/shared/icons";
import { RoomAvatar } from "@apps/shared/common";
// import PostReplyModal from "../post-reply-modal/post-reply-modal";
import { useTranslation } from "react-i18next";

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

const ImagePost = ({ mediaUrl, attachments, id, realPostId, reply_comment_id, appId }) => {
    const items = attachments.length;
    const offsetItems = items - 4;
    if (id === 3 && offsetItems > 0) {
        return (
            <a
                href={`https://facebook.com/permalink.php?story_fbid=${realPostId}&id=${appId}&comment_id=${realPostId}&reply_comment_id=${reply_comment_id}`}
                target="_blank"
                className={`border group relative overflow-hidden rounded-md bg-gray-500 bg-opacity-25 hover:border-gray-300 `}
                rel="noreferrer">
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
            <a
                href={mediaUrl}
                target="_blank"
                className={`border border-border group relative overflow-hidden rounded-md hover:border-gray-300`}
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
                    className={`${
                        attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    } border-all bg-transparent mid:grid mid:gap-2 mid:space-y-0 ${
                        attachments.length >= 4 ? "mid:grid-rows-2" : "mid:grid-rows-1"
                    } w-full overflow-hidden rounded-[10px]`}>
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

const Post = (props) => {
    const { post } = props;
    const { t } = useTranslation();
    const flows = useSelector((state) => state.flows);
    const dispatch = useDispatch();

    useEffect(() => {
        const botFlows = flows.find((flow) => flow.botId === get(post, "bot.id", post.appId));

        if (isEmpty(botFlows) && isEmpty(flows)) {
            getFlows(true);
        }

        if (isEmpty(botFlows) && !isEmpty(flows)) {
            getFlows();
        }
    }, []);

    const getFlows = async (add = false) => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${get(post, "bot.id")}/flows`, {
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
                    botId: get(post, "bot.id", post.appId),
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
                    <div className="flex "></div>
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
                                <ShowImage mediaUrl={get(quote, "bubble.mediaUrl", get(quote, "attachments.mediaUrl", ""))} key={index} />
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

    const renderMessage = () => {
        const isTwitterQuote = toLower(get(post, "levelName", "")) === "quoted";
        const isTwitterReplies = toLower(get(post, "recipient.type", null)) === "twitter_replies";

        const text = get(post, "bubble.textClean", get(post, "bubble.text", ""));
        const type = get(post, "bubble.type", "TEXT");
        const mediaUrl = get(post, "mediaUrl", null);
        const attachments = isEmpty(get(post, "attachments", null)) ? get(post, "bubble.attachments", []) : get(post, "attachments", null);
        const quote = get(post, "quotedStatus", null);

        if (isTwitterQuote && quote != null) {
            return <TextWithQuote mediaUrl={mediaUrl} attachments={attachments} quote={quote} text={text} t={t} />;
        }

        if (isTwitterReplies && isEmpty(attachments)) {
            return <TextWithMentions text={text} />;
        }

        if (type === "TEXT" && !isEmpty(attachments)) {
            return (
                <TextWithImage
                    mediaUrl={mediaUrl}
                    attachments={attachments}
                    text={text}
                    messageId={get(post, "messageId", "")}
                    botId={get(post, "recipientId", "")}
                />
            );
        }

        if (type === "IMAGE") {
            return (
                <TextWithImage
                    mediaUrl={mediaUrl}
                    attachments={attachments}
                    text={text}
                    messageId={get(post, "messageId", "")}
                    botId={get(post, "recipientId", "")}
                />
            );
        }

        if (type === "VIDEO") {
            return (
                <TextWithVideo
                    mediaUrl={mediaUrl}
                    attachments={attachments}
                    text={text}
                    messageId={get(post, "messageId", "")}
                    botId={get(post, "recipientId", "")}
                />
            );
        }

        return <ClampText text={text} t={t} />;
    };

    const getTime = () => {
        return dayjs(post.createdAt).format(`DD MMMM YYYY - HH:mm`);
    };

    const date = getTime();
    const replies = get(post, "replies_count", 0);

    const defaultAvatar = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
    const avatar = get(post, "from.profilePicture", defaultAvatar);

    return (
        <div className="top-0 z-10 w-full rounded-12 bg-white py-4 md:pt-5 md:pb-3">
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
                    </div>
                </div>
                <div className="mb-3">{renderMessage()}</div>
                <div className="mb-3 flex items-center justify-end text-11">
                    <CommentIcon className="mr-1 fill-current text-gray-400" fillOpacity={"0.5"} width="11" height="11" />
                    <span className="text-opacity-5 text-gray-400">
                        {replies} {replies === 1 ? t("pma.comentario") : t("pma.comentarios")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Post;
