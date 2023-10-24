import { useTable, useSortBy, usePagination, useExpanded } from "react-table";
import { useSticky } from "react-table-sticky";
import { Styles } from "./table-container";

import { DownIcon } from "@apps/shared/icons";
import { TableSkeleton } from "@apps/shared/common";

import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

const Table = (props) => {
    const { data, columns, loading, actualPage, setActualPage, maxPage, row, setRows, totalResults, noDataMessage, loadingColumns } = props;

    const { t } = useTranslation();

    let loadingSkeleton = [];

    for (let i = 0; i < loadingColumns; i++) {
        loadingSkeleton.push(<TableSkeleton number={loadingColumns} key={i} />);
    }

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
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        position: "relative",
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        useExpanded,
        usePagination,
        useSticky
    );

    if (loading) {
        return (
            <div className="mb-2 rounded-b-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                        <Styles>
                            <table {...getTableProps()} className="min-w-full rounded-md">
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
                        </Styles>
                        <div className="flex items-center justify-between border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty(data)) {
        return (
            <div className="mb-2 rounded-b-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                        <Styles>
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
                        </Styles>
                        <div className="flex justify-center">
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t(noDataMessage)}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-b-xl border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="rounded-b-xl bg-white py-5">
            <Styles>
                <div className="overflow-x-auto">
                    <table {...getTableProps()} className="tableContainer min-w-full rounded-xs" id="client-table">
                        <thead>
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
            </Styles>
            <div className="border-sm:px-6 sticky bottom-0 flex items-center justify-between border-t-1 border-gray-400 border-opacity-25 bg-white px-4 py-3">
                <div className="flex items-center sm:w-1/3">
                    <button
                        className="mr-2 mb-0.25 disabled:cursor-not-allowed disabled:text-gray-400/75 disabled:opacity-50"
                        disabled={actualPage === 1}
                        onClick={() => setActualPage(actualPage - 1)}>
                        <div className="h-6 w-6 text-gray-375">{"<"}</div>
                    </button>
                    <div className="relative text-xs text-gray-375">
                        {actualPage} de {maxPage}
                    </div>
                    <button
                        disabled={actualPage === maxPage}
                        className="ml-2 mb-0.25 disabled:cursor-not-allowed disabled:text-gray-400/75 disabled:opacity-50"
                        onClick={() => setActualPage(actualPage + 1)}>
                        <div className="h-6 w-6 text-gray-375"> {">"}</div>
                    </button>
                </div>
                <div className="flex justify-center space-x-1 text-13 text-gray-400 sm:w-1/3">
                    <span className="font-semibold text-primary-200">{totalResults}</span>
                    <span>{t("clients.results")}</span>
                </div>
                <div className="relative flex flex-1 justify-end">
                    <select
                        className="flex appearance-none border-none text-sm leading-5 text-gray-400 text-opacity-75 outline-none ring-transparent focus:ring-transparent"
                        value={row}
                        onChange={(e) => {
                            setRows(Number(e.target.value));
                        }}>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} {t("monitoring.filas")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
export default Table;
