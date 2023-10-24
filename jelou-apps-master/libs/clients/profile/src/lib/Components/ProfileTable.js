import React, { useContext, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { TableSkeleton } from "@apps/shared/common";
import isEmpty from "lodash/isEmpty";
import { DownIcon, MessageIcon, ViewIcon } from "@apps/shared/icons";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import emojiStrip from "emoji-strip";
import Avatar from "react-avatar";
import Highlighter from "react-highlight-words";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DateContext } from "@apps/context";

const ProfileTable = (props) => {
    const { data, pageLimit, setPageLimit, maxPage, nrows, setRows, isLoadingClients, handleClientInfo, field, query, totalResults, clearFilters } =
        props;
    const dayjs = useContext(DateContext);
    const { t } = useTranslation();

    const showUser = (user) => {
        if (!isEmpty(user)) {
            const type = get(user, "botType");
            const username = get(user, "metadata.username", "");
            const phone = get(user, "id", "");
            let showUser = [];
            switch (toUpper(type)) {
                case "WHATSAPP":
                    showUser = `+${phone.replace("@c.us", "")}`;
                    break;
                case "FACEBOOK":
                    showUser = " - ";
                    break;
                case "EMAIL":
                    showUser = get(user, "referenceId", "");
                    break;
                default:
                    if (!isEmpty(username)) {
                        showUser = `@${get(user, "metadata.username", " - ")}`;
                    } else {
                        showUser = " - ";
                    }
                    break;
            }
            return field[0] === "client" ? (
                <Highlighter highlightClassName="YourHighlightClass" searchWords={[query]} autoEscape={true} textToHighlight={showUser} />
            ) : (
                <span className="text-semibold flex items-center">{showUser}</span>
            );
        }
    };

    const Badge = ({ values }) => {
        switch (toUpper(values)) {
            case "WHATSAPP":
                return (
                    <span className="inline-flex items-center rounded-xl bg-green-960 bg-opacity-15 px-4 py-1 text-13 font-semibold leading-4 text-green-800">
                        {"Whatsapp"}
                    </span>
                );
            case "FACEBOOK":
                return (
                    <span className="inline-flex items-center rounded-xl bg-blue-250 bg-opacity-15 px-4 py-1 text-13 font-semibold leading-4 text-blue-250">
                        {"Facebook"}
                    </span>
                );
            case "FACEBOOK_FEED":
                return (
                    <span className="inline-flex items-center rounded-xl bg-blue-250 bg-opacity-15 px-4 py-1 text-13 font-semibold leading-4 text-blue-250">
                        {"Facebook Feed"}
                    </span>
                );
            case "TWITTER":
                return (
                    <span className="inline-flex items-center rounded-xl bg-primary-200 bg-opacity-15 px-4 py-1 text-13 font-semibold leading-4 text-primary-200">
                        {"Twitter"}
                    </span>
                );
            case "TWITTER_REPLIES":
                return (
                    <span className="inline-flex items-center rounded-xl bg-primary-200 bg-opacity-15 px-4 py-1 text-13 font-semibold leading-4 text-primary-200">
                        {"Twitter Replies"}
                    </span>
                );
            case "INSTAGRAM":
                return (
                    <span className="inline-flex items-center rounded-xl bg-red-550 bg-opacity-50 px-4 py-1 text-13 font-semibold leading-4 text-red-970">
                        {"Instagram"}
                    </span>
                );
            case "SMS":
                return (
                    <span className="inline-flex items-center rounded-xl bg-teal-400 bg-opacity-50 px-4 py-1 text-13 font-semibold leading-4 text-teal-900">
                        {"SMS"}
                    </span>
                );
            case "WIDGET":
                return (
                    <span className="inline-flex items-center rounded-xl bg-purple-300 bg-opacity-50 px-4 py-1 text-13 font-semibold leading-4 text-purple-900">
                        {"Widget"}
                    </span>
                );
            case "WEB":
                return (
                    <span className="inline-flex items-center rounded-xl bg-gray-200 bg-opacity-50 px-4 py-1 text-13 font-semibold leading-4 text-gray-375">
                        {"Web"}
                    </span>
                );
            default:
                return (
                    <span className="bg-opcity-25 inline-flex items-center rounded-xl bg-yellow-350 px-4 py-1 text-13 font-semibold capitalize leading-4 text-yellow-600">
                        {values}
                    </span>
                );
        }
    };

    const showName = (user) => {
        const name = get(user, "names") || get(user, "metadata.names", "-");
        const src = get(user, "metadata.profilePicture", "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg");
        return (
            <div className="flex flex-row">
                <Avatar
                    src={src}
                    name={emojiStrip(name)}
                    className="mr-3 font-semibold"
                    fgColor="white"
                    size="2.438rem"
                    round={true}
                    color="#2A8BF2"
                    textSizeRatio={2}
                />
                {field[0] === "client" ? (
                    <Highlighter highlightClassName="YourHighlightClass" searchWords={[query]} autoEscape={true} textToHighlight={name} />
                ) : (
                    <span className="text-semibold flex items-center capitalize">{name}</span>
                )}
            </div>
        );
    };

    let columns = useMemo(
        () => [
            {
                Header: t("clients.name"),
                accessor: (row) => showName(row),
                className: "border-r-1 border-gray-400 border-opacity-25",
            },
            {
                Header: t("clients.channel"),
                accessor: (row) => get(row, "botType"),
                Cell: ({ cell: { value } }) => {
                    return <Badge values={value} />;
                },
            },
            {
                Header: t("Bot"),
                accessor: (row) => get(row, "botName"),
            },
            {
                Header: t("clients.user"),
                accessor: (row) => showUser(row),
            },
            {
                Header: t("clients.creationDate"),
                accessor: (row) => (!isEmpty(row.createdAt) ? dayjs(get(row, "createdAt", "-")).format("DD/MM/YYYY - hh:mm:ss") : " - "),
            },
            {
                Header: t("clients.information"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex space-x-3">
                            <Tippy content={"Chat"} placement={"top"} touch={false}>
                                <div className="flex items-center space-x-3">
                                    <Link to={`/clients/conversation/${original.roomId}`} state={{ room: original }}>
                                        <button className="text-gray-400 hover:text-primary-200" onClick={clearFilters}>
                                            <MessageIcon width="1.25rem" height="1.25rem" fill="currentColor" />
                                        </button>
                                    </Link>
                                </div>
                            </Tippy>
                            <Tippy content={"Info"} placement={"top"} touch={false}>
                                <div className="flex items-center space-x-3">
                                    <button className="mb-2 text-gray-400 hover:text-primary-200" onClick={() => handleClientInfo(original)}>
                                        <ViewIcon width="1.25rem" height="1.25rem" fill="currentColor" />
                                    </button>
                                </div>
                            </Tippy>
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
        [data]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    let loadingSkeleton = [];

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} key={i} />);
    }

    const orderStyle = {
        fontSize: "0.813rem",
        color: "#00B3C7",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.5rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.75rem",
        lineHeight: "1rem",
        fontWeight: "bold",
        borderBottomWidth: "0.094rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
    };

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.8rem",
        paddingRight: "1rem",
        paddingBottom: "0.5rem",
        paddingTop: "0.75rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderBottomWidth: "0.080rem",
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
        backgroundColor: "#ffffff",
    };

    if (isLoadingClients) {
        return (
            <div className="mb-2 rounded-b-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                        <table {...getTableProps()} className="min-w-full rounded-md">
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
                        <div className="flex items-center justify-between border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty(data)) {
        return (
            <div className="mb-2 rounded-b-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
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
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{"No existen contactos"}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="mb-2 overflow-y-auto rounded-b-xl bg-white">
            <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                <table {...getTableProps()} className="min-w-full rounded-xs" id="client-table">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={column.isSorted ? orderStyle : headerStyles}
                                        className="sticky top-0">
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
                        {rows.map((row, index) => {
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
            </div>
            <div className="sticky bottom-0 flex w-full items-center justify-between rounded-b-xl border-t-1 border-gray-400 border-opacity-25 bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center sm:w-1/3">
                    <button
                        disabled={pageLimit === 1}
                        className="mr-2 cursor-pointer p-2 disabled:cursor-not-allowed"
                        onClick={() => setPageLimit(pageLimit - 1)}>
                        <div className="h-6 w-6 text-gray-375">{"<"}</div>
                    </button>
                    <div className="relative text-xs text-gray-375">
                        {" "}
                        {pageLimit} {t("monitoring.of")} {maxPage}
                    </div>
                    <button disabled={pageLimit === maxPage} className="p-2 disabled:cursor-not-allowed" onClick={() => setPageLimit(pageLimit + 1)}>
                        <div className="h-6 w-6 text-gray-375"> {">"}</div>
                    </button>
                </div>
                <div className="flex justify-center space-x-1 text-13 text-gray-400 sm:w-1/3">
                    <span className="font-semibold text-primary-200">{totalResults}</span>
                    <span>{t("clients.results")}</span>
                </div>
                <div className="flex justify-end text-gray-400 sm:w-1/3">
                    <div className="flex sm:w-1/5">
                        <select
                            className="mr-10 flex cursor-pointer appearance-none justify-between border-transparent text-sm leading-5 text-gray-500"
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTable;
