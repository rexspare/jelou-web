import React, { useEffect, useLayoutEffect } from "react";
import { useTable, usePagination, useSortBy, useRowSelect, useMountedLayoutEffect } from "react-table";
import styled from "styled-components";
import get from "lodash/get";

/* Components */
import Pagination from "./pagination";
import TableSkeleton from "./table-skeleton";
import { DownIcon } from "@apps/shared/icons";

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
    color: "#727C94",
    textAlign: "left",
    lineHeight: "1.25rem",
    backgroundColor: "#ffffff",
};

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <div>
            <input
                className="h-4 w-4 rounded-default border-2 border-gray-400 border-opacity-[0.59] text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                id="hasBroadcast"
                type="checkbox"
                ref={resolvedRef}
                {...rest}
            />
        </div>
    );
});

const Table = ({
    columns,
    data,
    actualPage,
    setActualPage,
    loading,
    onClick,
    total,
    totalPages,
    selectedRows,
    onSelectedRowsChange,
    setDataRow,
    number,
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            manualPagination: true,
            initialState: { selectedRowIds: selectedRows },
        },
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div className="flex items-center">
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div className="flex items-center">
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );

    const loadingSkeleton = [];

    for (let i = 0; i < number; i++) {
        loadingSkeleton.push(<TableSkeleton number={8} key={i} />);
    }

    useEffect(() => {
        onSelectedRowsChange(selectedRowIds);
        setDataRow(selectedFlatRows);
    }, [onSelectedRowsChange, selectedRowIds]);

    // Loading
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
                <Pagination
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
                />
            </Styles>
        );
    }

    return (
        <Styles>
            <div className="flex-1 overflow-x-hidden bg-white">
                <div className="inline-block w-full overflow-x-auto bg-white align-middle">
                    <table {...getTableProps()} id="user-table">
                        <thead className="sticky top-0 border-t-default !border-[#A6B4D040]">
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={column.isSorted ? orderStyle : headerStyles}>
                                            <span className="flex">
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
            <Pagination
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
            />
        </Styles>
    );
};

export default Table;

const Styles = styled.div`
    display: block;
    max-width: 100%;

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

        td.unread {
            font-weight: 700;
            color: rgba(0, 0, 0, 0.75) !important;
            background-color: transparent !important;
        }

        td.read {
            font-weight: 400;
            color: #727c94;
            background-color: #f8f9fb !important;
        }

        td {
            font-size: 13px !important;
            font-weight: 400;
            color: #727c94;
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
