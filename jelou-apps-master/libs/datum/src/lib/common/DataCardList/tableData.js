import { LeftArrow } from "@apps/shared/icons";
import dayjs from "dayjs";
import React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTable, useSortBy, useRowSelect } from "react-table/dist/react-table.development";

export function useListData({ reportList }) {
    const { t } = useTranslation();

    const dataList = useMemo(() => reportList, [reportList]);

    const columnsList = useMemo(
        () => [
            {
                Header: t("dataReport.name"),
                accessor: (row) => row.Report.name,
                Cell: ({ row: { original } }) => {
                    return <span className="font-bold">{original.Report.name}</span>;
                },
            },
            {
                Header: t("dataReport.createAt"),
                accessor: (row) => row.createdAt,
                Cell: ({ row: { original } }) => <div>{dayjs(original.createdAt).format("DD/MM/YYYY")}</div>,
            },
            {
                Header: t("dataReport.actions"),
                Cell: () => (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold">{t("dataReport.enterReport")}</span>
                        <LeftArrow className="mt-1" width="10" height="8" />
                    </div>
                ),
            },
        ],
        [t]
    );

    const tableInstance = useTable({ columns: columnsList, data: dataList }, useSortBy, useRowSelect);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow };
}
