import Room from "@apps/clients/room";
import { Sidebar } from "@apps/clients/sidebar";
import { Filters } from "@apps/clients/ui-shared";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { useDispatch } from "react-redux";

import { DateContext } from "@apps/context";
import { addClientsRooms, setGlobalSearchMessage, unsetClientsRooms, unsetCurrentRoomClients } from "@apps/redux/store";
import { usePrevious } from "@apps/shared/hooks";
import { BotIcon, DateIcon, OperatorIcon } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import { mergeById } from "@apps/shared/utils";
import axios from "axios";
import first from "lodash/first";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Conversation = (props) => {
    const {
        bots,
        company,
        bot,
        setBot,
        operator,
        setOperator,
        initialFilters,
        selectedOptions,
        setSelectedOptions,
        query,
        setQuery,
        field,
        setField,
        hasRoomidParam,
        handleToConversation,
        operators,
        rooms,
        loadingMoreRooms,
        setLoadingMoreRooms,
        isLoadingChatProfile,
        setIsLoadingChatProfile,
    } = props;
    const dispatch = useDispatch();
    const dayjs = useContext(DateContext);
    const [date, setDate] = useState([]);
    const [botsFilter, setBotsFilter] = useState([]);
    const [operatorFilter, setOperatorFilter] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoadingMessage, setIsLoadingMessage] = useState(false);
    const [isLoadingRoom, setIsLoadingRoom] = useState(false);

    const [loadingOperators, setLoadingOperators] = useState(false);
    const [cancelToken, setCancelToken] = useState();
    const previousHasRoom = usePrevious(hasRoomidParam);
    const previousCompany = usePrevious(company);
    const previousOptions = usePrevious(selectedOptions);
    const { roomId } = useParams();

    const { t } = useTranslation();
    // const effectRan = useRef(false);

    const input = useRef();
    const search = [
        {
            id: 0,
            name: t("clients.msg"),
            type: "text",
        },
        {
            id: 1,
            name: t("clients.idClients"),
            type: "REFERENCE_ID",
        },
    ];

    useEffect(() => {
        if (previousCompany !== company && !isEmpty(company)) {
            getRooms();
        }
        if (!isEmpty(company) && previousHasRoom !== hasRoomidParam && hasRoomidParam) {
            getRooms(1, 10, true);
        }
        if (!isEmpty(company) && previousOptions !== selectedOptions) {
            getRooms();
        }
    }, [company, selectedOptions, hasRoomidParam]);

    useEffect(() => {
        if (isEmpty(botsFilter)) botsFilters();
    }, [botsFilter, bots]);

    useEffect(() => {
        if (isEmpty(operatorFilter)) operatorsFilters();
    }, [operatorFilter, operators]);

    useEffect(() => {
        return () => {
            dispatch(unsetCurrentRoomClients());
        };
    }, []);

    const operatorsFilters = () => {
        let operatorsArray = [];
        if (!isEmpty(operators)) {
            operators.forEach((operator) => {
                operatorsArray.push({
                    id: operator.id,
                    name: get(operator, "names"),
                    state: operator.state,
                });
            });
            setOperatorFilter(operatorsArray);
        }
    };

    const botsFilters = () => {
        let botsArray = [];

        if (!isEmpty(bots)) {
            bots.forEach((bot) => {
                botsArray.push({ id: bot.id, name: bot.name, type: bot.type });
                setBotsFilter(botsArray);
            });
        }
    };

    const onChangeBot = (evt) => {
        const botId = evt.id;
        setSelectedOptions({ ...selectedOptions, bots: botId });
        setBot(evt);
    };

    const onChangeOperator = (evt) => {
        const operatorId = evt.id;
        setSelectedOptions({
            ...selectedOptions,
            operators: operatorId.toString(),
        });
        setOperator(evt);
    };

    const conversationFilter = [
        {
            id: 0,
            name: "bots",
            placeholderButtonLabel: "Bots",
            options: botsFilter,
            value: bot,
            placeholder: "Bots",
            type: "MultiCheckBox",
            onChange: onChangeBot,
            icon: <BotIcon width="1.3125rem" height="1rem" />,
        },
        {
            id: 1,
            name: "operators",
            placeholderButtonLabel: "Operador",
            options: operatorFilter,
            value: operator,
            placeholder: t("clients.operator"),
            type: "MultiCheckBox",
            onChange: onChangeOperator,
            icon: <OperatorIcon width="1.125rem" height="1rem" />,
        },
        {
            id: 2,
            name: t("clients.date"),
            date: date,
            placeholder: t("clients.date"),
            type: "Date",
            icon: <DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />,
        },
    ];

    const getRooms = async (page = 1, limit = 10, isRoomId = false) => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        try {
            const companyId = get(company, "id");
            const source = axios.CancelToken.source();
            setCancelToken(source);
            let params = {};
            let fieldArray = [];
            let queryArray = [];
            page > 1 && setLoadingMoreRooms(true);
            page === 1 && setIsLoadingRoom(true);
            if (selectedOptions !== initialFilters) {
                const filterKeys = Object.keys(selectedOptions);
                filterKeys.forEach((filter) => {
                    let ids = [];
                    if (!isEmpty(selectedOptions[filter])) {
                        const obj = selectedOptions[filter];
                        ids.push(obj);
                        params[filter] = ids;
                    }
                });
            }

            let [startAt, endAt] = "";
            const botId = get(params, "bots", []);
            const operatorId = get(params, "operators", []);
            const globalSearch = first(get(params, "globalSearch", []));
            const [dates] = get(params, "date", []);
            const query = get(globalSearch, "query", []);
            const field = get(globalSearch, "field", []);
            const objectArray = {
                botId,
                operatorId: isNaN(parseInt(operatorId[0])) ? [] : parseInt(operatorId[0]),
                [field]: query,
            };

            if (!isEmpty(dates)) {
                [startAt, endAt] = dates;
                startAt = dayjs(startAt).format();
                endAt = dayjs(endAt).endOf("day").format();
            }

            Object.keys(objectArray).map((key) => {
                if (!isEmpty(objectArray[key])) {
                    return fieldArray.push(key) && queryArray.push(objectArray[key]);
                } else if (key === "operatorId" && typeof objectArray[key] == "number") {
                    return fieldArray.push(key) && queryArray.push(objectArray[key]);
                }
                return 0;
            });

            !isEmpty(globalSearch) && field[0] === "text" ? dispatch(setGlobalSearchMessage(true)) : dispatch(setGlobalSearchMessage(false));

            const { data } = await DashboardServer.get("/clients/rooms?", {
                params: {
                    page,
                    limit,
                    companyId,
                    ...(!isEmpty(startAt) ? { startAt } : {}),
                    ...(!isEmpty(endAt) ? { endAt } : {}),
                    fields: fieldArray,
                    query: queryArray,
                },
                cancelToken: source.token,
            });
            if (!isEmpty(data)) {
                const { results, pagination, name = "", meta = {} } = data;

                if (isEmpty(name)) {
                    if (page > 1) {
                        let updatedRooms = [...rooms, ...results];
                        updatedRooms = updatedRooms.map((room) => {
                            return { ...room, _id: uuidv4() };
                        });
                        setLoadingMoreRooms(false);
                        dispatch(addClientsRooms(updatedRooms));
                    } else {
                        let roomsUpdate = [];
                        if (isRoomId) {
                            roomsUpdate = mergeById(rooms, results).map((room) => {
                                return { ...room, _id: uuidv4() };
                            });
                        } else {
                            roomsUpdate = results.map((room) => {
                                return { ...room, _id: uuidv4() };
                            });
                        }

                        dispatch(addClientsRooms(roomsUpdate));
                        if (hasRoomidParam) {
                            setIsLoadingChatProfile(true);
                            handleToConversation();
                        }
                    }
                    setTotalPages(get(pagination, "totalPages", 0));
                } else if (!isEmpty(name) && name === "ResponseError") {
                    //
                    const { statusCode = 0 } = meta;
                    if (statusCode === 503) {
                        //
                        notifyError(`${t("plugins.error1")} ${t("clients.exceed")}`);
                    } else {
                        notifyError(`${t("plugins.error1")}`);
                    }
                } else {
                    notifyError(t("plugins.error1"));
                    dispatch(unsetCurrentRoomClients());
                    dispatch(unsetClientsRooms());
                }

                isNil(roomId) && setLoadingMoreRooms(false);
                setIsLoadingRoom(false);
                return data;
            }

            setLoadingMoreRooms(false);
            setIsLoadingRoom(false);
            dispatch(unsetCurrentRoomClients());
            return [];
        } catch (err) {
            console.log(err);
        }
    };

    const clearFilters = () => {
        setSelectedOptions(initialFilters);
        setBot(null);
        setOperator(null);
        setQuery("");
        setField("");
        setGlobalSearchMessage(false);
        setDate([]);
    };

    const notifyError = (error) => {
        toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    return (
        <>
            <ToastContainer />
            <div className="mt-4 rounded-t-xl border-b-1 border-gray-100 border-opacity-25 bg-white px-2">
                <Filters
                    filters={conversationFilter}
                    showDownload={false}
                    hasGlobalSearch={true}
                    clearFilters={clearFilters}
                    setSelectedOptions={setSelectedOptions}
                    selectedOptions={selectedOptions}
                    inputRef={input}
                    query={query}
                    setQuery={setQuery}
                    field={field}
                    setField={setField}
                    search={search}
                />
            </div>
            <div className="flex max-h-client min-h-client w-full flex-1">
                <Sidebar
                    getRooms={getRooms}
                    isLoadingRoom={isLoadingRoom}
                    isLoadingMessage={isLoadingMessage}
                    setIsLoadingMessage={setIsLoadingMessage}
                    query={query}
                    field={field}
                    totalPages={totalPages}
                    selectedOptions={selectedOptions}
                    setLoadingOperators={setLoadingOperators}
                    loadingMoreRooms={loadingMoreRooms}
                    date={date}
                    isLoadingChatProfile={isLoadingChatProfile}
                />
                <Room
                    isLoadingRoom={isLoadingRoom}
                    isLoadingMessage={isLoadingMessage}
                    getRooms={getRooms}
                    query={query}
                    field={field}
                    selectedOptions={selectedOptions}
                    loadingOperators={loadingOperators}
                />
            </div>
        </>
    );
};

export default Conversation;
