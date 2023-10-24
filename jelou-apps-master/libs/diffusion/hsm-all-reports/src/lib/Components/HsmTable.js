import { TableSkeleton } from "@apps/shared/common";
import { DownIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import truncate from "lodash/truncate";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useSortBy, useTable } from "react-table";

const HsmTable = (props) => {
    const { data, pageLimit, setPageLimit, row, setRows, maxPage, totalResults, isLoading } = props;
    const { t } = useTranslation();

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
        borderBottomWidth: "0.05rem",
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

    const orderStyle = {
        fontSize: "0.813rem",
        color: "#00B3C7",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.5rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.75rem",
        lineHeight: "1rem",
        fontWeight: "bold",
        borderBottomWidth: "0.094rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
    };

    const color = (values) => {
        if (toUpper(values) === "CREATED") {
            return "text-gray-39";
        }
        if (toUpper(values) === "DELIVERED_USER") {
            return "text-primary-200 bg-primary-20";
        }
        if (toUpper(values) === "FAILED") {
            return "text-red-1050 bg-red-15";
        } else {
            return "text-yellow-400 bg-yellow-20";
        }
    };

    const Badge = ({ values }) => {
        let arr = [values];
        let value = first(arr);

        const { sentStatus } = value;
        const message = get(value, "error", "");

        return sentStatus === "FAILED" ? (
            <Tippy arrow={true} theme="jelou" content={message} placement="bottom">
                <span className={`inline-flex cursor-pointer items-center rounded-xl px-3 py-1 font-bold ${color(sentStatus)}`}>{t(`hsm.${sentStatus}`)}</span>
            </Tippy>
        ) : (
            <div>
                <span className={`inline-flex items-center rounded-xl px-3 py-1 font-bold ${color(sentStatus)}`}>{t(`hsm.${sentStatus}`)}</span>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: t("HSMTable.addressee"),
                accessor: "destination", // accessor is the "key" in the data
                Cell: ({ row: { original } }) => {
                    return original.destination;
                },
            },
            {
                Header: t("HSMTable.status"),
                accessor: "sentStatus",
                Cell: ({ row: { original } }) => <Badge values={original} />,
            },
            {
                Header: t("HSMTable.sendDate"),
                accessor: (row) => dayjs(row.sentDate).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
                Header: t("HSMTable.origin"),
                accessor: (row) => t(`HSMTable.${get(row, "origin")}`),
            },
            {
                Header: t("HSMTable.operator"),
                accessor: (row) => {
                    return truncate(get(row, "operatorName", "--"), {
                        length: "25",
                    });
                },
            },
            {
                Header: t("HSMTable.template"),
                accessor: (row) => get(row, "elementName", "--"),
            },
            {
                Header: t("HSMTable.campaign"),
                accessor: (row) => {
                    return truncate(get(row, "campaignName", "--"), {
                        length: "30",
                    });
                },
            },
            {
                id: t("HSMTable.configuration"),
                Header: t("Configuración"),
                accessor: (row) => get(row, "metadata.actions.campaignConfigurationName", " - "),
            },
        ],
        [data]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useSortBy, usePagination);

    let loadingSkeleton = [];

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} key={i} />);
    }

    if (isLoading) {
        return (
            <div className="mb-2 rounded-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full overflow-hidden rounded-xl bg-white align-middle">
                        <table {...getTableProps()} className="min-w-full rounded-md">
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                                style={headerStyles}
                                            >
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>{loadingSkeleton}</tbody>
                        </table>
                        <div className="flex items-center justify-between border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty(data)) {
        return (
            <div className="mb-2 rounded-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full overflow-hidden rounded-xl bg-white align-middle">
                        <table {...getTableProps()} className="min-w-full">
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                                style={headerStyles}
                                            >
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                        </table>
                        <div className="flex justify-center">
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("hsm.noReports")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto rounded-xl bg-white">
            <div className="inline-block min-w-full max-w-full rounded-xl bg-white align-middle">
                <table {...getTableProps()} className="min-w-full border-separate rounded-xs" id="client-table">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={column.isSorted ? orderStyle : headerStyles} className="sticky top-0">
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
                        {rows.map((row, index) => {
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
            </div>
            <div className="sticky bottom-0 flex w-full items-center justify-between rounded-b-xl border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center sm:w-1/3">
                    {pageLimit === 1 ? (
                        <button className="mr-2 cursor-not-allowed p-2">
                            <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                        </button>
                    ) : (
                        <button className="mr-2 cursor-pointer p-2" onClick={() => setPageLimit(pageLimit - 1)}>
                            <div className="h-6 w-6 text-gray-375">{"<"}</div>
                        </button>
                    )}
                    <div className="relative text-xs text-gray-375">
                        {" "}
                        {pageLimit} de {maxPage}
                    </div>
                    {pageLimit === maxPage ? (
                        <button className="cursor-not-allowed p-2">
                            <div className="h-6 w-6 text-gray-400/75">{">"}</div>
                        </button>
                    ) : (
                        <button className="p-2" onClick={() => setPageLimit(pageLimit + 1)}>
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
                            className="select flex appearance-none justify-end border-none text-sm leading-5 !text-gray-400 outline-none ring-transparent focus:ring-transparent"
                            value={row}
                            onChange={(e) => {
                                setRows(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} {t("clients.rows")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HsmTable;
