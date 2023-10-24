import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { ForwardModal, Modal, TableSkeleton } from "@apps/shared/common";
import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";

import isEmpty from "lodash/isEmpty";
import { BlueFlagIcon, DownIcon, FlagIcon, ForwardIcon, GreenFlagIcon, PreviewIcon, RedFlagIcon, YellowFlagIcon } from "@apps/shared/icons";
import get from "lodash/get";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { EmailPreviewModal } from "libs/monitoring/ui-shared/src";
import { useSelector } from "react-redux";

const OperatorEmailTable = (props) => {
    const { data, nrows, pageLimit, maxPage, setPage, setRows, loading, totalResults, teamOptions } = props;
    const { t } = useTranslation();

    const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
    const [previewDetails, setPreviewDetails] = useState({});
    const [emailPreviewIsLoading, setEmailPreviewIsLoading] = useState(false);

    const [showForwardModal, setShowForwardModal] = useState(false);
    const [operatorSelected, setOperatorSelected] = useState(null);
    const [assignedTo, setAssignedTo] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loadingForwading, setLoadingForwading] = useState(false);
    const [ticketId, setTicketId] = useState(null);
    const company = useSelector((state) => state.company);
    const [emailInfo, setEmailInfo] = useState({});
    const byTeam = get(company, "properties.operatorView.byTeam", false);

    const getEmailInfo = async (ticketInfo) => {
        setEmailInfo(ticketInfo);
        setEmailPreviewIsLoading(true);
        const supportTicketId = get(ticketInfo, "_id", "");

        const emailNumber = get(ticketInfo, "number", "");
        const status = get(ticketInfo, "status", "");
        const title = get(ticketInfo, "title", "");
        const priority = get(ticketInfo, "priority", "");
        const bot = get(ticketInfo, "bot", "");
        const dueAt = get(ticketInfo, "dueAt", "");
        const assignationFlow = get(ticketInfo, "assignationFlow", "");
        const lifecycle = get(ticketInfo, "lifecycle", "");

        setShowEmailPreviewModal(true);

        try {
            const {
                data: { results: messages },
            } = await DashboardServer.get(`/companies/${company.id}/tickets/${supportTicketId}/emails`, {
                params: {
                    sort: "DESC",
                    limit: 20,
                },
            });

            const dueAtFormatted = dayjs(dueAt).format("MM/DD/YYYY");
            const emailsPayload = [...assignationFlow, ...lifecycle, ...messages];
            const emailSortByDate = emailsPayload.sort((a, b) => {
                var dateA = new Date(a.createdAt);
                var dateB = new Date(b.createdAt);
                return dateA - dateB;
            });

            const header = {
                bot,
                priority,
                emailNumber,
                status,
                title,
                dueAt: dueAtFormatted,
            };
            setEmailPreviewIsLoading(false);
            setPreviewDetails({ header: { ...header }, messagesAndEvents: [...emailSortByDate] });
        } catch (error) {
            setEmailPreviewIsLoading(false);
            console.log(error);
        }
    };

    const handlePreviewEmail = (emailInfo) => {
        getEmailInfo(emailInfo);
    };

    const forwardTransfer = () => {
        setLoadingForwading(true);
        const { value, id } = operatorSelected;

        JelouApiV1.post(`/support-tickets/assign`, {
            origin: "induced_by_admin",
            ...(byTeam ? { teamId: id } : { operatorId: value }),
            supportTicketId: ticketId,
        })
            .then(() => {
                setSuccess(true);
                setLoadingForwading(false);
                closeForwardModal();
                setTimeout(() => {
                    setOperatorSelected(null);
                    setSuccess(false);
                }, 2000);
            })
            .catch((err) => {
                console.error("ERROR", err);
                setLoadingForwading(false);
                setSuccess(false);
                setOperatorSelected(null);
            });
    };

    const handleForwardTicket = async (ticketInfo) => {
        const id = get(ticketInfo, "_id", "");
        setAssignedTo(get(ticketInfo, "assignedTo", ""));
        setTicketId(id);
        setEmailInfo(ticketInfo);
        setShowForwardModal(true);
    };

    const onChangeForward = (operator) => {
        setOperatorSelected(operator);
    };

    const closeForwardModal = () => {
        setShowForwardModal(false);
        setOperatorSelected(null);
    };

    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.No Email"),
                accessor: (row) => get(row, "number", ""),
                Cell: ({ row: { original } }) => {
                    return <div>{`${get(original, "number", "")}`}</div>;
                },
            },
            {
                Header: t("monitoring.Estado"),
                accessor: (row) => get(row, "status", ""),
                Cell: ({ row: { original } }) => {
                    const status = get(original, "status", "");
                    return (
                        <div className={`flex w-24 justify-center rounded-xl py-1 ${getStatusBgColor(status)} ${getStatusTextColor(status)}`}>
                            {t(`emailStatus.${status}`)}
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.Destinatario"),
                accessor: (row) => get(row, "creationDetails.To", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="w-32">
                            <Tippy content={`${get(original, "creationDetails.To", "")}`} theme="light" arrow={false} placement={"bottom"}>
                                <p className="truncate">{`${get(original, "creationDetails.To", "")}`}</p>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.Asunto"),
                accessor: (row) => get(row, "title", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="w-64 ">
                            <Tippy content={`${get(original, "title", "")}`} theme="light" arrow={false} placement={"bottom"}>
                                <p className="truncate">{`${get(original, "title", "")}`}</p>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.Equipo"),
                accessor: (row) => get(row, "team.name", ""),
                Cell: ({ row: { original } }) => {
                    return <div>{`${get(original, "team.name", "")}`}</div>;
                },
            },
            {
                Header: t("monitoring.Creación"),
                accessor: (row) => get(row, "createdAt", ""),
                Cell: ({ row: { original } }) => {
                    const formattedDate = dayjs(get(original, "createdAt", "")).format("DD/MM/YYYY HH:mm");

                    return <div>{formattedDate}</div>;
                },
            },
            {
                Header: t("monitoring.Acciones"),
                accessor: (row) => get(row, "created", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex gap-3">
                            <button onClick={() => handleForwardTicket(original)}>
                                <ForwardIcon
                                    className="text-gray-400 text-opacity-75"
                                    width="1.25rem"
                                    height="1.25rem"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="currentColor"
                                />
                            </button>
                            <button
                                onClick={() => {
                                    handlePreviewEmail(original);
                                }}>
                                <PreviewIcon height="1.25rem" />
                            </button>
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

    const priority = get(previewDetails, "header.priority", "");

    const priorityFlagIcon = () => {
        switch (priority) {
            case "urgent":
                return <RedFlagIcon height="1.26rem" width="1.26rem" />;

            case "high":
                return <YellowFlagIcon height="1.26rem" width="1.26rem" />;

            case "normal":
                return <GreenFlagIcon height="1.26rem" width="1.26rem" />;

            case "low":
                return <BlueFlagIcon height="1.26rem" width="1.26rem" />;

            default:
                return <FlagIcon height="1.26rem" width="1.26rem" className={`fill-current text-gray-400`} fillOpacity={"1"} />;
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case "open":
                return "text-primary-200";
            case "new":
                return "text-yellow-1020";
            case "pending":
                return "text-red-950";
            case "closed":
                return "text-gray-400";
            case "resolved":
                return "text-green-960";
            case "draft":
                return "text-gray-400";
            default:
                break;
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case "open":
                return "bg-primary-15";
            case "new":
                return "bg-yellow-20";
            case "pending":
                return "bg-red-20";
            case "closed":
                return "bg-gray-200";
            case "resolved":
                return "bg-green-20";
            case "draft":
                return "bg-gray-20";
            default:
                break;
        }
    };

    const getDateColor = (dueDate) => {
        const dayInSeconds = 86400;

        const diffenceSeconds = dayjs(dueDate).diff(dayjs(), "seconds");

        if (diffenceSeconds < 1 && dueDate !== undefined) {
            return "red-950";
        }

        if (diffenceSeconds > 1 && diffenceSeconds < dayInSeconds * 3 && dueDate !== undefined) {
            return "orange-650";
        }

        if (diffenceSeconds > dayInSeconds * 3 && dueDate !== undefined) {
            return "green-960";
        }
        return "gray-400";
    };

    if (loading) {
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
                            <div className="flex h-72 items-center text-sm text-gray-400 text-opacity-75">{t("monitoring.No existen Emails")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t-1 border-gray-100 border-opacity-25 bg-white px-4 py-6"></div>
            </div>
        );
    }

    return (
        <div className="max-h-60 overflow-y-auto rounded-xl bg-white">
            <div className="inline-block min-w-full max-w-full bg-white align-middle">
                <table {...getTableProps()} className="min-w-full rounded-xs">
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
                                <tr {...row.getRowProps()} className="hover:bg-primary-400 hover:bg-opacity-30 hover:text-primary-200">
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
                                setPage(pageLimit - 1);
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
                        <button className="p-2" onClick={() => setPage(pageLimit + 1)}>
                            <div className="h-6 w-6 text-gray-375"> {">"}</div>
                        </button>
                    )}
                </div>
                <div className="flex justify-center space-x-1 text-13 text-gray-400 sm:w-1/3">
                    <span className="font-semibold text-primary-200">{totalResults}</span>
                    <span>{t("clients.results")}</span>
                </div>
                <div className="flex justify-end text-gray-400 sm:w-1/3">
                    <select
                        className="mr-5 flex cursor-pointer appearance-none justify-between border-transparent text-sm leading-5 text-gray-500"
                        value={nrows}
                        onChange={(e) => {
                            setRows(Number(e.target.value));
                            setPage(1);
                        }}>
                        {[50, 60, 70, 80, 90].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} {t("filas")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {showForwardModal && (
                <Modal>
                    <div className="fixed inset-x-0 bottom-0 z-120 px-4 pb-6 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 z-20 bg-gray-500 opacity-50"></div>
                        </div>
                        <ForwardModal
                            submitChange={forwardTransfer}
                            onChange={onChangeForward}
                            success={success}
                            operatorSelected={operatorSelected}
                            loadingForwading={loadingForwading}
                            changeParse
                            closeForwardModal={closeForwardModal}
                            teamOptions={teamOptions}
                            assignedTo={assignedTo}
                            cases={emailInfo}
                            notAssignedTab={true}
                        />
                    </div>
                </Modal>
            )}
            {showEmailPreviewModal && (
                <EmailPreviewModal
                    emailInfo={emailInfo}
                    emailPreviewIsLoading={emailPreviewIsLoading}
                    getStatusBgColor={getStatusBgColor}
                    getStatusTextColor={getStatusTextColor}
                    getDateColor={getDateColor}
                    previewDetails={previewDetails}
                    setShowEmailPreviewModal={setShowEmailPreviewModal}
                    priorityFlagIcon={priorityFlagIcon}
                    t={t}
                />
            )}
        </div>
    );
};

export default OperatorEmailTable;

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
};
