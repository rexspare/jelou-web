import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { withTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";

import { ForwardIcon } from "@apps/shared/icons";
import { TransferModal } from "libs/monitoring/ui-shared/src";
import { Table } from "libs/monitoring/ui-shared/src";

const ActualCasesTable = (props) => {
    const {
        totalResults,
        actualPage,
        row,
        maxPage,
        setActualPage,
        setRows,
        loading,
        colum,
        customRows,
        data,
        noDataMessage,
        ifKia,
        teamOptions,
        t,
        setActualCases,
    } = props;
    const [forward, setForward] = useState(false);
    const [conversation, setConversation] = useState([]);

    const selectCase = (data) => {
        setConversation(data);
        setForward(true);
    };

    useEffect(() => {
        setForward(false);
    }, []);

    const Badge = ({ values }) => {
        switch (toUpper(values)) {
            case "INDUCED":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-blue-400">{t("Inducido")}</span>
                );
            case "INDUCED_BY_SYSTEM":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-blue-400">
                        {t("monitoring.Inducido sistema")}
                    </span>
                );
            case "INDUCED_BY_ADMIN":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-blue-400">
                        {t("monitoring.Inducido admin")}
                    </span>
                );
            case "INDUCED_BY_OPERATOR":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-blue-400">
                        {t("monitoring.Inducido operador")}
                    </span>
                );
            case "CLOSED":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-gray-400">
                        {t("monitoring.Cerrado")}
                    </span>
                );
            case "TRANSFER":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-yellow-600">
                        {t("monitoring.Transferido")}
                    </span>
                );
            case "AUTO_TRANSFER":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-yellow-600">
                        {t("monitoring.Transferido Automáticamente")}
                    </span>
                );
            case "TICKET":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-green-500">
                        {t("monitoring.Ticket")}
                    </span>
                );
            case "BROADCAST":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-green-500">
                        {t("monitoring.Difusión")}
                    </span>
                );
            case "ORGANIC":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-orange-400">
                        {t("monitoring.Orgánico")}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-orange-400">
                        {t("monitoring.Orgánico")}
                    </span>
                );
        }
    };

    let extraRowss = [];

    if (customRows) {
        extraRowss = [
            {
                Header: t("Bot"),
                accessor: "bot.name",
            },
            {
                Header: t("Transferido a"),
                accessor: (row) => (isEmpty(row.transferedTo) ? "--" : row.transferedTo),
            },
            {
                Header: t("Transferido por"),
                accessor: (row) => (isEmpty(row.transferedFrom) ? "--" : row.transferedFrom),
            },
        ];
    }
    const language = localStorage.getItem("lang");
    const columns = useMemo(
        () =>
            [
                {
                    Header: t("monitoring.operator"),
                    accessor: "operator.names",
                    Cell: ({ row: { original } }) => <p className="max-w-64 truncate xxl:max-w-72">{get(original, "operator.names", "--")}</p>,
                },
                {
                    Header: t("monitoring.name"),
                    accessor: "user.names",
                    Cell: ({ row: { original } }) => <p className="max-w-64 truncate xxl:max-w-72">{get(original, "user.names", "--")}</p>,
                },
                {
                    Header: t("monitoring.team"),
                    accessor: (row) => (
                        <p className="max-w-64 truncate xxl:max-w-72">{get(row, "assignationMethod.teamName", get(row, "team.name", "-"))}</p>
                    ),
                },
                {
                    Header: t("Id"),
                    accessor: (row) => row.user.id.replace("593", "0").replace("@c.us", ""),
                },
                {
                    Header: t("monitoring.origin"),
                    accessor: "origin",
                    Cell: ({ cell: { value } }) => <Badge values={value} />,
                },
                {
                    Header: t("monitoring.startTime"),
                    accessor: (row) => dayjs(row.startAt).format("HH:mm:ss"),
                },
                {
                    Header: t("monitoring.managed"),
                    accessor: (row) => get(row, "wasReplied", false),
                    Cell: ({ row: { original } }) => {
                        const replyTime = get(original, "wasReplied", false);
                        const badgeStyle =
                            "min-w-24 justify-center inline-flex items-center px-3 py-1 rounded-full text-xs font-medium leading-4 bg-";
                        if (replyTime) {
                            return <span className={`${badgeStyle} bg-teal-200 uppercase text-teal-800`}>{t("Gestionado")}</span>;
                        } else {
                            return <span className={`${badgeStyle} bg-red-200 uppercase text-red-800`}>{t("No Gestionado")}</span>;
                        }
                    },
                },
            ]
                .concat(extraRowss)
                .concat(
                    colum.map((col) => {
                        return {
                            Header: col.Header,
                            accessor: (row) => {
                                const data = get(row, col.accessor, "-");
                                return isEmpty(data) ? "-" : data;
                            },
                        };
                    })
                )
                .concat([
                    {
                        Header: t("monitoring.actions"),
                        Cell: ({ row: { original } }) => (
                            <button
                                className="flex h-10 w-10 cursor-pointer items-center text-gray-400 hover:text-primary-200 md:h-12 md:w-12 xxl:h-14 xxl:w-14"
                                onClick={() => selectCase(original)}>
                                <ForwardIcon
                                    className="mx-auto"
                                    width="1.5rem"
                                    height="1.313rem"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="currentColor"
                                />
                            </button>
                        ),
                        sticky: "left",
                    },
                ]),
        [colum, language]
    );

    return (
        <div>
            <Table
                row={row}
                data={orderBy(data, ["wasReplied"], ["asc"])}
                columns={columns}
                maxPage={maxPage}
                setRows={setRows}
                loading={loading}
                actualPage={actualPage}
                totalResults={totalResults}
                noDataMessage={noDataMessage}
                setActualPage={setActualPage}
                loadingColumns={customRows ? 15 : 8}
            />

            {forward && (
                <TransferModal
                    ifKia={ifKia}
                    setActualCases={setActualCases}
                    setForward={setForward}
                    conversation={conversation}
                    view={"ACTUAL_CASES"}
                    teamOptions={teamOptions}
                />
            )}
        </div>
    );
};
export default withTranslation()(ActualCasesTable);
