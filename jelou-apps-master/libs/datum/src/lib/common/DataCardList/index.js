import { DownIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

import { Styles, cellStyles, headerStyles, orderStyle } from "./styles";
import { useListData } from "./useTableList";

export function ListDataCard({
    datalist = [],
    handleRowClick = () => null,
    hasErrorInputName = false,
    isDatabase = false,
    structureColums = [],
} = {}) {
    const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useListData({ data: datalist, columns: structureColums });
    const { t } = useTranslation();

    return (
        <Styles isDatabase={isDatabase}>
            <table {...getTableProps()}>
                <thead className="sticky top-0 bg-white">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={column.isSorted ? orderStyle : headerStyles}>
                                    <div className="grid items-center justify-start grid-flow-col grid-rows-none gap-2">
                                        {column.render("Header")}
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <DownIcon className="ml-1" width="0.938rem" fill="#00B3C7" />
                                            ) : (
                                                <DownIcon className="ml-1 transform rotate-180" width="0.938rem" fill="#00B3C7" />
                                            )
                                        ) : (
                                            column.render("Header") !== t("dataReport.actions") &&
                                            column.render("Header") !== " " && (
                                                <div>
                                                    <DownIcon className="ml-1" width="0.938rem" fill="rgba(112, 124, 149, 0.7)" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="hover:bg-primary-800 hover:bg-opacity-30">
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            style={cellStyles}
                                            className={hasErrorInputName[row.id] ? "bg-red-1010 bg-opacity-10 text-red-950" : ""}
                                            onClick={() => handleRowClick(row)}>
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
    );
}
