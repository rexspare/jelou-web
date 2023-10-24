import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";

import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";

import { JelouApiV1 } from "@apps/shared/modules";
import { useOnClickInside } from "@apps/shared/hooks";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";
import { ChatManagerContext, TicketResponseContext } from "@apps/pma/context";
import { addQueues, setShowDisconnectedModal } from "@apps/redux/store";

/* Components */

import QueueList from "./queue-list";
import { pullingRooms } from "@apps/general";

const OPERATOR_MAXIMUM_THRESHOLD_STATUS_CODE = 412;
const TIMEOUT_TAKE_TICKET = 8000;

const Queue = ({ section }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mounted = useRef(false);
    const company = useSelector((state) => state.company);
    const rooms = useSelector((state) => state.rooms);
    const { providerId, lang } = useSelector((state) => state.userSession);
    const teams = useSelector((state) => {
        const teamIds = get(state, "userSession.teams", []);
        return state.userTeams.filter((team) => includes(teamIds, team.id));
    });
    const queues = useSelector((state) => state.queues.filter((queue) => queue.state === "in_queue"));
    const [loading, setLoading] = useState(false);
    const [queue, setQueue] = useState(null);

    const [taking, setTaking] = useState(false);
    const statusOperator = useSelector((state) => state.statusOperator);
    const { ticketResponse, setTicketResponse } = useContext(TicketResponseContext);
    const { chatManager } = useContext(ChatManagerContext);

    const currentRequest = useRef([]);
    const menuButtonRef = useRef(null);

    const [isOpenMenu, setIsOpenMenu] = useState(false);

    useOnClickInside(menuButtonRef, () => setIsOpenMenu(false));

    const getQueues = async (companyObj, viewVal) => {
        setLoading(true);
        try {
            const { data: response } = await JelouApiV1.get(`/company/${companyObj.id}/tickets`, {
                params: {
                    shouldPaginate: false,
                    state: "in_queue",
                    ...(viewVal === "posts" ? { type: "reply" } : {}),
                },
            });

            const results = get(response, "data.results", []);
            dispatch(addQueues(results));
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    };

    const toastMessage = (message) => {
        toast.error(message, {
            autoClose: true,
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    useEffect(() => {
        if (!isEmpty(company)) {
            mounted.current = true;
            getQueues(company, section);
        }
    }, [company]);

    useEffect(() => {
        if (!isEmpty(ticketResponse)) {
            setTaking(false);
            const firstId = first(currentRequest.current);
            currentRequest.current = currentRequest.current.filter((id) => id !== firstId);
            setTicketResponse(null);
        }
    }, [ticketResponse]);

    const takeQueue = async (queueName = null) => {
        if (taking) {
            return;
        }
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }

        setTaking(true);

        const team = teams.find((team) => team.name === queueName);

        if (queueName && !team) {
            console.error("Error in queueList - takeTicket", { queueName, teamBolean: !team, team });
            setTaking(false);
            toastMessage(t("pma.Team not found."));
            return;
        }

        const requestId = uuidv4();
        try {
            await JelouApiV1.get(`/company/${company.id}/tickets/take`, {
                params: {
                    async: true,
                    ...(queueName ? { teamId: team.id } : {}),
                    type: section === "posts" ? "reply" : "chat",
                },
            });
            currentRequest.current.push(requestId);
            setTimeout(validateLoadingTakeTicket, TIMEOUT_TAKE_TICKET, requestId);
        } catch (error) {
            const { status, data } = error.response;

            if (status === OPERATOR_MAXIMUM_THRESHOLD_STATUS_CODE) {
                const error = get(data, `error.clientMessages.${lang}`, get(data, "error.description"));
                toastMessage(error);
                pullingRooms({ providerId, chatManager });
            }

            currentRequest.current = currentRequest.current.filter((id) => id !== requestId);
            setTaking(false);
        }
    };

    /**
     * If the current request is the same as the request that just finished loading, then stop taking
     * tickets and remove the current request from the list of current requests
     * @param {string} reqId - The id of the request that is being validated.
     */
    const validateLoadingTakeTicket = (reqId) => {
        const currentReq = first(currentRequest.current);
        if (currentReq === reqId) {
            setTaking(false);
            currentRequest.current = currentRequest.current.filter((id) => id !== reqId);
        }
    };

    const hasQueues = get(company, "properties.hasQueue", false);
    const team = first(teams);
    const queueThreshold = get(team, "properties.queueThreshold", get(company, "properties.queueThreshold", Infinity));

    if (!hasQueues) {
        return null;
    }

    const hasQueuesByTeam = get(company, "properties.hasQueuesByTeam", false);

    const handleClick = (event) => {
        setIsOpenMenu(!isOpenMenu);
    };

    return (
        <div ref={menuButtonRef} className="relative flex h-10 items-center bg-primary-600 px-3 hover:cursor-pointer sm:h-18 sm:px-4 mid:px-8">
            {loading ? (
                <div className="flex w-full justify-center">
                    <MoonLoader size={24} color="#00B3C7" />
                </div>
            ) : (
                <QueueList
                    handleClick={handleClick}
                    isOpenMenu={isOpenMenu}
                    hasQueuesByTeam={hasQueuesByTeam}
                    teams={teams}
                    queues={section === "posts" ? queues.filter((queue) => queue.type === "reply") : queues.filter((queue) => queue.type !== "reply")}
                    section={section}
                    rooms={rooms}
                    queue={queue}
                    setQueue={setQueue}
                    taking={taking}
                    queueThreshold={queueThreshold}
                    takeQueue={takeQueue}
                />
            )}
        </div>
    );
};

export default Queue;
