import { useTable, useSortBy, useRowSelect } from "react-table/dist/react-table.development";
import { useMemo } from "react";

export function useCreateTable({ dataList, structureColumns }) {    
    const data = useMemo(() => dataList, [dataList]);

    const tableInstance = useTable({ columns: structureColumns , data }, useSortBy, useRowSelect);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow };
}
