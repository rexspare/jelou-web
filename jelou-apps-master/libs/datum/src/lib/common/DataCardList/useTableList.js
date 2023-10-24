import { useMemo } from "react";
import { useTable, useSortBy, useRowSelect } from "react-table/dist/react-table.development";

export function useListData({ data, columns }) {
    const dataList = useMemo(() => data, [data]);

    const tableInstance = useTable({ columns, data: dataList }, useSortBy, useRowSelect);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow };
}
