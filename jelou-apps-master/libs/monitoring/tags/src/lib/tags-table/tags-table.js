import dayjs from "dayjs";
import "dayjs/locale/es";
import get from "lodash/get";
import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";
import { useMemo } from "react";
import { withTranslation } from "react-i18next";
import { useTable, useSortBy, usePagination } from "react-table";

import { DownIcon, TrashIcon, PencilIcon } from "@apps/shared/icons";
import { TableSkeleton } from "@apps/shared/common";
import Tippy from "@tippyjs/react";

const TagsTable = (props) => {
    const { openEditTagModal, deleteCurrentTag, data, page, setPage, nrows, setRows, maxPage, t } = props;

    let loadingSkeleton = [];

    for (let i = 0; i < 6; i++) {
        loadingSkeleton.push(<TableSkeleton number={6} key={i} />);
    }

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.8rem",
        paddingRight: "1rem",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderBottomWidth: "0.094rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
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
    };

    const showBot = (original) => {
        const bots = get(original, "bots");
        let botNames = bots.map((bot) => get(bot, "name", ""));
        botNames = botNames.join();
        return botNames;
    };

    const showTeam = (original) => {
        const teams = get(original, "teams");
        let teamsNames = teams.map((team) => get(team, "name", ""));
        teamsNames = teamsNames.join();
        return teamsNames;
    };

    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.Nombre"),
                accessor: (row) => get(row, "name.es", "--"),
            },
            {
                Header: t("monitoring.Color"),
                accessor: "botName",
                Cell: ({ row: { original } }) => (
                    <div className="flex items-center">
                        <span className="h-6 w-6 rounded-md" style={{ backgroundColor: original.color }}></span>
                    </div>
                ),
            },
            {
                Header: t("Fecha de creación"),
                accessor: (row) => (isNull(row.createdAt) ? "--" : dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")),
            },
            {
                Header: t("Bots"),
                accessor: (row) => get(row, "isGlobal", false),
                Cell: ({ row: { original } }) => (
                    <div className="flex items-center">
                        {get(original, "isGlobal", false) ? (
                            <span className="h-6 w-6 rounded-md">{t("monitoring.Todos")}</span>
                        ) : !isEmpty(get(original, "bots")) ? (
                            <Tippy
                                content={get(original, "bots", []).map((bot, key) => (
                                    <li key={key}> {get(bot, "name", "")}</li>
                                ))}
                                theme="jelou"
                                placement={"bottom"}>
                                <div className="max-w-cell overflow-hidden overflow-ellipsis">{showBot(original)}</div>
                            </Tippy>
                        ) : (
                            <span className="h-6 w-6 rounded-md">{t(" -- ")}</span>
                        )}
                    </div>
                ),
            },
            {
                Header: t("monitoring.Equipos"),
                accessor: (row) => get(row, "isGlobal", false),
                Cell: ({ row: { original } }) => (
                    <div className="flex items-center">
                        {get(original, "isGlobal", false) ? (
                            <span className="h-6 w-6 rounded-md">{t("monitoring.Todos")}</span>
                        ) : !isEmpty(get(original, "teams")) ? (
                            <Tippy
                                content={get(original, "teams", []).map((team, key) => (
                                    <li key={key}> {get(team, "name", "")}</li>
                                ))}
                                theme="jelou"
                                placement={"bottom"}>
                                <div className="max-w-cell overflow-hidden overflow-ellipsis">{showTeam(original)}</div>
                            </Tippy>
                        ) : (
                            <span className="h-6 w-6 rounded-md">{t(" -- ")}</span>
                        )}
                    </div>
                ),
            },
            {
                Header: t("Acciones"),
                Cell: ({ row: { original } }) => (
                    <div className="flex">
                        <button className="mr-1 flex rounded-full p-2 focus:outline-none" onClick={() => openEditTagModal(original)}>
                            <PencilIcon
                                className="fill-current text-gray-375 hover:text-primary-200"
                                width="1.1875rem"
                                height="1.125rem"
                                fillOpacity={0.75}
                            />
                        </button>
                        <button className="flex rounded-full p-2 focus:outline-none" onClick={() => deleteCurrentTag(original)}>
                            <TrashIcon className="fill-current text-gray-375 hover:text-primary-200" width="1rem" height="1.125rem" />
                        </button>
                    </div>
                ),
            },
        ],
        [deleteCurrentTag, openEditTagModal, t]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    if (props.loading) {
        return (
            <div className="overflow-x-auto rounded-xl bg-white xxl:mx-10">
                <div className="inline-block min-w-full max-w-full bg-white align-middle">
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                            style={headerStyles}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>{loadingSkeleton}</tbody>
                    </table>
                    <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-6"></div>
                </div>
            </div>
        );
    }
    if (isEmpty(data)) {
        return (
            <div className="overflow-x-auto rounded-xl bg-white xxl:mx-10">
                <div className="inline-block min-w-full max-w-full bg-white align-middle">
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                            style={headerStyles}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                    </table>
                    <div className="flex justify-center">
                        <div className="flex h-72 items-center text-gray-400">{t("No existen etiquetas en la compañía")}</div>
                    </div>
                    <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-3"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto rounded-xl bg-white xxl:mx-10">
            <div className="inline-block min-w-full bg-white align-middle sm:rounded-lg">
                <table {...getTableProps()} className="min-w-full">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                                        style={headerStyles}>
                                        {column.render("Header")}
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
                {/* Pagination */}
                <div className="border-sm:px-6 flex items-center justify-between border-t-2 border-gray-100/25 bg-white px-4 py-3">
                    <div className="flex items-center sm:w-1/3">
                        {page === 1 ? (
                            <button className="mr-2 cursor-not-allowed p-2">
                                <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                            </button>
                        ) : (
                            <button className="mr-2 cursor-pointer p-2" onClick={() => setPage(page - 1)}>
                                <div className="h-6 w-6 text-gray-375">{"<"}</div>
                            </button>
                        )}
                        <div className="relative text-xs text-gray-375">
                            {" "}
                            {page} de {maxPage}
                        </div>
                        {page === maxPage ? (
                            <button className="cursor-not-allowed p-2">
                                <div className="h-6 w-6 text-gray-400/75">{">"}</div>
                            </button>
                        ) : (
                            <button className="p-2" onClick={() => setPage(page + 1)}>
                                <div className="h-6 w-6 text-gray-375"> {">"}</div>
                            </button>
                        )}
                    </div>
                    <div className="relative w-24">
                        <select
                            className="select flex appearance-none justify-between text-sm leading-5 text-gray-500"
                            value={nrows}
                            onChange={(e) => {
                                setRows(Number(e.target.value));
                            }}>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} {t("filas")}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-primary-200">
                            <DownIcon width="1.25rem" height="1.25rem" className="fill-current" stroke="currentColor" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(TagsTable);
