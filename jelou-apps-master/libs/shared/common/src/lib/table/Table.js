import { useExpanded, usePagination, useSortBy, useTable } from "react-table";
import { useSticky } from "react-table-sticky";

import { DownIcon } from "@apps/shared/icons";

import TableSkeleton from "../skeleton/TableSkeleton";

import isEmpty from "lodash/isEmpty";
import { withTranslation } from "react-i18next";

const Table = (props) => {
    const { loading, columns, data, pageLimit, setPageLimit, maxPage, row, setRows, noDataMessage, loadingColumns, t } = props;

    let loadingSkeleton = [];

    for (let i = 0; i < loadingColumns; i++) {
        loadingSkeleton.push(<TableSkeleton number={loadingColumns} key={i} />);
    }

    const headerStyles = {
        fontSize: "0.813rem",
        letterSpacing: "0.05em",
        color: "#31355C",
        textAlign: "left",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderBottomWidth: "0.125rem",
        borderColor: "#45474B",
        backgroundColor: "#ffffff",
    };

    const cellStyles = {
        fontSize: "0.813rem",
        whiteSpace: "nowrap",
        color: "#707C97",
        textAlign: "left",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        backgroundColor: "#ffffff",
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useSortBy, useExpanded, usePagination, useSticky);

    return loading ? (
        <div className="rounded-b-1 bg-white py-5">
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
                    <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-6"></div>
                </div>
            </div>
        </div>
    ) : isEmpty(data) ? (
        <div className="rounded-b-1 bg-white py-5">
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
                        <div className="flex h-72 items-center text-gray-400 text-opacity-50">{t(noDataMessage)}</div>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-3">
                    <div className="flex sm:w-1/3">
                        {pageLimit === 1 ? (
                            <button className="bg-inactive-100 mr-2 cursor-not-allowed rounded-full p-2">
                                <div className="h-6 w-6 text-gray-400 opacity-50">{"<"}</div>
                            </button>
                        ) : (
                            <button className="bg-inactive-200 mr-2 cursor-pointer rounded-full p-2" onClick={() => setPageLimit(pageLimit - 1)}>
                                <div className="h-6 w-6 text-gray-400 opacity-50">{"<"}</div>
                            </button>
                        )}
                        {pageLimit === maxPage ? (
                            <button className="bg-inactive-100 cursor-not-allowed rounded-full p-2">
                                <div className="h-6 w-6 text-gray-400 opacity-50">{">"}</div>
                            </button>
                        ) : (
                            <button className="bg-inactive-200 rounded-full p-2" onClick={() => setPageLimit(pageLimit + 1)}>
                                <div className="h-6 w-6 text-gray-400 opacity-50"> {">"}</div>
                            </button>
                        )}
                    </div>
                    <div className="relative w-24">
                        <select
                            className="flex appearance-none justify-between text-sm leading-5 text-gray-500"
                            value={row}
                            onChange={(e) => {
                                setRows(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} {t("common.rows")}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-primary-200">
                            <DownIcon width="1.25rem" height="1.25rem" className="fill-current" stroke="currentColor" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="rounded-b-1 bg-white py-5">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full bg-white align-middle sm:rounded-lg">
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
                            {pageLimit === 1 ? (
                                <button className="bg-inactive-100 mr-2 cursor-not-allowed rounded-full p-2">
                                    <div className="h-6 w-6 text-gray-400 opacity-50">{"<"}</div>
                                </button>
                            ) : (
                                <button className="bg-inactive-200 mr-2 cursor-pointer rounded-full p-2" onClick={() => setPageLimit(pageLimit - 1)}>
                                    <div className="h-6 w-6 text-gray-400 opacity-50">{"<"}</div>
                                </button>
                            )}
                            {pageLimit === maxPage ? (
                                <button className="bg-inactive-100 cursor-not-allowed rounded-full p-2">
                                    <div className="h-6 w-6 text-gray-400 opacity-50">{">"}</div>
                                </button>
                            ) : (
                                <button className="bg-inactive-200 rounded-full p-2" onClick={() => setPageLimit(pageLimit + 1)}>
                                    <div className="h-6 w-6 text-gray-400 opacity-50"> {">"}</div>
                                </button>
                            )}
                        </div>
                        <div className="relative w-24">
                            <select
                                className="flex appearance-none justify-between text-sm leading-5 text-gray-500"
                                value={row}
                                onChange={(e) => {
                                    setRows(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize} {t("common.rows")}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-primary-200">
                                <DownIcon width="1.25rem" height="1.25rem" className="fill-current" stroke="currentColor" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default withTranslation()(Table);
