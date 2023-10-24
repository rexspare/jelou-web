import React, { useState, useEffect } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useTable } from "react-table";
import { renderHtml } from "./../helpers";
import styled from "styled-components";

const TableChart = (props) => {
    const { data = [] } = props;
    const [cols, setCols] = useState([]);
    const [rowsData, setRowsData] = useState([]);

    useEffect(() => {
        if (!isEmpty(data)) {
            setCols(get(data, "columns", []));
            setRowsData(get(data, "rows", []));
        }
    }, [data]);

    const columns = React.useMemo(
        () =>
            cols.map((column) => {
                const footer = get(data.totals, column);
                return {
                    Header: column,
                    accessor: column,
                    Footer: footer || typeof footer == "number" ? footer : "",
                };
            }),
        [cols]
    );

    const tableInstance = useTable({ columns, data: rowsData });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, footerGroups } = tableInstance;

    return (
        <div className="relative h-full w-full items-start justify-center overflow-auto pr-4">
            <Styles>
                <table {...getTableProps()} className="w-full">
                    <thead className="sticky top-0 bg-white">
                        {
                            // Loop over the header rows
                            headerGroups.map((headerGroup) => (
                                // Apply the header row props
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        // Loop over the headers in each row
                                        headerGroup.headers.map((column, index) => (
                                            // Apply the header cell props
                                            <th
                                                {...column.getHeaderProps()}
                                                className={`min-w-75 border-b border-t border-gray-300 bg-white ${
                                                    index === 0 ? "border-r pl-2 text-left" : "text-right"
                                                } py-2 text-xs font-medium text-gray-400`}>
                                                {
                                                    // Render the header
                                                    column.render("Header")
                                                }
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>
                    {/* Apply the table body props */}
                    <tbody {...getTableBodyProps()} className="t-body overflow-x-hidden overflow-y-scroll" style={{ height: "269px" }}>
                        {
                            // Loop over the table rows
                            rows.map((row) => {
                                // Prepare the row for display
                                prepareRow(row);
                                return (
                                    // Apply the row props
                                    <tr {...row.getRowProps()}>
                                        {
                                            // Loop over the rows cells
                                            row.cells.map((cell, index) => {
                                                // Apply the cell props
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        className={`border-b h-12 border-gray-300 text-xs font-normal text-gray-400 ${
                                                            index === 0 ? "border-r pl-2 text-left" : "text-right"
                                                        }`}>
                                                        {renderHtml(cell.render("Cell").props.value)}
                                                    </td>
                                                );
                                            })
                                        }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        {footerGroups.map((group) => (
                            <tr {...group.getFooterGroupProps()}>
                                {group.headers.map((column, index) => (
                                    <td
                                        {...column.getFooterProps()}
                                        className={`min-w-75 sticky top-0 border-t-default border-gray-100/25 bg-white ${
                                            index === 0 ? "border-r pl-2 text-left" : "text-right"
                                        } py-2 text-13 font-medium text-gray-400`}>
                                        {column.render("Footer")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </Styles>
        </div>
    );
};

const Styles = styled.div`
    table {
        color: #727c94;
        th {
            border-bottom: 1px solid rgba(166, 180, 208, 0.25);
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            width: 16rem;
            border-right: 0.5px solid rgba(166, 180, 208, 0.25) !important;
            :last-child {
                border-right: none;
            }
        }
        tr {
            :last-child {
                border-bottom: none;
            }
        }
    }
`;

export default TableChart;
