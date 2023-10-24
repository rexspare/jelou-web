import get from "lodash/get";

import { useTable, usePagination, useSortBy } from "react-table";
import styled from "styled-components";
import isEqual from "lodash/isEqual";
import { DownIcon } from "@apps/shared/icons";
import { TableSkeleton } from "@apps/shared/common";
import { useTranslation } from "react-i18next";
import { memo } from "react";

const orderStyle = {
    fontSize: "0.75rem",
    color: "#00B3C7",
    textAlign: "left",
    paddingLeft: "1.5rem",
    paddingRight: "0.5rem",
    lineHeight: "1rem",
    fontWeight: "bold",
    borderBottomWidth: "0.094rem",
    borderColor: "rgba(166, 180, 208, 0.25)",
    backgroundColor: "#ffffff",
};

const headerStyles = {
    fontSize: "0.75rem",
    color: "#727C94",
    textAlign: "left",
    paddingLeft: "1.8rem",
    paddingRight: "1rem",
    paddingBottom: "0.5rem",
    paddingTop: "0.5rem",
    lineHeight: "0.875rem",
    fontWeight: 400,
    borderBottomWidth: "0.094rem",
    borderColor: "rgba(166, 180, 208, 0.25)",
    backgroundColor: "#ffffff",
};

const cellStyles = {
    fontSize: "0.9375rem",
    whiteSpace: "nowrap",
    textAlign: "left",
    lineHeight: "1.25rem",
};

const Styles = styled.div`
    display: flex;
    flex: 1 1 0%;
    max-width: 100%;
    height: 100%;

    .tableWrap {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
    }

    table {
        width: 100%;
        border-spacing: 0;
        table-layout: auto;
        border-collapse: separate;

        tr {
            td:first-child {
                padding: 0px 0px 0px 1.4375rem !important;
                width: 0% !important;
            }

            td:nth-child(2) {
                padding: 0px 0px 0px 0.9375rem !important;
                width: 0% !important;
            }

            th:first-child {
                padding: 0px 0px 0px 1.4375rem !important;
                width: 0% !important;
            }

            th:nth-child(2) {
                padding: 0px 0px 0px 0.9375rem !important;
                width: 0% !important;
            }
        }

        tr {
            cursor: pointer;

            :last-child {
                td {
                    border-bottom: 0px !important;
                }
            }
            color: #727c94;
        }

        th,
        td {
            margin: 0;
            width: 1%;
            &.collapse {
                width: 0.0000000001%;
            }
        }

        td.selected {
            font-weight: 700;
            color: #727c94 !important;
            background-color: #00b3c714 !important;
        }

        td {
            font-size: 13px !important;
            font-weight: 400;
            padding-left: 1.5rem;
            padding-right: 0.5rem;
            height: 3.125rem !important;
            border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important;
        }
    }

    .pagination {
        padding: 0.5625rem;
    }
`;

