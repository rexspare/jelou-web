import React, { useEffect, useMemo, useState } from "react";
import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { withTranslation } from "react-i18next";
import { useTable, useSortBy, usePagination } from "react-table";

import { TableSkeleton } from "@apps/shared/common";

const LogsTable = (props) => {
    const { data, isLoadingLogs, nrows, pageLimit, setPageLimit, maxPage, setRows, t, operatorId, totalResults } = props;
    const [extraColumns, setExtraColumns] = useState([]);

    useEffect(() => {
        if (operatorId === "-1") {
            setExtraColumns([
                {
                    Header: "Operador",
                    accessor: (row) => get(row, "operator.name", "-"),
                },
                {
                    Header: "Equipo",
                    accessor: (row) => {
                        const teams = get(row, "operator.teams", []);

                        if (isEmpty(teams)) {
                            return <div className="ml-5 flex">--</div>;
                        } else {
                            return (
                                <Tippy
                                    content={teams.map((team, key) => (
                                        <li key={key}> {team.name}</li>
                                    ))}
                                    placement={"top"}
                                    touch={false}
                                    arrow={false}
                                    theme={"jelou"}>
                                    <div className="max-w-cell truncate">
                                        {teams.map((team, key) => (
                                            <span key={key}>{`${key !== row.operator.teams.lenght && key !== 0 ? ", " : " "}${team.name}`}</span>
                                        ))}
                                    </div>
                                </Tippy>
                            );
                        }
                    },
                },
            ]);
        } else {
            setExtraColumns([]);
        }
    }, [operatorId]);

    const Badge = ({ values }) => {
        const pointStyle = "h-2 w-2 rounded-full shadow-solid";
        const style = "px-2 inline-flex text-sm leading-5 font-medium";
        switch (toUpper(values)) {
            case "LOGIN":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-green-960`}></span>
                        <span className={`${style} text-green-960`}>{t("monitoring.Inicio de Sesión")}</span>
                    </div>
                );
            case "ONLINE":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-[#67AB2D]`}></span>
                        <span className={`${style} text-[#67AB2D]`}>{t("monitoring.Conectado")}</span>
                    </div>
                );
            case "OFFLINE":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-red-1010`}></span>
                        <span className={`${style} text-red-1010`}>{t("monitoring.Desconectado")}</span>
                    </div>
                );
            case "LOGOUT_UNIQUE_SESSION":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-red-1010`}></span>
                        <span className={`${style} text-red-1010`}>{t("monitoring.Desconectado")}</span>
                    </div>
                );
            case "LOGOUT":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-gray-500`}></span>
                        <span className={`${style} text-gray-500`}>{t("monitoring.Cierre de Sesión")}</span>
                    </div>
                );
            case "BUSY":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-yellow-1020`}></span>
                        <span className={`${style} text-yellow-1020`}>{t("monitoring.No disponible")}</span>
                    </div>
                );
            case "LOGOUT_INACTIVITY":
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-red-675`}></span>
                        <span className={`${style} text-red-675`}>{t("monitoring.Inactividad")}</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center">
                        <span className={`${pointStyle} bg-gray-500`}></span>
                        <span className={`${style} text-gray-500`}>{t("monitoring.Indefinido")}</span>
                    </div>
                );
        }
    };

    const columns = useMemo(
        () =>
            extraColumns.concat([
                {
                    Header: t("monitoring.Evento"),
                    accessor: "event",
                    Cell: ({ cell: { value } }) => <Badge values={value} />,
                },
                {
                    Header: t("monitoring.Fecha"),
                    accessor: (row) => `${dayjs(row.createdAt).format("DD-MM-YYYY / HH:mm:ss")}`,
                },
                {
                    Header: "IP",
                    accessor: (row) => get(row, "ip", "-"),
                },
                {
                    Header: t("monitoring.Plataforma"),
                    accessor: (row) => {
                        switch (toUpper(get(row.extraData, "os.name", "-"))) {
                            case "SYSTEM":
                                return `${get(row.extraData, "browser.name", "")} - System`;
                            default:
                                return `${get(row.extraData, "browser.name", "")} - ${get(row.extraData, "os.name", "")}`;
                        }
                    },
                    Cell: ({ cell: { value } }) => <span className="capitalize">{value}</span>,
                },
            ]),
        [extraColumns, t, data]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    let loadingSkeleton = [];

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={operatorId !== "-1" ? 5 : 7} key={i} />);
    }

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.8rem",
        paddingRight: "1rem",
        paddingBottom: "0.75rem",
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

    if (isLoadingLogs) {
        return (
            <div className="inline-block min-w-full max-w-full overflow-y-auto rounded-b-xl bg-white px-5 align-middle sm:px-0">
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
        );
    }

    if (isEmpty(data)) {
        return (
            <div className="inline-block min-w-full max-w-full overflow-y-auto rounded-b-xl bg-white px-5 align-middle sm:px-0">
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
                <div className="flex justify-center">
                    <div className="flex h-72 items-center text-gray-475 opacity-50">
                        {t("No existen casos actuales en el operador seleccionado")}
                    </div>
                </div>
                <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-3"></div>
            </div>
        );
    }

    return (
        <div className="inline-block max-h-modal min-w-full max-w-full overflow-x-auto overflow-y-auto rounded-b-xl bg-white align-middle lg:overflow-x-hidden">
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
            {/* Pagination */}
            <div className="sticky inset-x-0 bottom-0 flex w-full items-center justify-between rounded-b-xl border-t-1 border-gray-400 border-opacity-25 bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center sm:w-1/3">
                    {pageLimit === 1 ? (
                        <button className="mr-2 cursor-not-allowed p-2">
                            <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                        </button>
                    ) : (
                        <button
                            className="mr-2 cursor-pointer p-2"
                            onClick={() => {
                                setPageLimit(pageLimit - 1);
                            }}>
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
                    {/* <div className="flex sm:w-1/5"> */}
                    <select
                        className="mr-5 flex cursor-pointer appearance-none justify-between border-transparent text-sm leading-5 text-gray-500"
                        value={nrows}
                        onChange={(e) => {
                            setRows(Number(e.target.value));
                            setPageLimit(1);
                        }}>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} {t("monitoring.filas")}
                            </option>
                        ))}
                    </select>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};
export default withTranslation()(LogsTable);
