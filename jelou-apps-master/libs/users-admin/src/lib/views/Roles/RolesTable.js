import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useMemo } from "react";
import { usePagination, useSortBy, useTable } from "react-table";

import { useTranslation } from "react-i18next";

import { TableSkeleton } from "@apps/shared/common";
import { ActivateIcon, DesactivateIcon, DownIcon, View, ViewEdit } from "@apps/shared/icons";

const RolesTable = (props) => {
    const { canDeleteRol, canUpdateRol, handleDeleteRole, handleViewRole, handleActivateRole, loading, maxPage, data, pageLimit, setPageLimit, nrows, setRows, lang } = props;

    const { t } = useTranslation();

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row) => row.id,
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="max-w-cell">
                            <div className="overflow-hidden overflow-ellipsis font-semibold">{original.id}</div>
                        </div>
                    );
                },
            },
            {
                Header: t("AdminFilters.name"),
                accessor: (row) => row.name,
                Cell: ({ row: { original } }) => {
                    return <div className="overflow-hidden overflow-ellipsis font-semibold">{isEmpty(original.displayNames) ? original.name : original.displayNames[lang]}</div>;
                },
            },
            {
                Header: t("AdminFilters.type"),
                accessor: (row) => (row.default ? "true" : "false"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="text-center">
                            {original.default ? (
                                <div className="w-max rounded-xl bg-[#fde047] bg-opacity-50 px-4 py-1 font-bold text-yellow-600 text-opacity-65">{t("AdminFilters.default")}</div>
                            ) : (
                                <div className="w-max rounded-xl bg-[#00b3c71f] px-4 py-1 font-bold text-primary-200">{t("AdminFilters.custom")}</div>
                            )}
                        </div>
                    );
                },
            },

            {
                Header: t("AdminFilters.state"),
                accessor: (row) => (row.state ? "true" : "false"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="text-center">
                            {original.state ? (
                                <div className="w-max rounded-xl bg-green-950 px-4 py-1 font-bold text-green-960">{t("AdminFilters.active")}</div>
                            ) : (
                                <div className="w-max rounded-xl bg-red-960 px-4 py-1 font-bold text-red-950">{t("AdminFilters.noActive")}</div>
                            )}
                        </div>
                    );
                },
            },

            {
                Header: t("AdminFilters.activate"),
                accessor: (row) => get(row, "createdAt"),
                Cell: ({ row: { original } }) => {
                    return get(original, "createdAt") ? <div className="flex">{dayjs(original.createdAt).format("DD-MM-YYYY / HH:mm:ss")}</div> : <div className="ml-10 flex">--</div>;
                },
            },

            {
                Header: t("AdminFilters.actions"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center space-x-3">
                            <div className="flex">
                                <button className="text-gray-375 hover:text-gray-900" onClick={() => handleViewRole(original)}>
                                    {!original.default && canUpdateRol ? (
                                        <ViewEdit width="1.875rem" height="1rem" fill="currentColor" />
                                    ) : (
                                        <View width="1.25rem" height="1.25rem" fill="currentColor" />
                                    )}
                                </button>
                            </div>
                            {canDeleteRol && !original.default && original.state ? (
                                <div className="flex">
                                    <Tippy content={t("teamsDelete.disableTeam")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                        <button className="text-gray-375 hover:text-gray-900" onClick={() => handleDeleteRole(original)}>
                                            <DesactivateIcon width="1.1875rem" height="1.1875rem" />
                                        </button>
                                    </Tippy>
                                </div>
                            ) : (
                                canDeleteRol &&
                                !original.default &&
                                original.state === false && (
                                    <div className="flex">
                                        <Tippy content={t("AdminFilters.activateTeam")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                            <button className="mb-[0.15rem] text-gray-375 hover:text-gray-900" onClick={() => handleActivateRole({ ...original, state: true })}>
                                                <ActivateIcon width="1.1875rem" height="1.25rem" fill="currentColor" />
                                            </button>
                                        </Tippy>
                                    </div>
                                )
                            )}
                        </div>
                    );
                },
                style: {
                    borderStyle: "solid",
                    borderColor: "red",
                },
                sticky: "right",
            },
        ],
        [lang]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useSortBy, usePagination);

    let loadingSkeleton = [];

    for (let i = 0; i < 5; i++) {
        loadingSkeleton.push(<TableSkeleton number={6} key={i} />);
    }

    const orderStyle = {
        fontSize: "0.813rem",
        color: "#00B3C7",
        textAlign: "left",
        paddingLeft: "1.5rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem",
        lineHeight: "1rem",
        fontWeight: "bold",
        borderBottomWidth: "0.094rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#ffffff",
    };

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "1rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderBottomWidth: "0.094rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#ffffff",
    };

    const cellStyles = {
        fontSize: "0.875rem",
        whiteSpace: "nowrap",
        color: "#727C94",
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "1rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        backgroundColor: "#ffffff",
    };

    if (loading) {
        return (
            <div className="rounded-b-xl border-t-[0.0938rem] border-gray-100 border-opacity-25 bg-white pt-3">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                        <table {...getTableProps()} className="min-w-full rounded-md">
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
                        <div className="flex items-center justify-between rounded-b-xl border-t-2 border-gray-100/25 bg-white px-4 py-6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty(data)) {
        return (
            <div className="mt-3 rounded-b-xl border-t-[0.0938rem] border-gray-100 border-opacity-25 bg-white py-3">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
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
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("rolesForm.empty")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-b-xl border-t-2 border-gray-100/25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="rounded-b-xl border-t-[0.0938rem] border-gray-100 border-opacity-25 bg-white pt-3">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                    <table {...getTableProps()} className="min-w-full rounded-xs" id="user-table">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} style={column.isSorted ? orderStyle : headerStyles}>
                                            <span className="flex">
                                                {column.render("Header")}
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <DownIcon className="ml-1" width="0.938rem" fill="#00B3C7" />
                                                    ) : (
                                                        <DownIcon className="ml-1 rotate-180 transform" width="0.938rem" fill="#00B3C7" />
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
                    <div className="border-sm:px-6 flex items-center justify-between rounded-b-xl border-t-2 border-gray-100/25 bg-white px-4 py-3">
                        <div className="flex items-center sm:w-1/3">
                            {pageLimit === 1 ? (
                                <button className="mr-2 cursor-not-allowed p-2">
                                    <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                                </button>
                            ) : (
                                <button className="mr-2 cursor-pointer p-2" onClick={() => setPageLimit(pageLimit - 1)}>
                                    <div className="h-6 w-6 text-gray-375">{"<"}</div>
                                </button>
                            )}
                            <div className="relative text-xs text-gray-375">
                                {" "}
                                {pageLimit} {t("common.of")} {maxPage}
                            </div>
                            {pageLimit === maxPage ? (
                                <button className="cursor-not-allowed p-2">
                                    <div className="h-6 w-6 text-gray-400/75">{">"}</div>
                                </button>
                            ) : (
                                <button className="p-2" onClick={() => setPageLimit(pageLimit + 1)}>
                                    <div className="h-6 w-6 text-gray-375"> {">"}</div>
                                </button>
                            )}
                        </div>
                        <div className="relative w-24">
                            <select
                                className="select flex appearance-none justify-between border-none text-sm leading-5 text-gray-400 text-opacity-75 outline-none ring-transparent focus:ring-transparent"
                                value={nrows}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RolesTable;