const EmailTable = ({ columns, data, totalPages, actualPage, setActualPage, actualEmails, nrows, setRows, loading, onClick }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            manualPagination: true,
        },
        useSortBy,
        usePagination
    );

    const { t } = useTranslation();

    let loadingSkeleton = [];

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} key={i} />);
    }

    if (loading) {
        return (
            <Styles>
                <div className="flex-1 overflow-x-hidden bg-white">
                    <div className="inline-block w-full overflow-x-auto bg-white align-middle">
                        <table {...getTableProps()} id="user-table">
                            <thead className="border-t-default !border-[#A6B4D040]">
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())} style={headerStyles}>
                                                <span className="flex">{column.render("Header")}</span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>{loadingSkeleton}</tbody>
                        </table>
                    </div>
                </div>
                {/* <Pagination
                    gotoPage={gotoPage}
                    canPreviousPage={canPreviousPage}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    canNextPage={canNextPage}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    total={total}
                    actualPage={actualPage}
                    setActualPage={setActualPage}
                    totalPages={totalPages}
                /> */}
            </Styles>
        );
    }

    return (
        <div>
            <Styles>
                <div className="flex-1 overflow-x-hidden bg-white pb-1">
                    <div className="inline-block w-full overflow-x-auto bg-white align-middle">
                        <table {...getTableProps()} id="user-table">
                            <thead className="">
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th
                                                className="border-t-default !border-[#A6B4D040]"
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                style={column.isSorted ? orderStyle : headerStyles}>
                                                {column.render("Header")}
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <DownIcon className="ml-1 fill-current text-primary-200" width="0.938rem" />
                                                    ) : (
                                                        <DownIcon
                                                            className="ml-1 rotate-180 transform fill-current text-primary-200"
                                                            width="0.938rem"
                                                        />
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr className="hover:bg-primary-400 hover:bg-opacity-30 hover:text-primary-200" {...row.getRowProps()}>
                                            {row.cells.map((cell, index) => {
                                                if (index === 0 || index === 1 || index === 7) {
                                                    return (
                                                        <td
                                                            className={`${
                                                                get(cell, "row.isSelected", false)
                                                                    ? "selected"
                                                                    : get(cell, "row.original.read", false)
                                                                    ? "read"
                                                                    : "unread"
                                                            }`}
                                                            {...cell.getCellProps()}
                                                            style={cellStyles}>
                                                            {cell.render("Cell")}
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td
                                                            className={`${
                                                                get(cell, "row.isSelected", false)
                                                                    ? "selected"
                                                                    : get(cell, "row.original.read", false)
                                                                    ? "read"
                                                                    : "unread"
                                                            }`}
                                                            {...cell.getCellProps()}
                                                            style={cellStyles}
                                                            onClick={() => onClick(row.original)}>
                                                            {cell.render("Cell")}
                                                        </td>
                                                    );
                                                }
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Styles>

            <div className="sticky bottom-0 flex w-full items-center justify-between rounded-b-xl border-t-1 border-gray-400 border-opacity-25 bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center sm:w-1/3">
                    {actualPage === 1 ? (
                        <button className="mr-2 cursor-not-allowed p-2">
                            <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                        </button>
                    ) : (
                        <button className="mr-2 cursor-pointer p-2" onClick={() => setActualPage(actualPage - 1)}>
                            <div className="text-gray-375 h-6 w-6">{"<"}</div>
                        </button>
                    )}
                    <div className="text-gray-375 relative text-xs">
                        {actualPage} {t("monitoring.of")} {totalPages}
                    </div>
                    {actualPage === totalPages ? (
                        <button className="cursor-not-allowed p-2">
                            <div className="h-6 w-6 text-gray-400/75">{">"}</div>
                        </button>
                    ) : (
                        <button className="p-2" onClick={() => setActualPage(actualPage + 1)}>
                            <div className="text-gray-375 h-6 w-6"> {">"}</div>
                        </button>
                    )}
                </div>
                <div className="flex justify-center space-x-1 text-13 text-gray-400 sm:w-1/3">
                    <span className="font-semibold text-primary-200">{actualEmails}</span>
                    <span>{t("clients.results")}</span>
                </div>
                <div className="flex justify-end text-gray-400 sm:w-1/3">
                    <div className="flex">
                        <select
                            className="mr-10 flex cursor-pointer appearance-none justify-between border-transparent text-sm leading-5 text-gray-500 outline-none ring-transparent focus:outline-none focus:ring-transparent"
                            value={nrows}
                            onChange={(e) => {
                                setRows(Number(e.target.value));
                            }}>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} {t("monitoring.rows")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

const customComparator = (prevProps, nextProps) => {
    const prevList = prevProps.data || [];
    let dataEqual = true;
    prevList.forEach((objEl, index) => {
        const equalResult = isEqual(objEl, nextProps.data[index]);
        if (!equalResult) {
            dataEqual = false;
        }
    });
    return (
        nextProps.columns.length === prevProps.columns.length &&
        // nextProps.data === prevProps.data &&
        dataEqual &&
        prevProps.actualPage === nextProps.actualPage &&
        prevProps.nrows === nextProps.nrows &&
        prevProps.loading === nextProps.loading &&
        prevProps.totalPages === nextProps.totalPages &&
        prevProps.actualEmails === nextProps.actualEmails
    );
};

export default memo(EmailTable, customComparator);
