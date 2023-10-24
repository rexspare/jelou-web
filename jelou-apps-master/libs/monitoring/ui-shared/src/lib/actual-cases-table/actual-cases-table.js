/* eslint-disable react-hooks/exhaustive-deps */
import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { withTranslation } from "react-i18next";
import React, { useState, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Styles } from "./table-container";

import { DownIcon, ForwardIcon } from "@apps/shared/icons";
import { SwitchOperator } from "../../index.js";
import { TableSkeleton } from "@apps/shared/common";
import Tippy from "@tippyjs/react";

const ActualCasesTable = (props) => {
    const { data, page, nrows, maxPage, setPage, setRows, loading, t, totalResults } = props;
    const [forward, setForward] = useState(false);
    const [conversation, setConversations] = useState([]);

    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.Nombre"),
                accessor: (row) => get(row, "user.names"),
                Cell: ({ row: { original } }) => {
                    return (
                        <Tippy content={get(original, "user.names")} theme={"jelou"} placement={"top"} arrow={false}>
                            <div className="max-w-cell">
                                <div className="overflow-hidden overflow-ellipsis font-semibold">{get(original, "user.names")}</div>
                            </div>
                        </Tippy>
                    );
                },
            },
            {
                Header: t("Id"),
                accessor: (row) => row.user.id.replace("593", "0").replace("@c.us", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="max-w-cell">
                            <div className="overflow-hidden overflow-ellipsis">{original.user.id.replace("593", "0").replace("@c.us", "")}</div>
                        </div>
                    );
                },
            },
            {
                Header: t("Bot"),
                accessor: (row) => get(row, "bot.name", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <Tippy content={get(original, "bot.name")} theme={"jelou"} placement={"top"} arrow={false}>
                            <div className="max-w-cell">
                                <div className="overflow-hidden overflow-ellipsis font-semibold">{get(original, "bot.name")}</div>
                            </div>
                        </Tippy>
                    );
                },
            },
            {
                Header: t("monitoring.Hora Inicio"),
                accessor: (row) => dayjs(row.startAt).format("DD-MM-YYYY / HH:mm:ss"),
            },
            {
                Header: t("monitoring.Gestionado"),
                accessor: (row) => {
                    const replyTime = get(row, "wasReplied", false);
                    if (replyTime) {
                        return t("Si");
                    } else {
                        return t("No");
                    }
                },
            },
            {
                Header: t("monitoring.Acciones"),
                Cell: ({ row: { original } }) => (
                    <button
                        className={`flex h-10 max-w-xxxs items-center text-gray-400 md:h-12 xxl:h-14 ${
                            original.status !== "ACTIVE" ? "cursor-not-allowed" : "curson-pointer hover:text-primary-200"
                        }`}
                        onClick={() => switchOperator(original)}
                        disabled={original.status !== "ACTIVE"}>
                        <ForwardIcon
                            className="mx-auto"
                            width="1.25rem"
                            height="1.25rem"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="currentColor"
                        />
                    </button>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    let loadingSkeleton = [];

    for (let i = 0; i < 12; i++) {
        loadingSkeleton.push(<TableSkeleton number={6} key={i} />);
    }

    const orderStyle = {
        fontSize: "0.813rem",
        color: "#00B3C7",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.75rem",
        lineHeight: "1rem",
        fontWeight: "bold",
        borderBottomWidth: "0.094rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
    };

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1rem",
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
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        backgroundColor: "#ffffff",
    };

    const switchOperator = (data) => {
        setConversations(data);
        setForward(true);
    };

    if (loading) {
        return (
            <div className="inline-block min-w-full max-w-full flex-1 overflow-y-auto overflow-x-hidden bg-white px-5 align-middle sm:px-0">
                <Styles>
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={`sticky top-0 ${column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}`}
                                            style={headerStyles}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>{loadingSkeleton}</tbody>
                    </table>
                </Styles>
            </div>
        );
    }

    if (isEmpty(data)) {
        return (
            <div className="inline-block min-w-full max-w-full flex-1 overflow-y-auto overflow-x-hidden rounded-b-xl bg-white px-5 align-middle sm:px-0">
                <Styles>
                    <table {...getTableProps()} className="min-w-full">
                        <thead className="sticky top-0">
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
                </Styles>
                <div className="flex justify-center">
                    <div className="text-gray-475 flex h-72 items-center">
                        {t("monitoring.No existen casos actuales en el operador seleccionado")}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-2 overflow-y-auto rounded-b-xl bg-white">
            <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                <Styles>
                    <table {...getTableProps()} className="min-w-full">
                        <thead className="sticky top-0">
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={column.isSorted ? orderStyle : headerStyles}
                                            className="sticky top-0">
                                            <span className="flex">
                                                {column.render("Header")}
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <DownIcon className="ml-1" width="0.938rem" fill="#00B3C7" />
                                                    ) : (
                                                        <DownIcon className="ml-1 rotate-180 transform" width="0.938rem" fill="#00B3C7" />
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </span>
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
                </Styles>
                {/* Pagination */}
                <div className="sticky bottom-0 flex w-full items-center justify-between rounded-b-xl border-t-1 border-gray-400 border-opacity-25 bg-white px-4 py-3 sm:px-6">
                    <div className="flex items-center sm:w-1/3">
                        {page === 1 ? (
                            <button className="mr-2 cursor-not-allowed p-2">
                                <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                            </button>
                        ) : (
                            <button className="mr-2 cursor-pointer p-2" onClick={() => setPage(page - 1)}>
                                <div className="h-6 w-6 text-gray-375">{"<"}</div>
                            </button>
                        )}
                        <div className="relative text-xs text-gray-375">
                            {" "}
                            {page} de {maxPage}
                        </div>
                        {page === maxPage ? (
                            <button className="cursor-not-allowed p-2">
                                <div className="h-6 w-6 text-gray-400/75">{">"}</div>
                            </button>
                        ) : (
                            <button className="p-2" onClick={() => setPage(page + 1)}>
                                <div className="h-6 w-6 text-gray-375"> {">"}</div>
                            </button>
                        )}
                    </div>
                    <div className="flex justify-center space-x-1 text-13 text-gray-400 sm:w-1/3">
                        <span className="font-semibold text-primary-200">{totalResults}</span>
                        <span>{t("clients.results")}</span>
                    </div>
                    <div className="flex justify-end text-gray-400 sm:w-1/3">
                        <div className="flex sm:w-1/5">
                            <select
                                className="mr-10 flex cursor-pointer appearance-none justify-between border-transparent text-sm leading-5 text-gray-500"
                                value={nrows}
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
                {forward && <SwitchOperator textObj={{ button: "Transferir" }} setForward={setForward} conversation={conversation} />}
            </div>
        </div>
    );
};
export default withTranslation()(ActualCasesTable);
