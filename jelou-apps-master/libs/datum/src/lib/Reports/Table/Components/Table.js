import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { DownIcon } from "@apps/shared/icons";
import TableSkeleton from "./TableSkeleton";
import { Pagination } from "./Pagination";

const orderStyle = {
    fontSize: "0.8125rem",
    color: "#00B3C7",
    textAlign: "left",
    paddingLeft: "1.5rem",
    paddingRight: "1rem",
    paddingBottom: "0.5rem",
    paddingTop: "0.5rem",
    lineHeight: "1rem",
    fontWeight: "regular",
    backgroundColor: "#ffffff",
    cursor: "pointer",
};

const headerStyles = {
    cursor: "pointer",
    fontSize: "0.8125rem",
    color: "#707C95",
    textAlign: "left",
    paddingLeft: "1.5rem",
    paddingRight: "1rem",
    paddingBottom: "0.5rem",
    paddingTop: "0.5rem",
    lineHeight: "1rem",
    fontWeight: 700,
    borderColor: "rgba(166, 180, 208, 0.25)",
    backgroundColor: "#ffffff",
};

const cellStyles = {
    fontSize: "0.875rem",
    color: "#727C94",
    textAlign: "left",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    paddingBottom: "1rem",
    paddingTop: "1rem",
    lineHeight: "1.25rem",
    backgroundColor: "#ffffff",
};

const Styles = styled.div`
    display: block;
    max-width: 100%;
    position: relative;

    .tableWrap {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        width: 100%;
    }

    table {
        width: 100%;
        border-spacing: 0;
        table-layout: auto;

        /* tr {
            :last-child {
                td {
                    border-bottom: 0px !important;
                }
            }
        } */

        th,
        td {
            margin: 0;
            padding: 0.5rem;

            &:last-child {
                width: ${(props) => (props.database ? "2rem" : "1%")};
            }

            &.collapse {
                width: 0.0000000001%;
            }
        }

        td {
            border-bottom: 1px solid rgba(166, 180, 208, 0.25) !important;
            border-right: 1px solid rgba(166, 180, 208, 0.25) !important;
        }
        th {
            min-width: 9rem;
            border: 1px solid rgba(166, 180, 208, 0.25) !important;
            :first-child {
                border-left: none !important;
            }
        }
    }

    .pagination {
        padding: 0.5rem;
    }
`;

const Table = ({ columns, data, setLimit, setPage, loading, database = false, paginationData, currentPage } = {}) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        usePagination,
        useRowSelect
    );

    const { t } = useTranslation();

    const loadingSkeleton = [];
    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} columns={columns} key={i} />);
    }

    // Loading
    if (loading) {
        return (
            <>
                <div className="h-full tableWrap">
                    <table {...getTableProps()} className="min-w-full max-h-90 h-90">
                        <thead>
                            {headerGroups.map((headerGroup, i) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                                    {headerGroup.headers.map((column, i) => {
                                        return (
                                            <th
                                                {...column.getHeaderProps()}
                                                style={{
                                                    ...column.getHeaderProps().style,
                                                    ...headerStyles,
                                                    ...(column.width ? { minWidth: column.width } : {}),
                                                }}
                                                key={i}>
                                                <div className="grid items-center justify-start grid-flow-col grid-rows-none gap-2">
                                                    <h3>{column.render("Header")}</h3>
                                                    <DownIcon className="ml-1" width="0.938rem" fill="#707C95" />
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>{loadingSkeleton}</tbody>
                    </table>
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
                /> */}
            </>
        );
    }

    return (
        <Styles database={database}>
            <div className="overflow-hidden bg-white h-table">
                <div className="overflow-auto h-table">
                    <div>
                        <table {...getTableProps()}>
                            <thead className="sticky top-0">
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => {
                                            return (
                                                <th
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                    style={column.isSorted ? orderStyle : headerStyles}>
                                                    <div className="grid items-center justify-start grid-flow-col grid-rows-none gap-2 min-w">
                                                        {column.render("Header")}
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <DownIcon className="ml-1" width="0.938rem" fill="#00B3C7" />
                                                            ) : (
                                                                <DownIcon className="ml-1 transform rotate-180" width="0.938rem" fill="#00B3C7" />
                                                            )
                                                        ) : (
                                                            column.render("Header") !== t("AdminFilters.actions") && (
                                                                <div>
                                                                    <DownIcon className="ml-1" width="0.938rem" fill="#707C95" />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </th>
                                            );
                                        })}
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
                    </div>
                </div>
            </div>
            <Pagination paginationData={paginationData} currentPage={currentPage} setCurrentPage={setPage} setPerPage={setLimit} />
        </Styles>
    );
};

export default Table;
