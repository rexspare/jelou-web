/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import "dayjs/locale/es";
import get from "lodash/get";
import isNull from "lodash/isNull";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { useTable, useSortBy, usePagination } from "react-table";

import { TableSkeleton } from "@apps/shared/common";

const AssignedCases = (props) => {
    const { data, loading, pageLimit, setPageLimit, maxPage, row, setRows, colum, customRows, t } = props;

    const Badge = ({ values }) => {
        switch (toUpper(values)) {
            case "INDUCED":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-blue-400">
                        {t("monitoring.Inducido")}
                    </span>
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
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-green-400">
                        {t("monitoring.Ticket")}
                    </span>
                );
            case "BROADCAST":
                return (
                    <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-green-400">
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

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.8rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.75rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderBottomWidth: "0.080rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
    };

    const cellStyles = {
        fontSize: "0.875rem",
        whiteSpace: "nowrap",
        color: "#727C94",
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "1rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        backgroundColor: "#ffffff",
    };

    let extraRowss = [];

    if (customRows) {
        extraRowss = [
            {
                Header: t("Usuario"),
                accessor: "user.names", // accessor is the "key" in the data
                Cell: ({ row: { original } }) => {
                    return <div className="max-w-xxs truncate text-left">{isEmpty(original.user.names) ? "-" : original.user.names}</div>;
                },
            },
            {
                Header: t("Transferido a"),
                accessor: (row) => (isEmpty(row.transferedTo) ? "--" : row.transferedTo),
            },

            {
                Header: t("Atendido Transferido"),
                accessor: (row) => (isEmpty(row.managedTransfer) ? "--" : row.managedTransfer),
            },
            {
                Header: t("Fecha Gestionado Transferido"),
                accessor: (row) => (isEmpty(row.firstRepliedAtOperatorTransfer) ? "--" : row.firstRepliedAtOperatorTransfer),
            },
            {
                Header: t("Transferido por"),
                accessor: (row) => (isEmpty(row.transferedFrom) ? "--" : row.transferedFrom),
            },
            {
                Header: t("Gestionado"),
                accessor: "managed",
            },
        ];
    }
    const language = localStorage.getItem("lang");
    let columns = useMemo(
        () =>
            [
                {
                    Header: t("monitoring.No. Cliente"),
                    accessor: (row) => row.user.id.replace("@c.us", ""),
                    Cell: ({ row: { original } }) => {
                        return <div className="max-w-xxs truncate text-left">{original.user.id.replace("@c.us", "")}</div>;
                    },
                },
                {
                    Header: t("Bot"),
                    accessor: "bot.name",
                },
                {
                    Header: t("monitoring.operator"),
                    accessor: "operator.names", // accessor is the "key" in the data
                },
                {
                    Header: t("monitoring.Team"),
                    accessor: (row) => get(row.assignationMethod, "teamName", get(row, "operator.team", "-")),
                    Cell: ({ row: { original } }) => {
                        const team = get(original.assignationMethod, "teamName", get(original, "operator.team", "-"));
                        return <div className="max-w-xxs truncate text-left">{!isEmpty(team) ? team : "-"}</div>;
                    },
                },
                {
                    Header: t("monitoring.Estado"),
                    accessor: (row) => {
                        switch (toUpper(row.state)) {
                            case "ACTIVE":
                                return t("monitoring.Activa");
                            case "AUTO_TRANSFER":
                                return t("monitoring.Transferencia Automática");
                            case "EXPIRED":
                                return t("monitoring.Expirada");
                            case "CLOSED":
                                return t("monitoring.Cerrada");
                            case "TRANSFERRED":
                                return t("monitoring.Transferida");
                            default:
                                return "-";
                        }
                    },
                },
                {
                    Header: t("monitoring.Finalizada por"),
                    accessor: (row) => {
                        switch (toUpper(row.endedReason)) {
                            case "CLOSED_BY_AUTO_TRANSFER":
                                return t("monitoring.Cierre automático");
                            case "EXPIRED":
                                return t("monitoring.Expiración");
                            case "CLOSED_BY_OPERATOR":
                                return t("monitoring.Cierre del operador");
                            case "TRANSFERRED":
                                return t("monitoring.Transferencia");
                            default:
                                return "-";
                        }
                    },
                },

                {
                    Header: t("monitoring.Origen"),
                    accessor: "origin",
                    Cell: ({ cell: { value } }) => <Badge values={value} />,
                },
                {
                    Header: t("monitoring.Hora inicio"),
                    accessor: (row) => dayjs(row.startAt).format("YYYY-MM-DD HH:mm"),
                },
                {
                    Header: t("monitoring.T. de respuesta"),
                    accessor: (row) => {
                        if (isNull(row.timeRepliedOperator)) {
                            return "--";
                        }
                        let time = row.timeRepliedOperator / 1000;
                        let timeMinutes = Math.round(row.timeRepliedOperator / 1000 / 60);

                        if (time > 60) {
                            if (timeMinutes.toString().length === 1) {
                                timeMinutes = `0${timeMinutes}`;
                            }
                            return `${timeMinutes}:00`;
                        } else {
                            time = Math.round(time);
                            if (time.toString().length === 1) {
                                time = `0${time}`;
                            }
                            return `00:${time}`;
                        }
                    },
                },
                {
                    Header: t("monitoring.Duración"),
                    accessor: (row) => (isNull(row.endAt) ? "--" : `${dayjs(row.endAt).diff(dayjs(row.startAt), "minutes")} min`),
                },
            ]
                .concat(extraRowss)
                .concat(colum)
                .concat([
                    {
                        Header: t("monitoring.Acción"),
                        Cell: ({ row: { original } }) => (
                            <div className="flex">
                                <Link
                                    to={{ pathname: `/monitoring/history/chats` }}
                                    state={original}
                                    className="mr-1 flex rounded-full p-2 focus:outline-none">
                                    <svg
                                        className="text-gray-400 hover:text-gray-400"
                                        width="1.5rem"
                                        height="1.5rem"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </Link>
                            </div>
                        ),
                    },
                ]),
        [colum, language]
    );

    let loadingSkeleton = [];

    for (let i = 0; i < 4; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} key={i} />);
    }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    return loading ? (
        <div className="rounded-b-xl bg-white pt-5">
            <div className="overflow-x-auto rounded-b-xl">
                <div className="inline-block min-w-full max-w-full bg-white align-middle">
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                            style={headerStyles}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>{loadingSkeleton}</tbody>
                    </table>
                    <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-6"></div>
                </div>
            </div>
        </div>
    ) : isEmpty(data) ? (
        <div className="rounded-b-xl bg-white pt-5">
            <div className="overflow-x-auto rounded-b-xl">
                <div className="inline-block min-w-full max-w-full bg-white align-middle">
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                            style={headerStyles}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                    </table>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex h-72 items-center text-gray-400 opacity-50">{t("No existen casos")}</div>
            </div>
            <div className="border-sm:px-6 flex items-center justify-between rounded-b-xl border-t-2 border-gray-100/25 bg-white px-4 py-3"></div>
        </div>
    ) : (
        <div className="rounded-b-xl bg-white pt-5">
            <div className="overflow-x-auto rounded-b-xl">
                <div className="inline-block min-w-full bg-white align-middle sm:rounded-lg">
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                            style={headerStyles}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()} style={cellStyles}>
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-3">
                        <div className="flex sm:w-1/3">
                            <button
                                className="mr-2 rounded-full p-2 disabled:cursor-not-allowed disabled:text-gray-400/75 disabled:opacity-50"
                                disabled={pageLimit === 1}
                                onClick={() => setPageLimit(pageLimit - 1)}>
                                <div className="h-6 w-6 text-gray-500">{"<"}</div>
                            </button>
                            <button
                                disabled={pageLimit === maxPage}
                                className="rounded-full p-2 disabled:cursor-not-allowed disabled:text-gray-400/75 disabled:opacity-50"
                                onClick={() => setPageLimit(pageLimit + 1)}>
                                <div className="h-6 w-6 text-gray-500"> {">"}</div>
                            </button>
                        </div>
                        <div className="relative w-24">
                            <select
                                className="select flex appearance-none justify-between border-none text-sm leading-5 text-gray-400 text-opacity-75 outline-none ring-transparent focus:ring-transparent"
                                value={row}
                                onChange={(e) => {
                                    setRows(Number(e.target.value));
                                }}>
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize} {t("filas")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(AssignedCases);
