import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emailsViewEnable, getTime } from "@apps/shared/utils";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import first from "lodash/first";
import reverse from "lodash/reverse";
import sortBy from "lodash/sortBy";
import { useTranslation } from "react-i18next";
import { JelouApiV1 } from "@apps/shared/modules";
import {
    addEmail,
    addMessages,
    deleteEmails,
    setCurrentEmail,
    setNextDraftRoom,
    setNotReadEmails,
    setShowDraft,
    updateCurrentEmail,
} from "@apps/redux/store";
import { GreetingEmailIcon, StarFillIcon, StarIcon1 } from "@apps/shared/icons";
import { ForwardEmail, MassiveModal, Table } from "@apps/pma/ui-shared";
import EmailActionsFilters from "../email-actions-filters/email-actions-filters";
import Email from "../email/email";
import DueDatePicker from "./due-date-picker";

const EmailInbox = (props) => {
    const {
        getEmails,
        showEmail,
        setShowEmail,
        total,
        totalPages,
        actualPage,
        setActualPage,
        status,
        from,
        setFrom,
        loadingSearchEmail,
        getExpiredEmails,
        getNotReadEmails,
        getAllEmails,
    } = props;
    const { t } = useTranslation();
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const mails = useSelector((state) => state.emails);
    const query = useSelector((state) => state.query);
    const notReadEmails = useSelector((state) => state.notReadEmails);
    const emailQuerySearch = useSelector((state) => state.emailQuerySearch);
    const [selectedRow, setSelectedRow] = useState({});
    const bots = useSelector((state) => state.bots);
    const time = dayjs().locale("es").format("HH:mm");
    const greeting = getTime(time, t);
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));
    const dispatch = useDispatch();
    const showChat = useSelector((state) => state.showChat);
    const userTeams = useSelector((state) => state.userTeams);
    const showDraft = useSelector((state) => state.showDraft);
    const actualTray = useSelector((state) => state.actualTray);

    const [type, setType] = useState({});

    const [loadingEmails, setLoadingEmails] = useState(false);
    const [emails, setEmails] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [dataRow, setDataRow] = useState([]);
    const [showMassiveModal, setShowMassiveModal] = useState(false);
    const [operatorSelected, setOperatorSelected] = useState("");
    const [loadingForwading, setLoadingForwading] = useState("");
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [success, setSuccess] = useState(false);

    const inClosedEmails = status === "closed";

    const canViewEmails = emailsViewEnable(userTeams);

    useEffect(() => {
        setSelectedRows({});
        setDataRow([]);
    }, [mails]);

    const setAsNotRead = (row) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, read: false };
        JelouApiV1.put(`support-tickets/${keyId}`, {
            read: false,
        }).catch((error) => {
            console.log(error);
        });
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        close();
    };

    const setAsFavorite = (row) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, isFavorite: true };
        dispatch(addEmail(updatedcurrentEmail));
        JelouApiV1.put(`support-tickets/${keyId}/?sort=DESC&limit=10`, {
            isFavorite: true,
        }).catch((error) => console.log("ERROR: ", error));
        close();
    };

    const setAsFavoriteF = (row) => {
        const isFavorite = get(row, "isFavorite", false);
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, isFavorite: !isFavorite };
        dispatch(addEmail(updatedcurrentEmail));
        JelouApiV1.put(`support-tickets/${keyId}`, {
            isFavorite: !isFavorite,
        }).catch((error) => console.log("ERROR: ", error));
        close();
    };

    const setAsRead = (row, open = false) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, read: true };
        JelouApiV1.put(`support-tickets/${keyId}`, {
            read: true,
        }).catch((error) => {
            console.log(error);
        });
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));

        if (open) {
            dispatch(setNotReadEmails({ operation: "subtract", value: 1 }));
        }
        close();
    };

    const setAsPending = (row) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, status: "pending" };
        JelouApiV1.put(`support-tickets/${keyId}`, {
            status: "pending",
        }).catch((error) => {
            console.log(error);
        });
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        close();
    };

    const setAsResolved = (row) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, status: "resolved" };
        JelouApiV1.put(`support-tickets/${keyId}`, {
            status: "resolved",
        }).catch((error) => {
            console.log(error);
        });
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        close();
    };

    const setAllAsResolved = () => {
        dataRow.forEach((row) => {
            setAsResolved(get(row, "original", {}));
        });
    };

    const setAsClosed = (row) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, read: true };
        JelouApiV1.put(`support-tickets/${keyId}`, {
            status: "closed",
        }).catch((error) => {
            console.log(error);
        });
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        dispatch(deleteEmails(row._id));
        close();
    };

    const setPriority = (row) => {
        const { _id: keyId } = row;
        const updatedcurrentEmail = { ...row, priority: get(type, "priorityType", "") };

        JelouApiV1.put(`support-tickets/${keyId}/?sort=DESC&limit=10`, {
            priority: get(type, "priorityType", ""),
        }).catch((error) => console.log("ERROR: ", error));
        dispatch(updateCurrentEmail(updatedcurrentEmail));
        dispatch(addEmail(updatedcurrentEmail));
        close();
    };

    const setAllPriority = () => {
        dataRow.forEach((row) => {
            setPriority(get(row, "original", {}));
        });
    };

    const setAllAsFavorite = () => {
        dataRow.forEach((row) => {
            setAsFavorite(get(row, "original", {}));
        });
    };

    const setAllAsNotRead = () => {
        const emailsToReadFalse = dataRow.filter((el) => el.original.read === true);
        if (toUpper(actualTray) !== "DRAFT") {
            dispatch(setNotReadEmails({ operation: "add", value: emailsToReadFalse.length }));
        }
        dataRow.forEach((row) => {
            setAsNotRead(get(row, "original", {}));
        });
    };

    const setAllAsRead = () => {
        const emailsToReadTrue = dataRow.filter((el) => el.original.read === false);
        if (toUpper(actualTray) !== "DRAFT") {
            dispatch(setNotReadEmails({ operation: "subtract", value: emailsToReadTrue.length }));
        }
        dataRow.forEach((row) => {
            setAsRead(get(row, "original", {}));
        });
    };

    const setAllAsPending = () => {
        dataRow.forEach((row) => {
            setAsPending(get(row, "original", {}));
        });
    };

    const setAllAsClosed = () => {
        dataRow.forEach((row) => {
            setAsClosed(get(row, "original", {}));
        });
    };

    const transferAll = () => {
        dataRow.forEach((row) => {
            forwardTransfer(get(row, "original", {}));
        });
    };

    const columns = useMemo(
        () => [
            {
                Header: " ",
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center">
                            <button className="disabled:cursor-not-allowed" disabled={inClosedEmails} onClick={() => setAsFavoriteF(original)}>
                                {original.isFavorite ? (
                                    <StarFillIcon height="1rem" width="1.2rem" className="fill-current text-[#D39C00]" />
                                ) : (
                                    <StarIcon1 height="1rem" width="1.2rem" className={`text-gray-400" fill-current`} />
                                )}
                            </button>
                        </div>
                    );
                },
            },
            {
                Header: t("No. Email"),
                accessor: (row) => get(row, "number", ""),
                Cell: ({ row: { original } }) => {
                    return <div>{`#${get(original, "number", "")}`}</div>;
                },
            },
            {
                Header: t("pma.Estado"),
                accessor: (row) => row.type,
                Cell: ({ row: { original } }) => {
                    const type = get(original, "status", "");
                    const badgeStyle = "justify-center inline-flex items-center h-[18px] px-2 rounded-[7px] text-[10px] font-bold";
                    switch (toUpper(type)) {
                        case "NEW":
                            return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{t(`pma.${type}`)}</span>;
                        case "OPEN":
                            return <span className={`${badgeStyle} bg-[#00B3C71A] uppercase text-[#00B3C7]`}>{t(`pma.${type}`)}</span>;
                        case "PENDING":
                            return <span className={`${badgeStyle} bg-[#E47B6A40] uppercase text-[#B95C49]`}>{t(`pma.${type}`)}</span>;
                        case "RESOLVED":
                            return <span className={`${badgeStyle} bg-[#209F8B26] uppercase text-[#209F8B]`}>{t(`pma.${type}`)}</span>;
                        case "CLOSED":
                            return <span className={`${badgeStyle} bg-[#a6b4d0] bg-opacity-25 uppercase text-[#727C94A6]`}>{t(`pma.${type}`)}</span>;
                        default:
                            return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{t(`pma.${type}`)}</span>;
                    }
                },
            },
            {
                Header: t("pma.Remitente"),
                accessor: (row) => get(row, "user.name", get(row, "user.email", "-")),
                Cell: ({ row: { original } }) => {
                    let name = get(original, "user.name", "") || get(original, "user.names", "");
                    if (isEmpty(name)) {
                        name = get(original, "user.email", "-");
                    }
                    return <div>{name}</div>;
                },
            },
            {
                Header: t("pma.Asunto"),
                accessor: (row) => get(row, "title", "Asunto pendiente"),
                Cell: ({ row: { original } }) => {
                    return <div className="w-71 truncate">{get(original, "title", "Asunto pendiente")}</div>;
                },
            },
            {
                Header: t("pma.Creación"),
                accessor: (row) => dayjs(get(row, "createdAt")).format(),
                Cell: ({ row: { original } }) => {
                    return (
                        <div>
                            {dayjs(get(original, "createdAt", dayjs()))
                                .locale(lang || "es")
                                .format("DD MMMM")}
                        </div>
                    );
                },
            },
            {
                Header: t("pma.Expiración"),
                accessor: (row) => dayjs(get(row, "dueAt")).format(),
                Cell: ({ row: { original } }) => {
                    return <DueDatePicker original={original} />;
                },
            },
        ],
        [dataRow]
    );

    const getFilteredMails = () => {
        let sortedMessages = [];

        if (isEmpty(query)) {
            sortedMessages = reverse(
                sortBy(mails, (data) => {
                    return dayjs(data.lastUserMessageAt);
                })
            );
        }

        return sortedMessages;
    };

    const getEmail = async (row) => {
        const { _id, bot } = row;
        const { data: emails } = await JelouApiV1.get(`/bots/${bot.id}/emails`, {
            params: { sort: "DESC", limit: 10, supportTicketId: _id },
        });
        setLoadingEmails(false);
        const supportTickets = get(emails, "results", []);
        setEmails(supportTickets);
        if (!isEmpty(supportTickets)) {
            const messages = supportTickets.map((supportTicket) => ({
                ...supportTicket,
                id: supportTicket._id,
            }));
            dispatch(addMessages(messages));
        }
    };

    const showEmails = (row) => {
        setShowEmail(true);
        setLoadingEmails(true);
        getEmail(row);
        setSelectedRow(row);
        dispatch(setCurrentEmail(row));
        if (!get(row, "read", false)) {
            setAsRead(row);
            dispatch(setNotReadEmails({ operation: "substract", value: 1 }));
        }
    };

    const showConfirmationModal = (type) => {
        if (!isEmpty(selectedRows)) {
            if (get(type, "id", "") === "TRANSFER") {
                setShowForwardModal(true);
            } else {
                setShowMassiveModal(true);
            }
            setType(type);
        }
    };

    const forwardTransfer = (row) => {
        const id = get(row, "_id");
        const { value } = operatorSelected;

        const payload = {
            origin: "transfer",
            operatorId: value,
            supportTicketId: id,
        };

        setLoadingForwading(true);

        JelouApiV1.post(`/support-tickets/assign`, payload)
            .then(() => {
                setSuccess(true);
                setLoadingForwading(false);
                setShowEmail(false);

                setTimeout(() => {
                    setShowForwardModal(false);
                    setOperatorSelected(null);
                    setSuccess(false);
                }, 2000);
                dispatch(deleteEmails(row._id));
            })
            .catch((err) => {
                console.error("ERROR", err);
                setLoadingForwading(false);
                setSuccess(false);
                setOperatorSelected(null);
            });
    };

    const onChangeForward = (operator) => {
        setOperatorSelected(operator);
    };

    const closeForward = () => {
        setShowForwardModal(false);
        setOperatorSelected(null);
    };

    const close = () => {
        setShowMassiveModal(false);
    };

    const loadDraftData = (row) => {
        if (showDraft) {
            dispatch(setNextDraftRoom(row));
        }
        getEmail(row);
        dispatch(setCurrentEmail(row));
        dispatch(setShowDraft(true));
    };

    const getConfirm = () => {
        switch (toUpper(get(type, "id", ""))) {
            case "FAVORITE":
                return setAllAsFavorite();
            case "NOT_READ":
                return setAllAsNotRead();
            case "READ":
                return setAllAsRead();
            case "PENDING":
                return setAllAsPending();
            case "RESOLVED":
                return setAllAsResolved();
            case "CLOSED":
                return setAllAsClosed();
            case "PRIORITY":
                return setAllPriority();
            default:
                return setAllAsClosed();
        }
    };

    const findCurrentBot = (botArray) => {
        return botArray.find((bot) => bot.type === "email");
    };

    const bot = findCurrentBot(bots);

    if ((!isEmpty(mails) && canViewEmails) || !isEmpty(emailQuerySearch)) {
        const sortedEmails = getFilteredMails();

        if (!showEmail) {
            return (
                <div className={`${showChat ? "flex" : "hidden mid:flex"} w-full flex-1 overflow-hidden shadow-loading mid:rounded-xl`}>
                    <div className="flex w-full flex-col overflow-hidden bg-white mid:flex-1 mid:rounded-l-xl">
                        <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden">
                            <EmailActionsFilters
                                status={status}
                                getEmails={getEmails}
                                setShowEmail={setShowEmail}
                                setAllAsFavorite={setAllAsFavorite}
                                setAllAsNotRead={setAllAsNotRead}
                                showConfirmationModal={showConfirmationModal}
                                dataRow={dataRow}
                                setActualPage={setActualPage}
                                getExpiredEmails={getExpiredEmails}
                                getNotReadEmails={getNotReadEmails}
                                getAllEmails={getAllEmails}
                                sortedEmails={mails}
                            />
                            <Table
                                columns={columns}
                                data={sortedEmails}
                                loading={loadingSearchEmail}
                                onClick={actualTray === "draft" ? loadDraftData : showEmails}
                                total={total}
                                totalPages={totalPages}
                                selectedRows={selectedRows}
                                onSelectedRowsChange={setSelectedRows}
                                setDataRow={setDataRow}
                                number={10}
                                actualPage={actualPage}
                                setActualPage={setActualPage}
                            />
                        </div>
                    </div>
                    {showMassiveModal && <MassiveModal number={dataRow?.length} type={type} close={close} confirm={getConfirm} />}
                    {showForwardModal && (
                        <ForwardEmail
                            closeModal={closeForward}
                            submitChange={transferAll}
                            onChange={onChangeForward}
                            success={success}
                            operatorSelected={operatorSelected}
                            bot={bot}
                            loadingForwading={loadingForwading}
                            changeParse
                            number={dataRow?.length}
                        />
                    )}
                </div>
            );
        }

        return (
            <Email
                showConfirmationModal={showConfirmationModal}
                loading={loadingEmails}
                emails={emails}
                setShowEmail={setShowEmail}
                selectedRow={selectedRow}
                setActualPage={setActualPage}
                getEmail={getEmail}
                from={from}
                setFrom={setFrom}
                getExpiredEmails={getExpiredEmails}
                getNotReadEmails={getNotReadEmails}
                getAllEmails={getAllEmails}
            />
        );
    }

    return (
        <div className="relative flex h-full flex-1 flex-col bg-white mid:rounded-xl">
            <EmailActionsFilters
                status={status}
                getEmails={getEmails}
                setShowEmail={setShowEmail}
                setAllAsFavorite={setAllAsFavorite}
                setAllAsNotRead={setAllAsNotRead}
                showConfirmationModal={showConfirmationModal}
                dataRow={dataRow}
                setActualPage={setActualPage}
                getExpiredEmails={getExpiredEmails}
                getNotReadEmails={getNotReadEmails}
                getAllEmails={getAllEmails}
                sortedEmails={mails}
            />
            <div className="relative mx-auto hidden h-full w-full flex-1 flex-col items-center justify-center border-t-default border-gray-200 bg-white text-center sm:flex mid:rounded-b-xl">
                <GreetingEmailIcon className="my-10" width="20.625rem" height="20.625rem" />
                <div className="flex flex-col sm:flex-row">
                    <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                    <div className="text-xl font-bold text-primary-200">{firstName}</div>
                </div>
                <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">
                    {!canViewEmails ? t("pma.Parece que no tienes acceso a esta sección") : t("pma.Aún no tienes emails entrantes")}
                </div>
            </div>
        </div>
    );
};

export default EmailInbox;
