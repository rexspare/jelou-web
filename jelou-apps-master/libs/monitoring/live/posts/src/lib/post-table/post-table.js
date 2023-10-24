import get from "lodash/get";
import first from "lodash/first";
import orderBy from "lodash/orderBy";
import toLower from "lodash/toLower";

import dayjs from "dayjs";
import Tippy from "@tippyjs/react";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "@apps/monitoring/ui-shared";

import { useSelector } from "react-redux";
import { JelouApiV1 } from "@apps/shared/modules";
import { ForwardModal, Modal } from "@apps/shared/common";
import { ForwardIcon, PreviewIcon } from "@apps/shared/icons";
import PostPreviewModal from "../post-preview-modal/post-preview-modal";

const PostTable = (props) => {
    const { data = [], isLoadingPostTable, page, setPage, totalResults, rows, setRows, maxPage, teamOptions } = props;
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const { t } = useTranslation();
    const { lang = "" } = userSession;
    const [selectedPost, setSelectedPost] = useState("");
    const [showPostPreviewModal, setShowPostPreviewModal] = useState(false);
    const [showForwardModal, setShowForwardModal] = useState(false);

    const [operatorSelected, setOperatorSelected] = useState({});
    const [success, setSuccess] = useState(false);
    const [loadingForwading, setLoadingForwading] = useState(false);
    const [notAssignedTab, setNotAssignedTab] = useState(true);

    const [postPreviewIsLoading, setPostPreviewIsLoading] = useState(false);
    const [postInfo, setPostInfo] = useState({});

    const getStatusTextColor = (status) => {
        switch (status) {
            case "created":
                return "text-secondary-150";
            case "in_queue":
                return "text-secondary-150";
            case "assigned":
                return "text-primary-200";
            case "closed_by_operator":
                return "text-secondary-425";
            default:
                break;
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case "created":
                return "bg-[#FFE185] bg-opacity-25";
            case "in_queue":
                return "bg-[#FFE185] bg-opacity-25";
            case "assigned":
                return "bg-primary-15";
            case "closed_by_operator":
                return "bg-secondary-425 bg-opacity-25";
            default:
                break;
        }
    };

    const handleForwardPost = async (ticketInfo) => {
        const { state = "", status = "" } = ticketInfo;
        if (toLower(status) === "created" || state === "in_queue") {
            setNotAssignedTab(true);
        } else {
            setNotAssignedTab(false);
        }
        setSelectedPost(ticketInfo);
        setShowForwardModal(true);
    };

    //revisar transferencia no se cierra el modal
    // vamos a manejar estado transferidos?
    const forwardTransferSubmit = () => {
        try {
            const { providerId = "" } = operatorSelected;
            setLoadingForwading(true);
            const { roomId } = selectedPost;
            const payload = {
                from: {
                    referenceId: userSession.providerId,
                    memberType: "operator",
                },
                to: {
                    referenceId: providerId.toString(),
                    memberType: "operator",
                },
                replyId: get(selectedPost, "_id", null),
            };
            setLoadingForwading(true);

            JelouApiV1.post(`/rooms/${roomId}/members/transfer`, payload)
                .then((res) => {
                    setSuccess(true);
                    setLoadingForwading(false);
                    setOperatorSelected(null);
                })
                .catch((err) => {
                    console.error("ERROR", err);
                    setSuccess(false);
                    setLoadingForwading(false);
                    setOperatorSelected(null);
                });
        } catch (err) {
            console.log("err", err);
        }
    };

    const onChangeForward = (operator) => {
        setOperatorSelected(operator);
    };
    const [postMessages, setPostMessages] = useState([]);

    const handlePreviewPost = async (ticketInfo) => {
        try {
            setPostPreviewIsLoading(true);
            setSelectedPost(ticketInfo);
            setShowPostPreviewModal(true);
            const { id: companyId } = company;
            const roomId = get(ticketInfo, "roomId", "G:1363986947119710200:1607793885568286721");
            const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/room/${roomId}`);
            const {
                data: { data: messages },
            } = await JelouApiV1.get(`/rooms/${roomId}`);
            const { data: room } = response;
            setPostInfo(first(room));
            setPostMessages([messages]);
            setPostPreviewIsLoading(false);
        } catch (err) {
            console.log("err", err);
            setPostPreviewIsLoading(false);
        }
    };

    const closeForwardModal = () => {
        setShowForwardModal(false);
        setOperatorSelected(null);
        setSuccess(false);
    };

    const badgeChannel = (channel) => {
        switch (toLower(channel)) {
            case "twitter_replies":
                return (
                    <span className="flex w-24 items-center justify-center rounded-1 bg-primary-20 bg-opacity-40 py-1 text-[#42ADE2]">Twitter</span>
                );
            case "facebook_feed":
                return (
                    <span className="flex w-24 items-center justify-center rounded-1 bg-[#00B3C7] bg-opacity-15 py-1 text-[#00B3C7]">Facebook</span>
                );
            default:
                return <span className="flex w-24 items-center justify-center rounded-1 bg-primary-20 py-1 text-[#42ADE2]">Twitter</span>;
        }
    };

    const getName = (row) => {
        const { sender = {}, user = {} } = row;
        if (sender.metadata?.names) {
            return sender.metadata?.names;
        }
        if (user?.names) {
            return user?.names;
        }
        if (user) {
            return user;
        }
        return "--";
    };

    const copyToClipboard = (original, elementId) => {
        document.getElementById(`custom-tooltip-${elementId}`).style.display = "inline";
        navigator.clipboard.writeText(get(original, "roomId", ""));
        setTimeout(function () {
            document.getElementById(`custom-tooltip-${elementId}`).style.display = "none";
        }, 600);
    };

    const getBadgeStyle = (priority) => {
        switch (priority) {
            case 0:
                return "bg-red-1050 text-red-10 flex font-medium text-xs leading-4 min-w-1 items-center justify-center rounded-1 px-3 py-1";
            case 1:
                return "bg-red-20 text-red-950 flex font-medium text-xs leading-4 min-w-1 items-center justify-center rounded-1 px-3 py-1";
            case 2:
                return "bg-yellow-200 text-yellow-600 flex font-medium text-xs leading-4 min-w-1 items-center justify-center rounded-1 px-3 py-1";
            case 3:
                return "bg-blue-200 text-blue-800 flex font-medium text-xs leading-4 min-w-1 items-center justify-center rounded-1 px-3 py-1";
            case 4:
                return "bg-blue-20 text-secondary-425 flex font-medium text-xs leading-4 min-w-1 items-center justify-center rounded-1 px-3 py-1";

            default:
                return "bg-gray-20 text-gray-400 flex font-medium text-xs leading-4 min-w-1 items-center justify-center rounded-1 px-3 py-1";
        }
    };

    const getTextPriority = (priority) => {
        switch (priority) {
            case 0:
                return t("monitoring.urgent");
            case 1:
                return t("monitoring.veryHigh");
            case 2:
                return t("monitoring.high");
            case 3:
                return t("monitoring.medium");
            case 4:
                return t("monitoring.low");
            default:
                return t("monitoring.veryLow");
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.Operador"),
                accessor: (row) => get(row, "assignedTo.names", "--"),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="w-36">
                            <Tippy content={`${get(original, "assignedTo.names", "")}`} theme="light" arrow={false} placement={"bottom"}>
                                <p className="truncate">{`${get(original, "assignedTo.names", "--")}`}</p>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.Nombre"),
                accessor: (row) => get(row, "sender.metadata.names", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="w-32">
                            <Tippy content={`${getName(original)}`} theme="light" arrow={false} placement={"bottom"}>
                                <p className="truncate">{`${getName(original)}`}</p>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                Header: "No Ticket",
                accessor: (row) => get(row, "roomId", ""),
                Cell: ({ row: { original } }) => {
                    const id = get(original, "_id", "");
                    return (
                        <button onClick={() => copyToClipboard(original, id)}>
                            <Tippy content={get(original, "roomId", "")} theme="light" placement="bottom">
                                <div className="flex w-32 flex-col">
                                    <p className="truncate">{`${get(original, "roomId", "")}`}</p>
                                    <span
                                        className="absolute mt-5 hidden rounded-xl bg-primary-10 px-2 py-1 text-primary-200"
                                        id={`custom-tooltip-${id}`}>
                                        {t("monitoring.Copiado")}
                                    </span>
                                </div>
                            </Tippy>
                        </button>
                    );
                },
            },
            {
                Header: t("monitoring.canal"),
                accessor: (row) => get(row, "bot.type", ""),
                Cell: ({ row: { original } }) => {
                    const channel = toLower(get(original, "bot.type", get(original, "botType", "")));

                    return badgeChannel(channel);
                },
            },
            {
                Header: t("monitoring.Estado"),
                accessor: (row) => get(row, "state", get(row, "state", "")),
                Cell: ({ row: { original } }) => {
                    const status = toLower(get(original, "status", get(original, "state", "")));
                    return (
                        <span className={`flex w-24 justify-center rounded-1 py-1 ${getStatusBgColor(status)} ${getStatusTextColor(status)}`}>
                            {t(`monitoring.${status}`)}
                        </span>
                    );
                },
            },
            {
                Header: t("monitoring.priority"),
                name: "priorityComlumn",
                accessor: (row) => get(row, "priority", "-"),
                Cell: ({ row: { original } }) => {
                    const priority = get(original, "priority", "-");
                    return (
                        <div className={getBadgeStyle(priority)}>
                            <p className="uppercase">{getTextPriority(priority)}</p>
                            {priority > 4 ? `(${priority})` : null}
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.Equipo"),
                accessor: (row) => get(row, "team.name", get(row, "team", "--")),
                Cell: ({ row: { original } }) => {
                    return <div>{`${get(original, "team.name", get(original, "team", "--"))}`}</div>;
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
                    const isAttended =
                        toLower(get(original, "status", "")) === "closed_by_operator" || toLower(get(original, "status", "")) === "attended";
                    const isAssigned = toLower(get(original, "status", "")) === "assigned";

                    return (
                        <div className="flex gap-3">
                            <Tippy
                                content={isAttended ? "-" : isAssigned ? t("monitoring.Transferir") : t("monitoring.Asignar")}
                                theme="light"
                                arrow={false}
                                placement={"bottom"}>
                                {isAttended ? (
                                    <div>-</div>
                                ) : (
                                    <button
                                        className={`${isAttended && "cursor-not-allowed"}`}
                                        disabled={isAttended}
                                        onClick={() => handleForwardPost(original)}>
                                        <ForwardIcon
                                            className="text-gray-400 text-opacity-75"
                                            width="1.25rem"
                                            height="1.25rem"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            fill="currentColor"
                                        />
                                    </button>
                                )}
                            </Tippy>
                            <Tippy content={`${t("monitoring.preview")}`} theme="light" arrow={false} placement={"bottom"}>
                                <button
                                    onClick={() => {
                                        handlePreviewPost(original);
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
        [data, lang]
    );

    return (
        <div>
            <Table
                row={rows}
                data={orderBy(data, ["wasReplied"], ["asc"])}
                columns={columns}
                maxPage={maxPage}
                setRows={setRows}
                loading={isLoadingPostTable}
                actualPage={page}
                totalResults={totalResults}
                noDataMessage={t("monitoring.No hay publicaciones")}
                setActualPage={setPage}
                loadingColumns={columns.length}
            />
            {showForwardModal && (
                <Modal>
                    <div className="fixed inset-x-0 bottom-0 z-120 px-4 pb-6 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 z-20 bg-gray-500 opacity-50"></div>
                        </div>
                        <ForwardModal
                            closeForwardModal={closeForwardModal}
                            onChange={onChangeForward}
                            submitChange={forwardTransferSubmit}
                            success={success}
                            operatorSelected={operatorSelected}
                            loadingForwading={loadingForwading}
                            teamOptions={teamOptions}
                            notAssignedTab={notAssignedTab}
                            isPost={true}
                            useAllOperators={true}
                            sortField={false}
                        />
                    </div>
                </Modal>
            )}
            {showPostPreviewModal && (
                <PostPreviewModal
                    postPreviewIsLoading={postPreviewIsLoading}
                    setShowPostPreviewModal={setShowPostPreviewModal}
                    postInfo={postInfo}
                    postMessages={postMessages}
                />
            )}
        </div>
    );
};

export default PostTable;
