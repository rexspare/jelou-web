import "dayjs/locale/en";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import get from "lodash/get";
import toUpper from "lodash/toUpper";

import { msToTime } from "@apps/shared/utils";
import { ForwardIcon } from "@apps/shared/icons";
import { Table, TransferModal } from "@apps/monitoring/ui-shared";
import Tippy from "@tippyjs/react";

export function QueueCasesTable(props) {
    const { data, loading, actualPage, setActualPage, maxPage, row, setRows, totalResults, teamOptions, setQueueCases } = props;
    const [conversation, setConversation] = useState([]);
    const [assign, setAssign] = useState(false);

    let bots = useSelector((state) => state.bots);
    let company = useSelector((state) => state.company);
    const showPriorityColumn = get(company, "properties.monitoring.showQueuesPriority", false);
    const { t } = useTranslation();
    const noDataMessage = t("monitoring.No existen casos en cola");

    const getBadgeStyle = (priority) => {
        switch (priority) {
            case 0:
                return "bg-red-1050 text-red-10 flex font-medium text-xs leading-4 min-w-20 items-center justify-center rounded-1 px-3 py-1";
            case 1:
                return "bg-red-20 text-red-950 flex font-medium text-xs leading-4 min-w-20 items-center justify-center rounded-1 px-3 py-1";
            case 2:
                return "bg-yellow-200 text-yellow-600 flex font-medium text-xs leading-4 min-w-20 items-center justify-center rounded-1 px-3 py-1";
            case 3:
                return "bg-blue-200 text-blue-800 flex font-medium text-xs leading-4 min-w-20 items-center justify-center rounded-1 px-3 py-1";
            case 4:
                return "bg-blue-20 text-secondary-425 flex font-medium text-xs leading-4 min-w-20 items-center justify-center rounded-1 px-3 py-1";

            default:
                return "bg-gray-20 text-gray-400 flex font-medium text-xs leading-4 min-w-20 items-center justify-center rounded-1 px-3 py-1";
        }
    };

    const getTextPriority = (priority) => {
        switch (priority) {
            case 0:
                return t("monitoring.urgent");
            case 1:
                return t("monitoring.veryHigh");
            case 2:
                return t("monitoring.high");
            case 3:
                return t("monitoring.medium");
            case 4:
                return t("monitoring.low");
            default:
                return t("monitoring.veryLow");
        }
    };

    const assignCase = (data) => {
        setConversation(data);
        setAssign(true);
    };

    const percentageColor = (percentage) => {
        if (percentage <= 33) {
            return "bg-red-200 text-red-800";
        } else if (percentage <= 66) {
            return "bg-yellow-100 text-yellow-500";
        } else {
            return "bg-teal-200 text-teal-800";
        }
    };
    const language = localStorage.getItem("lang");
    const columns = useMemo(() => {
        const columnsArray = [
            {
                Header: t("monitoring.name"),
                accessor: (row) => get(row, "user.names", "-"),
                Cell: ({ row: { original } }) => {
                    const names = get(original, "user.names", "-");
                    return (
                        <div className="w-40">
                            <Tippy content={names} theme="light" placement={"bottom"}>
                                <p className="w-full truncate">{names}</p>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.clientNo"),
                accessor: (row) => row.user.id.replace("593", "0").replace("@c.us", ""),
            },
            {
                Header: t("monitoring.startTime"),
                accessor: (row) => dayjs(row.createdAt).format("HH:mm:ss"),
            },
            {
                Header: t("monitoring.team"),
                accessor: (row) => get(row, "assignationMethod.teamName", ""),
                Cell: ({ row: { original } }) => {
                    const team = get(original, "assignationMethod.teamName", "-");
                    return <div>{team}</div>;
                },
            },
            {
                Header: t("monitoring.priority"),
                name: "priorityComlumn",
                accessor: (row) => get(row, "priority", "-"),
                Cell: ({ row: { original } }) => {
                    const priority = get(original, "priority", "-");
                    return (
                        <div className={getBadgeStyle(priority)}>
                            <p className="uppercase">{getTextPriority(priority)}</p>
                            {priority > 4 ? `(${priority})` : null}
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.remainingTimeInQueue"),
                accessor: (row) => dayjs(row.createdAt).format("HH:mm:ss"),
                Cell: ({ row: { original } }) => {
                    const userBot = bots.find((bot) => bot.id === original.bot.id);
                    const type = get(original, "type", "");
                    const expirationTime = get(
                        userBot,
                        "properties.operatorView.tickets.expirationTime",
                        get(company, "properties.operatorView.tickets.expirationTime", "")
                    );
                    const createdTicketTime = dayjs(original.createdAt).format();
                    const minutes = expirationTime / 60;
                    const actualExpirationTime = dayjs(createdTicketTime).add(minutes, "minute").format();
                    const actualTime = dayjs().format();
                    const remainingTime = dayjs(actualExpirationTime).diff(actualTime) < 0 ? 0 : dayjs(actualExpirationTime).diff(actualTime);
                    const remainingTimeSeconds = remainingTime / 1000;
                    const percentage = (remainingTimeSeconds * 100) / expirationTime;

                    switch (toUpper(type)) {
                        case "CHAT":
                            return (
                                <div className="relative">
                                    <div
                                        className="flex overflow-hidden rounded-full text-xs font-medium leading-4"
                                        style={{ width: "200px", height: "23px", backgroundColor: "#f2f2f2" }}>
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            className={`flex flex-col justify-center whitespace-nowrap text-center shadow-none ${percentageColor(
                                                percentage
                                            )}  pl-2 uppercase`}>
                                            {`${msToTime(remainingTime)}`}
                                        </div>
                                    </div>
                                </div>
                            );
                        case "REPLY":
                            return "-";
                        default:
                            return "-";
                    }
                },
            },
            {
                Header: t("monitoring.actions"),
                Cell: ({ row: { original } }) => (
                    <span
                        className="flex h-10 w-10 cursor-pointer items-center text-gray-400 hover:text-primary-200 md:h-12 md:w-12 xxl:h-14 xxl:w-14"
                        onClick={() => assignCase(original)}>
                        <ForwardIcon
                            className="mx-auto"
                            width="1.5rem"
                            height="1.313rem"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="currentColor"
                        />
                    </span>
                ),
            },
        ];
        if (showPriorityColumn) {
            return columnsArray;
        } else {
            return columnsArray.filter((column) => column.name !== "priorityComlumn");
        }
    }, [company, language]);

    return (
        <div>
            <Table
                row={row}
                data={data}
                columns={columns}
                loading={loading}
                maxPage={maxPage}
                setRows={setRows}
                loadingColumns={8}
                actualPage={actualPage}
                totalResults={totalResults}
                setActualPage={setActualPage}
                noDataMessage={noDataMessage}
            />
            {assign && (
                <TransferModal
                    setForward={setAssign}
                    conversation={conversation}
                    actualCases={false}
                    textObj={{
                        button: t("Asignar"),
                        title: t("Asignar conversación"),
                    }}
                    view={"QUEUE_CASES"}
                    teamOptions={teamOptions}
                    setQueueCases={setQueueCases}
                />
            )}
        </div>
    );
}
export default QueueCasesTable;
