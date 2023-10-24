import { TableSkeleton } from "@apps/shared/common";
import { DownIcon, EyesIcon, LineChartIcon, OutlineDownloadIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { usePagination, useSortBy, useTable } from "react-table";
import { EditModule } from "./Components/EditModule";
import { ReSchedule } from "./Components/Reschedule";

import { Styles } from "./Components/table-container";

const CampaignsTable = (props) => {
    const { data, isLoading, pageLimit, setPageLimit, row, setRows, maxPage, loadingDownload, totalResults, colum, handleUpdate, openViewCampaign } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

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
        cursor: "pointer",
    };

    const statusColor = {
        CANCELLED: "bg-[#FFF3CE] text-[#D39C00]",
        COMPLETED: "bg-green-20 text-green-960",
        SUCCESSFUL: "bg-[#DEF1EE] text-[#209F8B]",
        SCHEDULED: "bg-[#D9F4F7] text-[#00B3C7]",
        REJECTED: "bg-red-1040 text-red-1030",
        PENDING: "bg-[#E4E8EE] text-[#727C94]",
        IN_PROGRESS: "bg-gray-10 text-gray-400",
        FAILED: "bg-red-200 text-red-1000",
    };

    const Badge = (value) => {
        return (
            <div>
                <span className={`rounded-xl px-3 py-1 font-bold capitalize ${statusColor[value.value]}`}>{t(`hsm.${toLower(value.value)}`)}</span>
            </div>
        );
    };

    let columns = useMemo(
        () => [
            {
                id: "name",
                Header: t("tables.Nombre"),
                accessor: (row) => row.name,
            },
            {
                id: "rowCount",
                Header: t("tables.No. Destinatarios"),
                accessor: (row) => row.rowCount,
            },
            {
                id: "status",
                Header: t("monitoring.Estado"),
                accessor: (row) => row.status,
                Cell: ({ cell: { value } }) => <Badge value={value} />,
            },
            {
                id: "createdAt",
                Header: t("tables.Fecha de Envío"),
                Cell: ({ row: { original } }) => <ReSchedule original={original} handleUpdate={handleUpdate} />,
                accessor: (row) => row.createdAt,
            },
            {
                id: "storageUrl",
                Header: t("tables.Plantilla"),
                accessor: (row) => get(row, "metadata.elementName", "-"),
            },
            {
                id: "action",
                Header: t("tables.Acciones"),
                Cell: ({ row: { original } }) => (
                    <div className="flex items-center space-x-3">
                        <Tippy
                            arrow={false}
                            placement="top"
                            theme="badgeChat"
                            content={
                                <p style={{ color: "#00B3C7", borderColor: "#00B3C7" }} className="flex items-center gap-2 rounded-10 border-1.5 bg-white px-2 py-1 font-medium">
                                    <span className="text-gray-400">{t("clients.download")}</span>
                                </p>
                            }
                        >
                            <a className="flex items-center justify-center" href={get(original, "storageUrl", "")} target="_blank" download rel="noreferrer">
                                {loadingDownload ? <ClipLoader color={"white"} size="1.1875rem" /> : <OutlineDownloadIcon width="1.375rem" height="1.3125rem" />}
                            </a>
                        </Tippy>

                        <Tippy
                            arrow={false}
                            placement="top"
                            theme="badgeChat"
                            content={
                                <p style={{ color: "#00B3C7", borderColor: "#00B3C7" }} className="flex items-center gap-2 rounded-10 border-1.5 bg-white px-2 py-1 font-medium">
                                    <span className="text-gray-400">{t("hsm.monitoring.Ver campaña")}</span>
                                </p>
                            }
                        >
                            <button className="items-center justify-center" onClick={() => openViewCampaign(original)}>
                                <EyesIcon className="fill-current text-gray-100 hover:text-primary-200" width="1.4375rem" height="0.9375rem" />
                            </button>
                        </Tippy>

                        {original.status === "COMPLETED" ? (
                            <Tippy
                                arrow={false}
                                placement="top"
                                theme="badgeChat"
                                content={
                                    <p style={{ color: "#00B3C7", borderColor: "#00B3C7" }} className="flex items-center gap-2 rounded-10 border-1.5 bg-white px-2 py-1 font-medium">
                                        <span className="text-gray-400">{t("hsm.monitoring.Ver rendimiento")}</span>
                                    </p>
                                }
                            >
                                <Link
                                    to={{ pathname: `/hsm/campaigns/${original._id}:${original.botId}` }}
                                    onClick={() => localStorage.setItem("campaignDate", original.createdAt)}
                                    className="flex cursor-pointer"
                                >
                                    <LineChartIcon width="18" height="17" className="fill-current text-gray-100 hover:text-primary-200" />
                                </Link>
                            </Tippy>
                        ) : (
                            <div className="flex cursor-not-allowed rounded-full">
                                <LineChartIcon width="18" height="17" fill="#E4E7ED" />
                            </div>
                        )}
                        <EditModule original={original} handleUpdate={handleUpdate} />
                    </div>
                ),
            },
        ],
        [colum, pageLimit, data]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useSortBy, usePagination);
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
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("No existen campañas por monitorear")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-b-xl border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    const handleCampaignInfo = (e, row) => {
        const createdAt = get(row, "original.createdAt", {});
        const id = get(row, "original._id", {});
        const botId = get(row, "original.botId", {});

        localStorage.setItem("campaignDate", createdAt);
        navigate(`/hsm/campaigns/${id}:${botId}`);
    };

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
                                        className="sticky top-0 border-b-2 border-b-primary-200"
                                    >
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
                                <tr {...row.getRowProps()} className="hover:bg-primary-400 hover:bg-opacity-30 hover:text-primary-200">
                                    {row.cells.map((cell, index) => {
                                        if (index === 5 || (index === 3 && toUpper(row.original.status) !== "COMPLETED" && toUpper(row.original.status) !== "SUCCESFULL")) {
                                            return (
                                                <td {...cell.getCellProps()} style={cellStyles}>
                                                    <div className="h-13 grid items-center">{cell.render("Cell")}</div>
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td {...cell.getCellProps()} style={cellStyles} onClick={(e) => handleCampaignInfo(e, row)}>
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
                            value={row}
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

export default CampaignsTable;
