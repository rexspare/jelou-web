import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { withTranslation } from "react-i18next";
import { useTable, useSortBy, usePagination } from "react-table";

import { TableSkeleton } from "@apps/shared/common";
// import TableSkeleton from "../../Common/Skeleton/TableSkeleton";

const MissedConversations = (props) => {
    const { data, loading, pageLimit, setPageLimit, maxPage, row, setRows, t } = props;

    const Badge = ({ values }) => {
        const badgeStyle = "min-w-24 justify-center inline-flex items-center px-3 py-1 rounded-full text-xs font-medium leading-4 uppercase";
        switch (toUpper(values)) {
            case "NO RECUPERADO":
                return <span className={`${badgeStyle} bg-red-200 text-red-800`}>{t("No Recuperado")}</span>;
            case "RECUPERADO":
                return <span className={`${badgeStyle} bg-teal-200 text-teal-800`}>{t("Recuperado")}</span>;
            case "APLICA":
                return <span className={`${badgeStyle} bg-teal-200 text-teal-800`}>{t("Aplica")}</span>;
            case "NO APLICA":
                return <span className={`${badgeStyle} bg-red-200 text-red-800`}>{t("No Aplica")}</span>;
            default:
                return <span className="inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-orange-400">{t("-")}</span>;
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.No. Cliente"),
                accessor: (row) => row.referenceId.replace("@c.us", ""),
                Cell: ({ row: { original } }) => {
                    return <div className="max-w-xxs truncate text-left">{original.referenceId.replace("@c.us", "")}</div>;
                },
            },
            {
                Header: t("Bot"),
                accessor: "botName",
            },
            {
                Header: t("monitoring.Estado"),
                accessor: "status",
                Cell: ({ cell: { value } }) => <Badge values={value} />,
            },
            {
                Header: t("monitoring.Flujo"),
                accessor: "flowName",
            },
            {
                Header: t("monitoring.Recuperable"),
                accessor: "recoverable",
                Cell: ({ cell: { value } }) => <Badge values={value} />,
            },
            {
                Header: t("monitoring.Fecha"),
                accessor: (row) => `${dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")}`,
            },
            {
                Header: t("monitoring.Tipo"),
                accessor: (row) => get(row, "type", "-"),
            },
        ],
        [t]
    );

    let loadingSkeleton = [];

    for (let i = 0; i < 4; i++) {
        loadingSkeleton.push(<TableSkeleton number={5} key={i} />);
    }

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

    const headerStylesEmpty = {
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    return loading ? (
        <div className="rounded-b-xl bg-white">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full max-w-full bg-white align-middle">
                    {" "}
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
                </div>
            </div>
            <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-6"></div>
        </div>
    ) : isEmpty(data) ? (
        <div className="rounded-b-xl bg-white">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full max-w-full bg-white align-middle">
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                            style={headerStylesEmpty}>
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
                <div className="flex h-72 items-center text-gray-400 opacity-50">No existen reportes en el bot seleccionado</div>
            </div>
            <div className="border-sm:px-6 flex items-center justify-between rounded-b-xl border-t-2 border-gray-100/25 bg-white px-4 py-3"></div>
        </div>
    ) : (
        <div className="rounded-b-xl bg-white">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full bg-white align-middle sm:rounded-xl">
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
                    <div className="border-sm:px-6 flex items-center justify-between rounded-b-xl border-t-2 border-gray-100/25 bg-white px-4 py-3">
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

export default withTranslation()(MissedConversations);
