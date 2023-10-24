import dayjs from "dayjs";
import get from "lodash/get";
import take from "lodash/take";
import last from "lodash/last";
import split from "lodash/split";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import Clamp from "react-multiline-clamp";
import ImageLoader from "react-load-image";
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

import { MoreIcon1, CommentIcon } from "@apps/shared/icons";
import { RoomAvatar } from "@apps/shared/common";
import { createMarkup } from "@apps/shared/utils";

const OriginalPost = (props) => {
    const { post } = props;
    const { t } = useTranslation();

    const renderMessage = (room) => {
        const isTwitterReplies = toLower(get(post, "recipient.type", null)) === "twitter_replies";
        const text = get(post, "bubble.textClean", get(post, "bubble.text", ""));
        const type = get(post, "bubble.type", "TEXT");
        const mediaUrl = get(post, "bubble.mediaUrl", null);
        const attachments = isEmpty(get(post, "attachments", null)) ? get(post, "bubble.attachments", []) : get(post, "attachments", null);

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

    const by = get(post, "by", "OPERATOR");

    const name =
        toUpper(by) === "OPERATOR"
            ? get(post, "from.botName", get(post, "from.names", t("pma.Desconocido")))
            : get(post, "from.names", t("pma.Desconocido"));

    return (
        <div className="top-0 z-10 w-full rounded-12 bg-white">
            {toUpper(by) === "OPERATOR" && (
                <div className="border-b-default border-solid border-gray-100 border-opacity-25 px-3 py-3 text-15 text-gray-400 md:px-5 md:py-4">
                    {t(`pma.Contestado por`)} <b>{get(post, "from.names", t("pma.Desconocido"))}</b>
                </div>
            )}
            <div className="mb-2 flex items-center px-3 pt-4 md:px-5 md:pt-5">
                <RoomAvatar src={avatar} name={name} />
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col text-gray-400">
                        <div className="mr-1 text-base font-bold capitalize">{name}</div>
                        <div className="flex text-xs font-light">
                            <span>{date}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-3 md:px-5">{renderMessage()}</div>
            <div className="mt-2 flex items-center justify-end px-3 pb-3 text-xs md:px-5 md:pb-4">
                <CommentIcon className="text-opacity-5 mr-1 fill-current text-gray-400" width="13" height="13" />
                <span className="text-opacity-5 text-gray-400">
                    {replies} {replies === 1 ? t("pma.comentario") : t("pma.comentarios")}
                </span>
            </div>
        </div>
    );
};

const ClampText = ({ text }) => {
    const { t } = useTranslation();
    return (
        <Clamp
            withTooltip
            lines={4}
            className="px-3 py-4 md:px-5 md:py-5"
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
                        {t("plugins.Expandir")}
                    </button>
                </div>
            )}>
            <p className="whitespace-pre-line leading-6 text-gray-400">{text}</p>
        </Clamp>
    );
};

const TextWithMentions = ({ text }) => {
    // eslint-disable-next-line
    const pattern = /(^|[^@\w])@(\w{1,15})\b/g;
    const matchs = text.match(pattern);

    let parsedText = text;

    if (!matchs) {
        return <p className="text-base leading-6 text-gray-400">{text}</p>;
    }

    for (const match of matchs) {
        parsedText = parsedText.replaceAll(match, `<span class="text-primary-200 underline">${match}</span>`);
    }

    return <div className="text-base leading-6 text-gray-400" dangerouslySetInnerHTML={createMarkup(parsedText)}></div>;
};

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

const TextWithVideo = ({ mediaUrl, attachments, text, messageId, botId }) => {
    return (
        <div className={`flex flex-col items-start text-left text-sm`}>
            <div className={`mb-2 w-full flex-1`}>
                <TextWithMentions text={text} />
            </div>
            {!isEmpty(mediaUrl) && (
                <div className="space-x-2">
                    <video controls className={`max-h-xxsm overflow-hidden rounded-lg`}>
                        <source src={mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

export default OriginalPost;