import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";

import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import Tippy from "@tippyjs/react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useTable, useSortBy, usePagination } from "react-table";

import { Dots } from "@apps/shared/icons";
import { Styles } from "./table-container";
import { JelouApiV1 } from "@apps/shared/modules";
import { TableSkeleton } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import { DownIcon, IncognitoIcon, ViewIcon } from "@apps/shared/icons";
import { ClipLoader } from "react-spinners";

const OperatorsTable = (props) => {
    const { data, pageLimit, setPageLimit, maxPage, nrows, setRows, totalResults, isLoadingOperators, openImpersonate, loadingImpersonate } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const dropdownRef = useRef();

    const updateOperatorStatus = (operatorId, status) => {
        JelouApiV1.patch(`/operators/${operatorId}`, {
            status,
        });
    };

    useOnClickOutside(dropdownRef, () => setOpenModal(false));

    const openStatusModal = (id) => {
        setOpenModal(id);
    };

    useEffect(() => {
        if (!isEmpty(data)) {
            setOpenModal(false);
        }
    }, [data]);

    const renderStatus = (active) => {
        switch (toUpper(active)) {
            case "ONLINE":
                return "bg-green-960";
            case "OFFLINE":
                return "bg-red-1010";
            case "BUSY":
                return "bg-yellow-1010";
            default:
                return "bg-red-1010";
        }
    };

    const showName = (operator) => {
        const { names, email, operatorActive } = operator;

        return (
            <span className="flex items-start space-x-2 bg-transparent">
                <span className={`mt-2 flex h-2 w-2 items-center justify-center rounded-full text-white ${renderStatus(operatorActive)}`}></span>
                <span className="flex flex-col">
                    <span className="overflow-hidden overflow-ellipsis text-15 font-semibold text-gray-400">{names}</span>
                    <span className="overflow-hidden overflow-ellipsis text-13 text-gray-375/70">{email}</span>
                </span>
            </span>
        );
    };

    let columns = useMemo(
        () => [
            {
                Header: t("monitoring.Nombre"),
                accessor: (row) => showName(row),
            },
            {
                Header: t("monitoring.Equipo"),
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
                                arrow={false}
                                theme={"jelou"}
                            >
                                <div className="max-w-cell overflow-hidden overflow-ellipsis font-light">
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
                Header: t("monitoring.inicio sesion"),
                accessor: (row) =>
                    !isEmpty(row.Operator.loggedInAt) ? (
                        <span className="font-light">{dayjs(get(row, "Operator.loggedInAt", "-")).add(5, "hour").format("DD/MM/YYYY - hh:mm:ss")}</span>
                    ) : (
                        <span className="font-light">--</span>
                    ),
            },
            {
                Header: t("monitoring.Casos Actuales"),
                accessor: (row) => (
                    <div className="flex flex-col font-light">
                        <span>
                            Chats: <span className={`${get(row, "casesStats.chats.actual", 0) > 0 && "font-bold text-primary-200"}`}>{get(row, "casesStats.chats.actual", 0)}</span>
                        </span>
                        <span>
                            Emails: <span className={`${get(row, "casesStats.tickets.actual", 0) > 0 && "font-bold text-primary-200"}`}>{get(row, "casesStats.tickets.actual", 0)}</span>
                        </span>
                        <span>
                            {t("Publicaciones")}:{" "}
                            <span className={`${get(row, "casesStats.posts.assigned", get(row, "casesStats.posts.actual", 0)) > 0 && "font-bold text-primary-200"}`}>
                                {get(row, "casesStats.posts.assigned", get(row, "casesStats.posts.actual", 0))}
                            </span>
                        </span>
                    </div>
                ),
            },
            {
                Header: t("monitoring.Casos Pendientes"),
                accessor: (row) => (
                    <div className="flex flex-col font-light">
                        <span>
                            Chats: <span className={`${get(row, "casesStats.chats.pendings", 0) > 0 && "font-bold text-red-1010"}`}>{get(row, "casesStats.chats.pendings", 0)}</span>
                        </span>
                        <span>
                            Emails: <span className={`${get(row, "casesStats.tickets.pendings", 0) > 0 && "font-bold text-red-1010"}`}>{get(row, "casesStats.tickets.pendings", 0)}</span>
                        </span>
                        <span>
                            Publicaciones: <span className={`${get(row, "casesStats.posts.pendings", 0) > 0 && "font-bold text-red-1010"}`}>{get(row, "casesStats.posts.pendings", 0)}</span>
                        </span>
                    </div>
                ),
            },
            {
                Header: t("monitoring.Acciones"),
                Cell: ({ row: { original } }) => {
                    const operatorId = get(original, "Operator.id", null);
                    const currentOperatorId = get(userSession, "operatorId", null);
                    return (
                        <div className="flex items-center space-x-3">
                            {loadingImpersonate === original.Operator.id ? (
                                <ClipLoader size={"1.25rem"} color={"#00B3C7"} />
                            ) : (
                                <Tippy content={t("monitoring.Impersonar")} theme={"jelou"} placement={"top"} arrow={false} touch={false}>
                                    <div className="flex items-center justify-center space-x-3">
                                        <button
                                            disabled={operatorId === currentOperatorId}
                                            className={`text-gray-100 hover:text-primary-200 ${operatorId === currentOperatorId && "cursor-not-allowed"}`}
                                            onClick={(e) => openImpersonate(e, original)}
                                        >
                                            <IncognitoIcon className="-ml-0.25" width="1.1875rem" height="1.25rem" fill="currentColor" />
                                        </button>
                                    </div>
                                </Tippy>
                            )}
                            <Tippy content={"Info"} theme={"jelou"} placement={"top"} arrow={false} touch={false}>
                                <Link to={`/monitoring/operators/${original.Operator.id}`} state={{ operator: original.Operator, user: original }}>
                                    <div className="flex items-center space-x-3">
                                        <button className="text-gray-100 hover:text-primary-200">
                                            <ViewIcon width="1.25rem" height="1.25rem" fill="currentColor" />
                                        </button>
                                    </div>
                                </Link>
                            </Tippy>
                            {company.id === 135 && (
                                <div className="relative flex select-none items-center justify-center" onClick={() => openStatusModal(original.id)}>
                                    <button className="relative z-40 cursor-pointer">
                                        <Dots className={`fill-current  ${openModal === original.id ? "text-primary-200" : "text-gray-15"}`} width="1.25rem" height="1.25rem" />
                                    </button>
                                    <Transition
                                        show={openModal === original.id}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                        className="absolute right-0 z-50 mr-[1.6875rem] flex w-40 flex-col overflow-hidden rounded-20 bg-white shadow-outline-input"
                                    >
                                        <div className="flex flex-col" id="tooltip" role="tooltip" ref={dropdownRef}>
                                            <button
                                                className="py-3 pl-4 text-left text-13 font-bold text-gray-400 hover:bg-gray-10 focus:outline-none"
                                                onClick={() => updateOperatorStatus(original.Operator.id, "online")}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span className={`flex h-2 w-2 items-center justify-center rounded-full text-white ${renderStatus("online")}`}></span>
                                                    <p>Disponible</p>
                                                </div>
                                            </button>
                                            <button
                                                className="py-3 pl-4 text-left text-13 font-bold text-gray-400 hover:bg-gray-10 focus:outline-none"
                                                onClick={() => updateOperatorStatus(original.Operator.id, "busy")}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span className={`flex h-2 w-2 items-center justify-center rounded-full text-white ${renderStatus("busy")}`}></span>
                                                    <p>No disponible</p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => updateOperatorStatus(original.Operator.id, "offline")}
                                                className="py-3 pl-4 text-left text-13 font-bold text-gray-400 hover:bg-gray-10 focus:outline-none"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span className={`flex h-2 w-2 items-center justify-center rounded-full text-white ${renderStatus("offline")}`}></span>
                                                    <p>Desconectado</p>
                                                </div>
                                            </button>
                                        </div>
                                    </Transition>
                                </div>
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
        [data, t, openModal, loadingImpersonate]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useSortBy, usePagination);

    let loadingSkeleton = [];

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} key={i} />);
    }

    const handleOperatorInfo = (e, row) => {
        const user = get(row, "original", {});
        const operator = get(user, "Operator", {});
        const id = get(operator, "id", "");
        navigate(`/monitoring/operators/${id}`, {
            state: { operator, user },
        });
    };

    const orderStyle = {
        fontSize: "0.813rem",
        cursor: "pointer",
        color: "#00B3C7",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.5rem",
        paddingRight: "1rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
        whiteSpace: "nowrap",
        borderBottomWidth: "0.0625rem",
        borderTopWidth: "0.094rem",
    };

    const headerStyles = {
        fontSize: "0.813rem",
        color: "rgba(112, 124, 149, 0.7)",
        textAlign: "left",
        margin: "0",
        paddingLeft: "1.8rem",
        paddingRight: "1rem",
        lineHeight: "1rem",
        fontWeight: 700,
        borderBottomWidth: "0.0625rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        backgroundColor: "#fff",
        borderTopWidth: "0.094rem",
        cursor: "pointer",
        whiteSpace: "nowrap",
        height: "3rem",
    };

    const cellStyles = {
        fontSize: "0.875rem",
        cursor: "pointer",
        whiteSpace: "nowrap",
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
    };

    const cellStylesNoPointer = {
        fontSize: "0.875rem",
        cursor: "default",
        whiteSpace: "nowrap",
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
    };

    if (isLoadingOperators) {
        return (
            <div className="mb-2 rounded-b-xl bg-white">
                <div className="overflow-x-auto rounded-b-xl">
                    <div className="inline-block min-w-full max-w-full rounded-b-xl bg-white align-middle">
                        <Styles>
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
                                                    <span className="flex h-12 min-w-[8rem] items-center justify-start">{column.render("Header")}</span>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>{loadingSkeleton}</tbody>
                            </table>
                        </Styles>
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
                        {/* <Styles> */}
                        <table {...getTableProps()} className="min-w-full">
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className={`${column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}`}
                                                style={headerStyles}
                                            >
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                        </table>
                        {/* </Styles> */}
                        <div className="flex justify-center">
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("No existen operadores")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-b-xl border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="mb-2 max-h-modal overflow-y-auto rounded-b-xl bg-white lg:max-h-client">
            <Styles>
                <table {...getTableProps()} className="tableContainer min-w-full rounded-xs">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={column.isSorted ? orderStyle : headerStyles}
                                        className="sticky top-0 border-b-2 border-b-primary-200"
                                    >
                                        <div id="firstColumn" className="flex h-12 min-w-[8rem] items-center justify-start gap-2">
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
                                <tr {...row.getRowProps()} className="hover:bg-primary-400 hover:bg-opacity-30 hover:text-primary-200">
                                    {row.cells.map((cell, index) => {
                                        if (index === 5) {
                                            return (
                                                <td {...cell.getCellProps()} style={cellStylesNoPointer}>
                                                    <div className="h-13 grid items-center">{cell.render("Cell")}</div>
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td {...cell.getCellProps()} style={cellStyles} onClick={(e) => handleOperatorInfo(e, row)}>
                                                    <div className="h-13 grid items-center">{cell.render("Cell")}</div>
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Styles>
            {/* Pagination */}
            <div className="sticky inset-x-0 bottom-0 flex w-full items-center justify-between rounded-b-xl border-t-1 border-gray-400 border-opacity-25 bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center sm:w-1/3">
                    {pageLimit === 1 ? (
                        <button className="mr-2 cursor-not-allowed p-2">
                            <div className="h-6 w-6 text-gray-400/75">{"<"}</div>
                        </button>
                    ) : (
                        <button
                            className="mr-2 cursor-pointer p-2"
                            onClick={() => {
                                setPageLimit(pageLimit - 1);
                            }}
                        >
                            <div className="h-6 w-6 text-gray-375">{"<"}</div>
                        </button>
                    )}
                    <div className="relative text-xs text-gray-375">
                        {" "}
                        {pageLimit} de {maxPage}
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
                                setPageLimit(1);
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} {t("monitoring.filas")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorsTable;
