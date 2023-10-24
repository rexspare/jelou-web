import dayjs from "dayjs";
import "dayjs/locale/es";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePagination, useSortBy, useTable } from "react-table";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import toUpper from "lodash/toUpper";
import { useSelector } from "react-redux";

import { TableSkeleton } from "@apps/shared/common";
import { DownIcon, EyesIcon, PencilIcon, TrashIcon } from "@apps/shared/icons";
import { Styles } from "../monitoring-campaigns-table/Components/table-container";
import styles from "./templates-table.module.css";

import Tippy from "@tippyjs/react";

const TemplatesTable = (props) => {
    const {
        data,
        isLoading,
        pageLimit,
        setPageLimit,
        row,
        setRows,
        maxPage,
        deleteTemplate,
        openTemplateModal,
        templatePermissionArr,
        totalResults,
        lang,
    } = props;

    const { t } = useTranslation();

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
        whiteSpace: "nowrap",
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "1rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
    };

    const color = (values) => {
        switch (toUpper(values)) {
            case "PENDING":
                return "bg-yellow-1030 text-yellow-1031";
            case "APPROVED":
                return "bg-teal-952 text-teal-953";
            case "DELETED":
                return "bg-red-1040 text-red-1030";
            case "DISABLED":
                return "bg-gray-10 text-gray-400";
            case "REJECTED":
            default:
                return "bg-pink-952 text-pink-953";
        }
    };

    const Badge = ({ values }) => {
        const status = get(values, "status", "--");
        return (
            <div>
                {status === "REJECTED" ? (
                    <Tippy content={get(values, "providerResponse.payload.rejectedReason", "")} theme="jelou" placement={"top"}>
                        <span className={` rounded-xl px-2.5 py-1 font-bold  ${color(status)}`}>{t(`hsm.${toUpper(status)}`)}</span>
                    </Tippy>
                ) : (
                    <span className={`rounded-xl px-2.5 py-1 font-bold  ${color(status)}`}>{t(`hsm.${toUpper(status)}`)}</span>
                )}
            </div>
        );
    };

    const colorIcon = (original, isDeleted = false) => {
        if (props.fill) {
            return props.fill;
        } else if (isDeleted && ["DELETED"].includes(`${get(original, "status", "--")}`.toUpperCase())) {
            return "#DCDEE4";
        } else if (!isDeleted && ["PENDING", "DELETED", "REJECTED"].includes(`${get(original, "status", "--")}`.toUpperCase())) {
            return "#DCDEE4";
        }
        return "#707C95";
    };

    const opacityIcon = (original, isDeleted = false) => {
        if (!isDeleted && ["PENDING", "DELETED", "REJECTED"].includes(`${get(original, "status", "--")}`.toUpperCase())) {
            return 1;
        } else if (isDeleted && ["DELETED"].includes(`${get(original, "status", "--")}`.toUpperCase())) {
            return;
        }
        return 0.75;
    };

    const columns = useMemo(
        () => [
            {
                Header: t("hsm.elementName"),
                accessor: (row) => get(row, "displayName", "--"), // accessor is the "key" in the data
            },
            {
                Header: t("hsm.template"),
                accessor: (row) => get(row, "elementName", "--"),
            },
            {
                Header: t("hsm.status"),
                accessor: "status",
                Cell: ({ row: { original } }) => <Badge values={original} />,
            },
            {
                Header: t("registerBusiness.category"),
                accessor:
                    lang === "es"
                        ? (row) =>
                              get(row, "category", "--") === "UTILITY"
                                  ? "SERVICIOS"
                                  : get(row, "category", "--") === "AUTHENTICATION"
                                  ? "AUTENTICACIÓN"
                                  : get(row, "category", "--")
                        : (row) => get(row, "category", "--"),
            },
            {
                Header: t("hsm.type"),
                accessor: (row) => t(`hsm.${isEmpty(get(row, "type")) ? "HSM" : get(row, "type")}`),
                // Cell: ({ row: { original } }) => <Badge values={get(original, "type", "--")} />,
            },
            {
                Header: t("hsm.interactions"),
                accessor: (row) =>
                    `${get(row, "buttons.buttonText", get(row, "buttons.buttons", [])).length > 0 ? t(`hsm.${row.interactiveAction}`) : "-"}`,
                // A futuro => t("hsm.CALL_TO_ACTION")
            },
            // {
            //     Header: t("hsm.visible"),
            //     accessor: (row) => (row.isVisible ? t("hsm.yes") : t("hsm.no")),
            // },
            {
                Header: t("hsm.creationDate"),
                accessor: (row) => (isNull(row.createdAt) ? "--" : dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")),
            },
            {
                Header: t("hsm.actions"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex">
                            {!!templatePermissionArr.find((permission) => permission === "hsm:update_template") && (
                                <>
                                    <Tippy
                                        content={
                                            <p
                                                style={{ color: "#00B3C7", borderColor: "#00B3C7" }}
                                                className="flex items-center gap-2 rounded-10 border-1.5 bg-white px-2 py-1 font-medium">
                                                <span className="text-gray-400">{t("hsm.viewTemplate")}</span>
                                            </p>
                                        }
                                        theme={"badgeChat"}
                                        arrow={false}
                                        placement={"top"}
                                        touch={false}>
                                        <button className="w-8 p-1 text-gray-400" onClick={() => openTemplateModal(original, "view")}>
                                            <EyesIcon
                                                className="fill-current text-gray-100 hover:text-primary-200"
                                                width="1.4375rem"
                                                height="0.9375rem"
                                            />
                                        </button>
                                    </Tippy>

                                    <button
                                        disabled={["PENDING", "DELETED", "REJECTED"].includes(`${get(original, "status", "--")}`.toUpperCase())}
                                        className="w-8 p-1 text-gray-400 "
                                        onClick={() => openTemplateModal(original, "update")}>
                                        <Tippy
                                            content={
                                                <p
                                                    style={{ color: "#00B3C7", borderColor: "#00B3C7" }}
                                                    className="flex items-center gap-2 rounded-10 border-1.5 bg-white px-2 py-1 font-medium">
                                                    <span className="text-gray-400">
                                                        {[("PENDING", "DELETED", "REJECTED")].includes(
                                                            `${get(original, "status", "--")}`.toUpperCase()
                                                        )
                                                            ? t("hsm.editDisabled")
                                                            : t("hsm.editTemplate")}
                                                    </span>
                                                </p>
                                            }
                                            theme={"badgeChat"}
                                            arrow={false}
                                            placement={"top"}>
                                            <div>
                                                <PencilIcon
                                                    className="fill-current"
                                                    width="1.1875rem"
                                                    height="1.125rem"
                                                    fill={colorIcon(original)}
                                                    fillOpacity={opacityIcon(original)}
                                                />
                                            </div>
                                        </Tippy>
                                    </button>
                                </>
                            )}

                            {!!templatePermissionArr.find((permission) => permission === "hsm:delete_template") && (
                                <button
                                    disabled={["DELETED"].includes(`${get(original, "status", "--")}`.toUpperCase())}
                                    className="w-8 p-1 text-gray-400 hover:text-primary-200"
                                    onClick={() => deleteTemplate(original)}>
                                    <Tippy
                                        content={
                                            <p
                                                style={{ color: "#00B3C7", borderColor: "#00B3C7" }}
                                                className="flex items-center gap-2 rounded-10 border-1.5 bg-white px-2 py-1 font-medium">
                                                <span className="text-gray-400">
                                                    {["DELETED"].includes(`${get(original, "status", "--")}`.toUpperCase())
                                                        ? t("hsm.editDisabled")
                                                        : t("hsm.deleteTemplate")}
                                                </span>
                                            </p>
                                        }
                                        theme={"badgeChat"}
                                        arrow={false}
                                        placement={"top"}>
                                        <div>
                                            <TrashIcon
                                                className="fill-current text-gray-375 hover:text-primary-200"
                                                width="1rem"
                                                height="1.125rem"
                                                fill={colorIcon(original, true)}
                                                fillOpacity={opacityIcon(original, true)}
                                            />
                                        </div>
                                    </Tippy>
                                </button>
                            )}
                        </div>
                    );
                },
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

    if (isLoading) {
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
                                                    style={headerStyles}>
                                                    <span className="flex h-12 min-w-[8rem] items-center justify-start">
                                                        {column.render("Header")}
                                                    </span>
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
                                                style={headerStyles}>
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                        </table>
                        {/* </Styles> */}
                        <div className="flex justify-center">
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("No existen campañas por monitorear")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-b-xl border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="mb-2 overflow-y-auto rounded-b-xl bg-white">
            <Styles>
                <table {...getTableProps()} className="tableContainer min-w-full rounded-xs">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={column.isSorted ? orderStyle : headerStyles}
                                        className="sticky top-0 border-b-2 border-b-primary-200">
                                        <div id="firstColumn" className="flex h-12 items-center justify-start gap-2">
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
                                <tr
                                    {...row.getRowProps()}
                                    className={"hover:bg-primary-400 hover:bg-opacity-30 hover:text-primary-200" + " " + styles.tdTml}>
                                    {row.cells.map((cell, index) => {
                                        return (
                                            <td {...cell.getCellProps()} style={cellStyles}>
                                                <div className="h-13 grid items-center ">{cell.render("Cell")}</div>
                                            </td>
                                        );
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
                            }}>
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
                            value={row}
                            onChange={(e) => {
                                setRows(Number(e.target.value));
                                setPageLimit(1);
                            }}>
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

export default TemplatesTable;
