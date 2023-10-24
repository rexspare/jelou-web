import { ActivateIcon, DesactivateIcon, DownIcon, View, ViewEdit } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useSortBy, useTable } from "react-table";

import { TableSkeleton } from "@apps/shared/common";

const UsersTable = (props) => {
    const { deletePermission, editPermission, handleDesactivateUser, handleActivateUser, handleViewUser, loading, maxPage, data, pageLimit, setPageLimit, nrows, setRows, lang } = props;
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
                Header: t("AdminFilters.user"),
                accessor: (row) => row.names,
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="max-w-cell">
                            <div className="overflow-hidden overflow-ellipsis font-semibold">{original.names}</div>
                            <div className="overflow-hidden overflow-ellipsis font-light">{original.email}</div>
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
                                <div className="rounded-xl bg-green-950 py-1 font-bold text-green-960">{t("AdminFilters.active")}</div>
                            ) : (
                                <div className="rounded-xl bg-red-960 py-1 px-2 font-bold text-red-950">{t("AdminFilters.noActive")}</div>
                            )}
                        </div>
                    );
                },
            },
            {
                Header: t("AdminFilters.teams"),
                accessor: (row) => {
                    const teams = get(row, "Teams", []);

                    if (isEmpty(teams)) {
                        return <div className="ml-5 flex">--</div>;
                    } else {
                        return (
                            <Tippy
                                content={teams.map((team, key) => (
                                    <li key={key}> {team.name}</li>
                                ))}
                                placement={"top"}
                                touch={false}
                                arrow={false}
                                theme={"tomato"}
                            >
                                <div className="max-w-cell overflow-hidden overflow-ellipsis">
                                    {teams.map((team, key) => (
                                        <span key={key}>{`${key !== row.Teams.lenght && key !== 0 ? ", " : " "}${team.name}`}</span>
                                    ))}
                                </div>
                            </Tippy>
                        );
                    }
                },
            },
            {
                Header: t("AdminFilters.roles"),
                accessor: (row) => {
                    const rols = get(row, "Rols", []);
                    const rolsOrderAsc = orderBy(rols, ["name"], ["asc"]);
                    if (isEmpty(rolsOrderAsc)) {
                        return <div className="ml-5 flex">--</div>;
                    } else {
                        return (
                            <Tippy
                                content={rolsOrderAsc.map((role, key) => (
                                    <li key={key}>{isEmpty(role.displayNames) ? role.name : role.displayNames[lang]}</li>
                                ))}
                                placement={"top"}
                                touch={false}
                                arrow={false}
                                theme={"tomato"}
                            >
                                <div className="max-w-cell overflow-hidden overflow-ellipsis">
                                    {rolsOrderAsc.map((role, key) => (
                                        <span key={key}>{`${key !== row.Rols.lenght && key !== 0 ? ", " : " "}${isEmpty(role.displayNames) ? role.name : role.displayNames[lang]}`}</span>
                                    ))}
                                </div>
                            </Tippy>
                        );
                    }
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
                Header: t("AdminFilters.inactivate"),
                accessor: (row) => get(row, "deletedAt"),
                Cell: ({ row: { original } }) => {
                    return get(original, "deletedAt") ? <div className="flex">{dayjs(original.deletedAt).format("DD-MM-YYYY / HH:mm:ss")}</div> : <div className="ml-10 flex">--</div>;
                },
            },
            {
                Header: t("AdminFilters.actions"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center space-x-3">
                            <div className="flex">
                                {editPermission ? (
                                    <Tippy content={t("AdminFilters.editUser")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                        <button className="text-gray-375 hover:text-gray-900" onClick={() => handleViewUser(original)}>
                                            <ViewEdit width="1.875rem" height="1rem" fill="currentColor" />
                                        </button>
                                    </Tippy>
                                ) : (
                                    <Tippy content={t("AdminFilters.viewUser")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                        <button className="text-gray-375 hover:text-gray-900" onClick={() => handleViewUser(original)}>
                                            <View width="1.25rem" height="1.25rem" fill="currentColor" />
                                        </button>
                                    </Tippy>
                                )}
                            </div>
                            {deletePermission && original.state ? (
                                <Tippy content={t("AdminFilters.disable")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                    <div className="flex">
                                        <button className="mb-[0.15rem] text-gray-375 hover:text-gray-900" onClick={() => handleDesactivateUser(original)}>
                                            <DesactivateIcon width="1.1875rem" height="1.1875rem" />
                                        </button>
                                    </div>
                                </Tippy>
                            ) : (
                                deletePermission &&
                                original.state === false && (
                                    <Tippy content={t("AdminFilters.activateUser")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                        <div className="flex">
                                            <button className="mb-[0.15rem] mr-2 text-gray-375 hover:text-gray-900" onClick={() => handleActivateUser(original)}>
                                                <ActivateIcon width="1.1875rem" height="1.25rem" fill="currentColor" />
                                            </button>
                                        </div>
                                    </Tippy>
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

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={8} key={i} />);
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
        paddingLeft: "1.8rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem",
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
        paddingLeft: "1.8rem",
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
            <div className="rounded-b-xl border-t-[0.0938rem] border-gray-100 border-opacity-25 bg-white pt-3">
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
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("usersForm.empty")}</div>
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
export default UsersTable;
