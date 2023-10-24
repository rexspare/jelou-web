import qs from "qs";
import axios from "axios";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import reverse from "lodash/reverse";
import orderBy from "lodash/orderBy";
import first from "lodash/first";

import "dayjs/locale/es";
import dayjs from "dayjs";
import { useLocation, useParams } from "react-router-dom";

import { useState, useEffect, useMemo, memo } from "react";
import Table from "./email-table/email-table";
import EmailSidebar from "./email-sidebar/email-sidebar";
import { useTranslation } from "react-i18next";

import { StarOutIcon, StarFillIcon, GreetingSupportTicketsIcon } from "@apps/shared/icons";
import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import EmailView from "./email-view/email-view";
import { useSelector } from "react-redux";
import { SkeletonEmail } from "@apps/shared/common";
import Tippy from "@tippyjs/react";

export function Email(props) {
    const {
        initialDate,
        finalDate,
        showEmail,
        setShowEmail,
        operatorSelected,
        emails,
        setEmails,
        setOperatorSelected,
        botSelected,
        setBotSelected,
        teamSelected,
        setTeamSelected,
        emailsSearchBy,
        emailsQuerySearch,
    } = props;
    const [totalPages, setTotalPages] = useState(0);
    const [actualEmails, setActualEmails] = useState(0);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [actualPage, setActualPage] = useState(1);
    const [nrows, setRows] = useState(50);
    const [status, setStatus] = useState({});
    const [priority, setPriority] = useState({});
    const [isFavorite, setIsFavorite] = useState({});
    const { t } = useTranslation();

    const [cancelToken, setCancelToken] = useState();

    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));

    const time = dayjs().locale("es").format("HH:mm");

    const greeting = getTime(time, t);

    const { subsection } = useParams();

    function getTime(time, t) {
        if (time < "12:00") {
            return t("Buenos días");
        } else if (time >= "12:00" && time < "19:00") {
            return t("Buenas tardes");
        } else if (time >= "19:00") {
            return "Buenas noches";
        }
    }

    const getAllTickets = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Cancelling");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelToken(source);
            const { data } = await JelouApiV1.get(`/support-tickets`, {
                params: {
                    limit: 10,
                    page: 0,
                    onlyInbound: true,
                    ...(!isEmpty(initialDate) ? { startAt: initialDate } : {}),
                    ...(!isEmpty(finalDate) ? { endAt: finalDate } : {}),
                },
                cancelToken: source.token,
            });

            setActualEmails(get(data, "pagination.total", 0));
        } catch (error) {
            console.log(error);
        }
    };

    const getEmails = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Cancelling");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelToken(source);
            setLoadingTable(true);
            const searchBy = emailsSearchBy.searchBy ? emailsSearchBy.searchBy : "text";

            const { data } = await JelouApiV1.get(`/support-tickets`, {
                params: {
                    sort: "DESC",
                    limit: nrows,
                    page: actualPage,
                    startAt: initialDate,
                    endAt: finalDate,
                    ...(status !== "closed" ? { onlyInbound: true } : {}),
                    ...(status ? { status } : {}),
                    ...(priority ? { priority } : {}),
                    ...(isFavorite ? { isFavorite } : {}),
                    ...(emailsQuerySearch ? { search: emailsQuerySearch } : {}),
                    ...(emailsSearchBy ? { searchBy } : {}),
                    ...(!isEmpty(operatorSelected) ? { operatorId: operatorSelected.id } : {}),
                    ...(!isEmpty(teamSelected) ? { teamId: teamSelected.id } : {}),
                    ...(!isEmpty(botSelected) ? { botId: botSelected.id } : {}),
                },
                cancelToken: source.token,
                paramsSerializer: function (params) {
                    return qs.stringify(params);
                },
            });
            setLoadingTable(false);
            setTotalPages(get(data, "pagination.totalPages", 0));
            setTotal(get(data, "pagination.total", 0));
            setEmails(get(data, "results", []));
            setActualEmails(get(data, "pagination.total", 0));
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoadingTable(true);
            } else {
                setLoadingTable(false);
                console.log(error);
            }

            setLoadingTable(false);
            console.log(error);
        }
    };

    useEffect(() => {
        getEmails();
    }, [
        status,
        priority,
        operatorSelected,
        isFavorite,
        actualPage,
        teamSelected,
        nrows,
        botSelected,
        emailsQuerySearch,
        emailsSearchBy,
        initialDate,
    ]);

    useEffect(() => {
        setOperatorSelected("");
        getAllTickets();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: " ",
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="flex items-center">
                            {original.isFavorite ? (
                                <StarFillIcon height="1rem" width="1.2rem" className="fill-current text-[#D39C00]" />
                            ) : (
                                <StarOutIcon height="1rem" width="1.2rem" className="fill-current text-gray-400" />
                            )}
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.operador"),
                accessor: (row) => get(row, "assignedTo.names", ""),
                Cell: ({ row: { original } }) => {
                    return (
                        <div className="w-36">
                            <Tippy content={`${get(original, "assignedTo.names", "")}`} theme="light" placement="bottom">
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
                    return <div>{`#${get(original, "number", "")}`}</div>;
                },
            },
            {
                Header: t("monitoring.state"),
                accessor: (row) => row.type,
                Cell: ({ row: { original } }) => {
                    const type = get(original, "status", "");
                    const badgeStyle = "justify-center inline-flex items-center h-[18px] px-2 rounded-[7px] text-[10px] font-bold";
                    switch (toUpper(type)) {
                        case "NEW":
                            return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{t(type)}</span>;
                        case "OPEN":
                            return <span className={`${badgeStyle} bg-[#00B3C71A] uppercase text-[#00B3C7]`}>{t(type)}</span>;
                        case "PENDING":
                            return <span className={`${badgeStyle} bg-[#E47B6A40] uppercase text-[#B95C49]`}>{t(type)}</span>;
                        case "RESOLVED":
                            return <span className={`${badgeStyle} bg-[#209F8B26] uppercase text-[#209F8B]`}>{t(type)}</span>;
                        case "CLOSED":
                            return <span className={`${badgeStyle} bg-[#a6b4d0] bg-opacity-25 uppercase text-[#727C94A6]`}>{t(type)}</span>;
                        default:
                            return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{t(type)}</span>;
                    }
                },
            },
            {
                Header: t("monitoring.sender"),
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
                Header: t("monitoring.subject"),
                accessor: (row) => get(row, "title", "Asunto pendiente"),
                Cell: ({ row: { original } }) => {
                    return <div className="w-70 truncate">{get(original, "title", "Asunto pendiente")}</div>;
                },
            },
            {
                Header: t("monitoring.creation"),
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
                Header: t("monitoring.expiration"),
                accessor: (row) => dayjs(get(row, "dueAt")).format(),
                Cell: ({ row: { original } }) => {
                    const actualDate = dayjs();
                    const dueDate = dayjs(get(original, "dueAt"));
                    const dueFinal = dayjs(dueDate).hour(23).minute(59).second(59).format();
                    const actualDateFinal = dayjs(actualDate).hour(23).minute(59).second(59).format();
                    const differenceDays = dayjs(dueFinal).diff(actualDateFinal, "day");
                    const disabled = get(original, "status", "") === "closed";

                    const getDaysLeft = () => {
                        if (lang === "en") {
                            return `${differenceDays} ${differenceDays === 1 ? "day left" : "days left"}`;
                        } else {
                            return `${differenceDays === 1 ? "Falta" : "Faltan"} ${differenceDays} ${differenceDays === 1 ? "día" : "días"}`;
                        }
                    };

                    return (
                        <div>
                            <div className="flex w-full flex-col text-left">
                                {!isEmpty(dueDate) && get(original, "status", "") !== "closed" ? (
                                    differenceDays < 0 ? (
                                        <span className={"font-bold text-secondary-250"}>{t("monitoring.expired")}</span>
                                    ) : differenceDays === 0 && differenceDays > -1 ? (
                                        <span className="font-bold text-secondary-250">{t(`monitoring.expiresToday`)}</span>
                                    ) : differenceDays > 0 && differenceDays < 4 ? (
                                        <span className="font-bold text-[#FF8A00]">{getDaysLeft()}</span>
                                    ) : differenceDays > 3 ? (
                                        <span className="font-bold text-secondary-425">{getDaysLeft()}</span>
                                    ) : (
                                        ""
                                    )
                                ) : (
                                    ""
                                )}
                                {!isEmpty(dueDate) && differenceDays < 1 ? (
                                    <span className={`${disabled ? "text-gray-15" : "text-secondary-250"}`}>
                                        {dayjs(dueDate)
                                            .locale(lang || "es")
                                            .format("DD MMMM")}
                                    </span>
                                ) : !isEmpty(dueDate) && differenceDays > 0 && differenceDays < 4 ? (
                                    <span className={`${disabled ? "text-gray-15" : "text-[#FF8A00]"}`}>
                                        {dayjs(dueDate)
                                            .locale(lang || "es")
                                            .format("DD MMMM")}
                                    </span>
                                ) : !isEmpty(dueDate) && differenceDays > 3 ? (
                                    <span className={`${disabled ? "text-gray-15" : "text-secondary-425"} `}>
                                        {dayjs(dueDate)
                                            .locale(lang || "es")
                                            .format("DD MMMM")}
                                    </span>
                                ) : (
                                    <span className={"w-full"}>-</span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const getFilteredEmails = () => {
        let sortedMessages = [];

        sortedMessages = orderBy(emails, ["lastUserMessageAt"], ["asc"]);

        return reverse(sortedMessages);
    };

    const cleanFilters = () => {
        setActualPage(1);
        setStatus({});
        setPriority({});
        setIsFavorite({});
        setOperatorSelected({});
        setTeamSelected({});
        setBotSelected({});
    };

    const company = useSelector((state) => state.company);

    const sortedEmails = getFilteredEmails();

    const [currentEmail, setCurrentEmail] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [messagesIsLoading, setMessagesIsLoading] = useState(true);

    const getEmail = async (id) => {
        setMessagesIsLoading(true);

        try {
            const {
                data: { results: emails },
            } = await DashboardServer.get(`/companies/${company.id}/tickets/${id}/emails`, {
                params: {
                    sort: "DESC",
                    limit: 20,
                },
            });

            if (!isEmpty(emails)) {
                const messages = emails.map((message) => ({
                    ...message,
                    id: message._id,
                }));
                setMessages(messages);
                // dispatch(addMessages(messages));
            }
            setMessagesIsLoading(false);
        } catch (error) {
            setMessagesIsLoading(false);
            console.log(error);
        }
    };

    const location = useLocation();

    const { state: emailPayload } = location;

    useEffect(() => {
        if (!isEmpty(emailPayload)) {
            const emailId = get(emailPayload, "_id", "");
            getEmail(emailId);
            setCurrentEmail(emailPayload);
            setShowEmail(true);
        }

        return () => {
            setShowEmail(false);
        };
    }, [emailPayload]);

    const showEmails = (dataRow) => {
        setCurrentEmail(dataRow);
        getEmail(dataRow._id);
        setSelectedRow(dataRow);
        setShowEmail(true);
    };

    return (
        <div className="flex h-[33rem] overflow-hidden rounded-b-10">
            <div className="mb-12 flex h-full overflow-x-hidden border-r-1 border-gray-100 border-opacity-25 lg:w-70">
                {subsection === "emails" ? (
                    <EmailSidebar
                        setShowEmail={setShowEmail}
                        setStatus={setStatus}
                        setPriority={setPriority}
                        setActualPage={setActualPage}
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        cleanFilters={cleanFilters}
                        actualEmails={actualEmails}
                    />
                ) : (
                    <div />
                )}
            </div>
            <div className="relative flex-1 overflow-y-auto bg-white ">
                {showEmail ? (
                    messagesIsLoading ? (
                        <SkeletonEmail />
                    ) : (
                        <EmailView currentEmail={currentEmail} messages={messages} selectedRow={selectedRow} setShowEmail={setShowEmail} />
                    )
                ) : !isEmpty(sortedEmails) ? (
                    <Table
                        columns={columns}
                        data={sortedEmails}
                        loading={loadingTable}
                        totalPages={totalPages}
                        setTotalPages={setTotalPages}
                        onClick={showEmails}
                        total={total}
                        number={10}
                        actualPage={actualPage}
                        setActualPage={setActualPage}
                        actualEmails={actualEmails}
                        nrows={nrows}
                        setRows={setRows}
                    />
                ) : (
                    <div className="relative mx-auto hidden h-full w-full flex-1 flex-col items-center justify-center border-t-default border-gray-200 bg-white text-center sm:flex lg:rounded-b-xl">
                        <GreetingSupportTicketsIcon className="my-10" width="270" height="270" />
                        <div className="flex flex-col sm:flex-row">
                            <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                            <div className="text-xl font-bold text-primary-200">{firstName}</div>
                        </div>
                        <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">{t("Aún no tienes tickets entrantes")}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default memo(Email);
