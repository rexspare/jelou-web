import get from "lodash/get";
import orderBy from "lodash/orderBy";

import Tippy from "@tippyjs/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { EmailPreviewModal, Table } from "libs/monitoring/ui-shared/src";
import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import { ForwardModal, Modal, TableSkeleton } from "@apps/shared/common";
// import EmailPreviewModal from "../email-preview-modal/email-preview-modal";
import { BlueFlagIcon, FlagIcon, ForwardIcon, GreenFlagIcon, PreviewIcon, RedFlagIcon, YellowFlagIcon } from "@apps/shared/icons";

const SupportTicketsTable = (props) => {
    const {
        botEmail,
        data,
        pageNumber,
        setPageNumber,
        maxPageNumber,
        rowsPageNumber,
        setRowsPageNumber,
        ticketsIsLoading,
        totalResults,
        operatorOptions,
        teamOptions,
        currentTab,
    } = props;

    const notAssignedTab = currentTab === "notAssigned";

    const { t } = useTranslation();
    const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
    const [previewDetails, setPreviewDetails] = useState({});
    const [emailPreviewIsLoading, setEmailPreviewIsLoading] = useState(false);

    // const [dueDateColor, setDueDateColor] = useState(null);

    const [showForwardModal, setShowForwardModal] = useState(false);
    const [operatorSelected, setOperatorSelected] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loadingForwading, setLoadingForwading] = useState(false);
    const [assignedTo, setAssignedTo] = useState(false);
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

    const priority = get(previewDetails, "header.priority", "");

    const priorityFlagTitle = () => {
        switch (priority) {
            case "urgent":
                return t("monitoring.urgent");

            case "high":
                return t("monitoring.high");

            case "normal":
                return t("monitoring.normal");

            case "low":
                return t("monitoring.low");

            default:
                return t("monitoring.noPriority");
        }
    };

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

    const forwardTransfer = () => {
        const { value, id } = operatorSelected;

        setLoadingForwading(true);

        JelouApiV1.post(`/support-tickets/assign`, {
            origin: notAssignedTab ? "induced_by_admin" : "transfer",
            ...(byTeam ? { teamId: id } : { operatorId: value }),
            supportTicketId: ticketId,
        })
            .then(() => {
                setSuccess(true);
                setLoadingForwading(false);

                setTimeout(() => {
                    setOperatorSelected(null);
                    setSuccess(false);
                    setShowForwardModal(false);
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
        setShowForwardModal(true);
    };

    const onChangeForward = (operator) => {
        setOperatorSelected(operator);
    };

    const closeForwardModal = () => {
        setShowForwardModal(false);
        setOperatorSelected(null);
    };
    const language = localStorage.getItem("lang");
    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.operador"),
                accessor: (row) => get(row, "assignedTo.names", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="w-36">
                            <Tippy content={`${get(original, "assignedTo.names", "")}`} theme="light" arrow={false} placement={"bottom"}>
                                <p className="truncate">{`${get(original, "assignedTo.names", "")}`}</p>
                            </Tippy>
                        </div>
                    );
                },
            },
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
                        <div className={`flex w-24 justify-center rounded-1 py-1 ${getStatusBgColor(status)} ${getStatusTextColor(status)}`}>
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
                Header: t("monitoring.leido"),
                accessor: (row) => get(row, "read", ""),
                Cell: ({ row: { original } }) => {
                    const read = get(original, "read", "");
                    return (
                        <div className={`flex w-24 justify-center rounded-1 py-1 ${read ? "bg-teal-200 text-teal-800" : "bg-red-20 text-red-800"} `}>
                            {read ? t("monitoring.leido") : t("monitoring.noLeido")}
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
                            <Tippy content={`${t("monitoring.Transferir")}`} theme="light" arrow={false} placement={"bottom"}>
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
                            </Tippy>
                            <Tippy content={`${t("monitoring.preview")}`} theme="light" arrow={false} placement={"bottom"}>
                                <button
                                    onClick={() => {
                                        handlePreviewEmail(original);
                                    }}>
                                    <PreviewIcon height="1.25rem" />
                                </button>
                            </Tippy>
                        </div>
                    );
                },
                sticky: "left",
            },
        ],
        [data, language]
    );

    let loadingSkeleton = [];

    for (let i = 0; i < 10; i++) {
        loadingSkeleton.push(<TableSkeleton number={columns.length} key={i} />);
    }

    return (
        <div>
            <Table
                row={rowsPageNumber}
                data={orderBy(data, ["wasReplied"], ["asc"])}
                columns={columns}
                maxPage={maxPageNumber}
                setRows={setRowsPageNumber}
                loading={ticketsIsLoading}
                actualPage={pageNumber}
                totalResults={totalResults}
                noDataMessage={t("monitoring.No hay emails")}
                setActualPage={setPageNumber}
                loadingColumns={9}
            />

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
                    priorityFlagTitle={priorityFlagTitle}
                    t={t}
                />
            )}
            {showForwardModal && (
                <Modal>
                    <div className="fixed inset-x-0 bottom-0 z-120 px-4 pb-6 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 z-20 bg-gray-500 opacity-50"></div>
                        </div>
                        <ForwardModal
                            botEmail={botEmail}
                            operatorOptions={operatorOptions}
                            submitChange={forwardTransfer}
                            onChange={onChangeForward}
                            success={success}
                            operatorSelected={operatorSelected}
                            loadingForwading={loadingForwading}
                            changeParse
                            closeForwardModal={closeForwardModal}
                            teamOptions={teamOptions}
                            notAssignedTab={notAssignedTab}
                            assignedTo={assignedTo}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SupportTicketsTable;
