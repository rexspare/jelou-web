import { useState } from "react";
import parse from "html-react-parser";
import get from "lodash/get";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { ChevronUpIcon } from "@apps/shared/icons";
import { useSelector } from "react-redux";

export function PreviewTicketBubble(props) {
    const { message, t, header } = props;

    const emailNumber = get(header, "emailNumber", "");
    const botName = get(header, "bot.name", "");
    const FromAssignation = get(message, "payload.From.name", "");
    const operatorDueDate = get(message, "payload.operator.names", "");
    const oldStatus = get(message, "payload.oldStatus", "");
    const newStatus = get(message, "payload.newStatus", "");
    const oldDueDate = get(message, "payload.oldDate", "");
    const newDueDate = get(message, "payload.newDate", "");
    const toOperatorName = get(message, "payload.To.name", "");
    const createdAt = get(message, "createdAt", "");
    const ticketAssignedBy = isEmpty(FromAssignation) ? botName : FromAssignation;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const statusBgColor = () => {
        switch (newStatus) {
            case "new":
                return "bg-yellow-20";

            case "open":
                return "bg-primary-20";

            case "pending":
                return "bg-red-20 ";

            case "solved":
                return "bg-green-20";

            default:
                return "bg-white border-default";
        }
    };

    const statusTextColor = () => {
        switch (newStatus) {
            case "new":
                return "text-yellow-200";
            case "open":
                return "text-primary-200";
            case "pending":
                return "text-red-1020";
            case "solved":
                return "text-green-960";
            default:
                return "text-gray-400";
        }
    };
    const [showInfoBubble, setShowInfoBubble] = useState(false);

    const getEventMessage = () => {
        switch (message.event) {
            case "ASSIGNATION":
                return !showInfoBubble ? (
                    <p className="-mt-6 rounded-xl bg-gray-50 px-6 font-semibold text-gray-400">
                        <button className="text-yellow-1020" onClick={() => setShowInfoBubble(true)}>{`${t(
                            "monitoring.emailAssignedTo"
                        )} ${toOperatorName}`}</button>
                    </p>
                ) : (
                    <div className="relative w-full rounded-1 bg-yellow-20 px-4 py-3  ">
                        <button onClick={() => setShowInfoBubble(false)} className="absolute right-0 top-0 mr-4 mt-4">
                            <ChevronUpIcon width={20} height={30} />
                        </button>
                        <p className="text-lg font-semibold text-yellow-1020">
                            <span className="text-gray-400">
                                {`
                                Email #${emailNumber}
                            `}
                            </span>
                            {` ${t("monitoring.assignedTo")} ${toOperatorName} `}
                        </p>
                        <p className="text-gray-400">{`${t("monitoring.made")} ${dayjs(createdAt)
                            .locale(lang || "es")
                            .format(`DD MMMM YYYY - HH:mm`)}`}</p>
                        <p className="text-gray-400">{`${t("monitoring.by")} ${ticketAssignedBy}`}</p>
                        <p className="inline text-gray-400">{t("monitoring.action")}</p>
                        <p className="inline font-semibold text-gray-400">{`${t("monitoring.emailAssignedToOperator")}`}</p>
                    </div>
                );
            case "CHANGE_TICKET_DUE_DATE":
                return !showInfoBubble ? (
                    <p className="-mt-6 rounded-xl bg-gray-50 px-6 font-semibold text-gray-400">
                        <button className=" text-fuchsia-600" onClick={() => setShowInfoBubble(true)}>{`${t("monitoring.emailDueDate")} `}</button>
                    </p>
                ) : (
                    <div className="relative w-full rounded-1 bg-fuchsia-20 py-3 px-4">
                        <button onClick={() => setShowInfoBubble(false)} className="absolute right-0 top-0 mr-4 mt-4">
                            <ChevronUpIcon width={20} height={30} />
                        </button>
                        <p className="text-lg font-semibold text-fuchsia-600">
                            <span className="text-gray-400">
                                {`
                                Email #${emailNumber}
                            `}
                            </span>
                            {` ${t("monitoring.changeDueDate")}  `}
                        </p>
                        <p className="text-gray-400">{`${t("monitoring.made")} ${dayjs(createdAt)
                            .locale(lang || "es")
                            .format(`DD MMMM YYYY - HH:mm`)}`}</p>
                        <p className="text-gray-400">{`${t("monitoring.by")} ${operatorDueDate}`}</p>
                        <p className="inline text-gray-400">{t("monitoring.action")}</p>
                        <p className="inline font-semibold text-gray-400">{` ${t("monitoring.emailDueDateFrom")} ${dayjs(oldDueDate).format(
                            "DD MMMM YYYY"
                        )} ${t("monitoring.to")}  ${dayjs(newDueDate).format("DD MMMM YYYY")}`}</p>
                    </div>
                );
            case "CHANGE_TICKET_STATUS":
                return !showInfoBubble ? (
                    <p className="-mt-6 rounded-xl bg-gray-50 px-6 font-semibold text-gray-400">
                        <button className={`${statusTextColor()}`} onClick={() => setShowInfoBubble(true)}>{`${t("monitoring.stateChange")} ${t(
                            `emailStatus.${oldStatus}`
                        )} ${t("monitoring.to")} ${t(`emailStatus.${newStatus}`)} `}</button>
                    </p>
                ) : (
                    <div className={`relative w-full rounded-1 ${statusBgColor()} p-3`}>
                        <button onClick={() => setShowInfoBubble(false)} className="absolute right-0 top-0 mr-4 mt-4">
                            <ChevronUpIcon width={20} height={30} />
                        </button>
                        <p className={`font-semibold ${statusTextColor()} text-lg`}>
                            <span className="text-gray-400">
                                {`
                                    Email #${emailNumber}
                                `}
                            </span>
                            {` ${t("monitoring.changedTo")} ${t(`emailStatus.${newStatus}`)}  `}
                        </p>
                        <p className="text-gray-400">{`${t("monitoring.made")} ${dayjs(createdAt)
                            .locale(lang || "es")
                            .format(`DD MMMM YYYY - HH:mm`)}`}</p>
                        <p className="text-gray-400">{`${t("monitoring.by")}${operatorDueDate}`}</p>
                        <p className="inline text-gray-400">{t("monitoring.action")}</p>
                        <p className="inline font-semibold text-gray-400">{` ${t("monitoring.emailChanged")} ${t(`emailStatus.${oldStatus}`)} ${t(
                            "monitoring.to"
                        )}  ${t(`emailStatus.${newStatus}`)}`}</p>
                    </div>
                );
            case "CREATION": {
                const toOperator = get(message, "payload.creator.names", "");
                return !showInfoBubble ? (
                    <p className="-mt-6 rounded-xl bg-gray-50 px-6 font-semibold text-gray-400">
                        <button className="text-green-700" onClick={() => setShowInfoBubble(true)}>{`${t(
                            "monitoring.Creado por"
                        )} ${toOperator}`}</button>
                    </p>
                ) : (
                    <div className="relative w-full rounded-1 bg-[#bdecb6] bg-opacity-50 px-4 py-3  ">
                        <button onClick={() => setShowInfoBubble(false)} className="absolute right-0 top-0 mr-4 mt-4">
                            <ChevronUpIcon width={20} height={30} />
                        </button>
                        <p className="text-lg font-semibold text-green-700">
                            <span className="text-gray-400">
                                {`
                                Email #${emailNumber}
                            `}
                            </span>
                            {` ${t("monitoring.Creado por")} ${toOperator} `}
                        </p>
                        <p className="text-gray-400">{`${t("monitoring.made")} ${dayjs(createdAt)
                            .locale(lang || "es")
                            .format(`DD MMMM YYYY - HH:mm`)}`}</p>
                        <p className="inline text-gray-400">{t("monitoring.action")}</p>
                        <p className="inline font-semibold text-gray-400">{`${t("monitoring.createdEmail")}`}</p>
                    </div>
                );
            }

            default:
                return !showInfoBubble ? (
                    <p className="-mt-6 rounded-xl bg-gray-50 px-6 font-semibold text-gray-400">
                        <button className={`text-purple-650`} onClick={() => setShowInfoBubble(true)}>{`${t(
                            "monitoring.emailTransferred"
                        )} ${toOperatorName} `}</button>
                    </p>
                ) : (
                    <div className={`relative w-full rounded-1 bg-purple-20 p-3`}>
                        <button onClick={() => setShowInfoBubble(false)} className="absolute right-0 top-0 mr-4 mt-4">
                            <ChevronUpIcon width={20} height={30} />
                        </button>
                        <p className={`text-lg font-semibold text-purple-650`}>
                            <span className="text-gray-400">
                                {`
                                    Email #${emailNumber}
                                `}
                            </span>
                            {`${t("monitoring.transferred")} ${toOperatorName}`}
                        </p>
                        <p className="text-gray-400">{`${t("monitoring.made")} ${dayjs(createdAt)
                            .locale(lang || "es")
                            .format(`DD MMMM YYYY - HH:mm`)}`}</p>
                        <p className="text-gray-400">
                            {t("monitoring.by")} {FromAssignation}
                        </p>
                        <p className="inline text-gray-400">{t("monitoring.action")}</p>
                        <p className="inline font-semibold text-gray-400">{`${t("monitoring.emailTransferredBy")} ${t(FromAssignation)} ${t(
                            "a "
                        )}  ${t(toOperatorName)}`}</p>
                    </div>
                );
        }
    };

    const parser = (html) => {
        return parse(html, {
            replace: (domNode) => {
                if (domNode.name === "img") {
                    domNode.attribs["data-jelou-img"] = "img";
                    return domNode;
                }
                if (domNode.name === "table" && get(domNode, "attribs.id", "") === "tiny-table") {
                    domNode.attribs["data-jelou-table"] = "table";
                    return domNode;
                }
            },
        });
    };

    if ("htmlBody" in message) {
        return (
            <div className="mb-4 rounded-1 bg-white px-4 py-3">
                <div className=" max-h-32 w-full overflow-x-hidden overflow-y-hidden  bg-white">
                    <div className="mb-2">
                        <p className="font-semibold text-gray-400">{get(message, "sender.names", "")}</p>
                        <p className="text-sm text-gray-400">
                            {dayjs(get(message, "createdAt", ""))
                                .locale(lang || "es")
                                .format(`DD MMMM YYYY - HH:mm`)}
                        </p>
                    </div>
                    {parser(message.htmlBody)}
                </div>
            </div>
        );
    }

    if ("event" in message) {
        return <div className={`flex justify-center  border-gray-300  ${!showInfoBubble ? "border-t-2 p-3" : " pb-4"}`}>{getEventMessage()}</div>;
    }
}
export default PreviewTicketBubble;
