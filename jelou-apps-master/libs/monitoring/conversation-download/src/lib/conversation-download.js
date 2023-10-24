import dayjs from "dayjs";
import advanced from "dayjs/plugin/advancedFormat";
import customFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import emojiStrip from "emoji-strip";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import last from "lodash/last";
import toUpper from "lodash/toUpper";
import { useEffect, useRef } from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { Conversation } from "./component/Conversation";
import { Tags } from "./component/TagsList";

import { DownloadIcon } from "@apps/shared/icons";
import { useLabels } from "libs/monitoring/ui-shared/src";

import { useCurrentRoom } from "./hook/currentRoom";
import { useDownloadConversation } from "./hook/downloadConversation";
import { JelouIconTitle } from "./hook/JelouTitleIcon";

import { useInformaction } from "./service/information";

const DEFAULT_LOGO = "https://s3-us-west-2.amazonaws.com/cdn.devlabs.tech/bsp-images/icono_bot.svg";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);
dayjs.extend(customFormat);
const DEFAULT_TIMEZONE = "America/Guayaquil";

const ConversationDownload = () => {
    const { t } = useTranslation();

    const wrapConversation = useRef();
    const [searchParams] = useSearchParams();
    const company = useSelector((state) => state.company);

    const urlSearch = useLocation();
    const params = new URLSearchParams(urlSearch.search);

    const initialMessage = params.get("initialMessage");
    const finalMessage = params.get("finalMessage");

    const existOtherParams = !isEmpty(initialMessage) && !isEmpty(finalMessage);

    const { currentRoom, conversationIsReady } = useCurrentRoom({ initialMessage, finalMessage, existOtherParams });

    const { downloadConversation, downloadIsReady, loadingDownload } = useDownloadConversation();

    const isDelete = currentRoom?.deleted || false;
    const isScrapper = searchParams.get("scrapper") === "true";

    const {
        _id = "",
        assignationMethod = {},
        endAt = "",
        endedReason = "",
        operator = {},
        origin = "",
        startAt = "",
        state = "",
        tags = [],
        user = {},
        chat = [],
        bot = {},
        name = "",
        wasReplied = false,
    } = currentRoom || {};
    const { names: clientNames = t("conversationDownload.unknown"), referenceId = "", id = "" } = user;
    const idChanelOP = get(currentRoom, "owner.id", "");
    const { names: operatorNames = t("conversationDownload.unknownOperator") } = operator;
    const { name: botName = "", type: botType = "" } = bot;

    const { getCompany } = useInformaction();
    const { renderEndedReason, renderOriginBadge, renderRepliedBadge, renderStatus } = useLabels();

    useEffect(() => {
        getCompany();
    }, []);

    const startAtWithParams = get(last(chat), "createdAt", "");
    const endAttWithParams = get(first(chat), "createdAt", "");

    const conversationDetail = [
        {
            label: t("conversationDownload.conversationID"),
            value: _id,
            validatedRender: true,
        },
        {
            label: t("conversationDownload.clientID"),
            value: id,
            validatedRender: !existOtherParams,
        },
        {
            label: t("conversationDownload.clientID"),
            value: idChanelOP,
            validatedRender: !!existOtherParams,
        },
        {
            label: t("conversationDownload.customerName"),
            value: clientNames || t("conversationDownload.unknown"),
            validatedRender: !existOtherParams,
        },
        {
            label: t("conversationDownload.customerName"),
            value: name || t("conversationDownload.unknown"),
            validatedRender: !!existOtherParams,
        },
        {
            label: t("conversationDownload.nameOfTheOperator"),
            value: operatorNames || t("conversationDownload.unknownOperator"),
            validatedRender: !existOtherParams,
        },
        {
            label: "Nombre del bot:",
            value: botName,
            validatedRender: Boolean(bot),
        },
        {
            label: "Canal:",
            value: String(botType).toLocaleLowerCase() === "Widget".toLocaleLowerCase() ? "WEB" : botType,
            validatedRender: Boolean(bot),
        },
        {
            label: t("conversationDownload.team"),
            value: assignationMethod.teamName,
            validatedRender: true,
        },
        {
            label: t("conversationDownload.startDate"),
            value: dayjs(startAt).tz(DEFAULT_TIMEZONE).format("DD/MM/YYYY HH:mm"),
            validatedRender: !existOtherParams,
        },
        {
            label: t("conversationDownload.firstMessage"),
            value: dayjs(startAtWithParams).tz(DEFAULT_TIMEZONE).format("DD/MM/YYYY HH:mm"),
            validatedRender: !!existOtherParams,
        },
        {
            label: t("conversationDownload.endDate"),
            value: dayjs(endAt).tz(DEFAULT_TIMEZONE).format("DD/MM/YYYY HH:mm"),
            validatedRender: toUpper(state) !== "ACTIVE" && !existOtherParams,
        },
        {
            label: t("conversationDownload.lastMessage"),
            value: dayjs(endAttWithParams).tz(DEFAULT_TIMEZONE).format("DD/MM/YYYY HH:mm"),
            validatedRender: toUpper(state) !== "ACTIVE" && !!existOtherParams,
        },
        {
            label: t("conversationDownload.conversationVisible"),
            value: isDelete ? t("conversationDownload.no") : t("conversationDownload.yes"),
            validatedRender: true,
        },
        {
            label: t("conversationDownload.origin"),
            value: renderOriginBadge(origin),
            validatedRender: true,
        },
        {
            label: t("conversationDownload.closingReason"),
            value: renderEndedReason(endedReason),
            validatedRender: toUpper(state) !== "ACTIVE" && !!endedReason,
        },
        {
            label: t("conversationDownload.state"),
            value: renderStatus(state),
            validatedRender: !!state,
        },
        {
            label: t("conversationDownload.replied"),
            value: renderRepliedBadge(wasReplied),
            validatedRender: true,
        },
    ];

    return (
        <section className="backgroundDownloadConversation relative flex h-full min-h-screen w-screen justify-center">
            {!isScrapper && (
                <button
                    disabled={!conversationIsReady || loadingDownload || downloadIsReady}
                    onClick={() =>
                        downloadConversation({
                            clientNames: clientNames ?? t("conversationDownload.unknown"),
                            operatorNames,
                            wrapConversation,
                            existOtherParams,
                        })
                    }
                    className="button-gradient-xl fixed right-2 top-2 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60">
                    {loadingDownload ? (
                        <ClipLoader color={"white"} size="1.1875rem" />
                    ) : downloadIsReady ? (
                        <span>{t("conversationDownload.fullDownload")}</span>
                    ) : (
                        <>
                            <span className="mr-1">{t("monitoring.Descargar")}</span>
                            <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                        </>
                    )}
                </button>
            )}

            <div ref={wrapConversation} className="mt-2 h-full w-full max-w-xl">
                <header className="mb-2 flex h-16 items-center justify-between rounded-12 bg-white pl-8 pr-4">
                    <div className="flex h-9 w-9 items-center overflow-hidden rounded-full bg-white object-cover">
                        <img
                            src={isEmpty(company.imageUrl) ? DEFAULT_LOGO : company.imageUrl}
                            alt="template"
                            className="h-full w-12 rounded-full object-contain"
                        />
                    </div>
                    <div>
                        <JelouIconTitle />
                    </div>
                </header>
                <main className="h-full rounded-12 bg-white pb-4 pt-9">
                    <div className="ml-8">
                        <h4 className="text-13 font-bold text-gray-400">{t("conversationDownload.conversationDetail")}</h4>
                        <ul className="mb-8 mt-4 space-y-1">
                            {conversationDetail.map((detail) => {
                                const { label, value, validatedRender } = detail;
                                return (
                                    validatedRender &&
                                    value && (
                                        <li className="grid" style={{ gridTemplateColumns: "10rem auto" }}>
                                            <span className="text-13 font-bold text-gray-400">{label}</span>
                                            <span className="text-13 font-semibold text-gray-textsecondary2">{value}</span>
                                        </li>
                                    )
                                );
                            })}

                            {!isEmpty(tags) && (
                                <li className="grid" style={{ gridTemplateColumns: "10rem auto", padding: "0.4rem 0 0" }}>
                                    <span className="text-13 font-bold text-gray-400">{t("conversationDownload.tags")}</span>
                                    <div className="w-74 text-13 font-semibold text-gray-textsecondary2">
                                        <Tags tags={tags} />
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <aside className="border-b-1 border-t-1 border-gray-250 pl-8">
                        <div className="flex h-16 items-center">
                            <Avatar
                                name={
                                    existOtherParams
                                        ? emojiStrip(name || t("conversationDownload.unknown"))
                                        : emojiStrip(clientNames || t("conversationDownload.unknown"))
                                }
                                className="mr-4 font-semibold"
                                size="2.438rem"
                                round={true}
                                color="#2A8BF2"
                                textSizeRatio={2}
                            />
                            <div className="flex flex-col">
                                <span className="max-w-64 truncate text-lg font-bold leading-normal text-gray-500">
                                    {existOtherParams ? name || t("conversationDownload.unknown") : clientNames || t("conversationDownload.unknown")}
                                </span>
                                {!isEmpty(referenceId) && !existOtherParams && (
                                    <span className="flex text-sm font-medium text-gray-500">{referenceId}</span>
                                )}
                                {!!existOtherParams && <span className="flex text-sm font-medium text-gray-500">{idChanelOP}</span>}
                            </div>
                        </div>
                    </aside>
                    <Conversation currentRoom={currentRoom} messages={chat} />
                </main>
            </div>
        </section>
    );
};

export default ConversationDownload;
