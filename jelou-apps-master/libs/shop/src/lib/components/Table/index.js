import { LoadingTable } from "./loadingTable";
import { useTranslation } from "react-i18next";
import { useCreateTable } from "../../hooks/createTable";
import { ShopBackgroundIcon, DownIcon } from "@apps/shared/icons";
import { Styles, cellStyles, headerStyles, orderStyle } from "../styles/table";

export function Table({
    dataList = [],
    EmptyTable = () => <div></div>,
    errMsg = "",
    isError = false,
    isProduct = false,
    loadingTable = false,
    structureColumns = [],
}) {

    const { t } = useTranslation();

    const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useCreateTable({
        dataList,
        structureColumns,
    });

    if (isError) return <p className="text-center text-gray-375">{errMsg || t("shop.table.error")}</p>;

    if (loadingTable) {
        return <LoadingTable isProduct={isProduct} getTableProps={getTableProps} headerGroups={headerGroups} structureColumns={structureColumns} />;
    }

    if (rows.length === 0 && loadingTable === false)
        return (
            <div className="grid h-[40rem] w-full place-content-center">
                <ShopBackgroundIcon />
                <EmptyTable />
            </div>
        );

    return (
        <Styles>
            <table {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={column.isSorted ? orderStyle : headerStyles}>
                                            <span className="grid items-center justify-start h-12 grid-flow-col grid-rows-none gap-2">
                                                {column.render("Header")}
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <DownIcon width="0.938rem" fill="#00B3C7" />
                                                    ) : (
                                                        <DownIcon className="transform rotate-180" width="0.938rem" fill="#00B3C7" />
                                                    )
                                                ) : (
                                                    column.render("Header") !== " " &&
                                                    column.render("Header") !== "Imagen" && (
                                                        <DownIcon width="0.938rem" fill="rgba(112, 124, 149, 0.7)" />
                                                    )
                                                )}
                                            </span>
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()} style={cellStyles}>
                                                    <span className="grid items-center h-12">
                                                        {
                                                            cell.render("Cell")
                                                        }
                                                    </span>
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </Styles>
    );
}
