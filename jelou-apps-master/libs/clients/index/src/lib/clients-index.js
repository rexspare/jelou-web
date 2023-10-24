import React, { useState, useEffect, useContext, useRef } from "react";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import first from "lodash/first";
import { v4 as uuidv4 } from "uuid";

import Profile from "@apps/clients/profile";
import { Menu } from "@apps/shared/common/";
import Conversation from "@apps/clients/conversation";
import { useDispatch, useSelector } from "react-redux";
import { DashboardServer } from "@apps/shared/modules";
import {
    setOperators,
    setStoredParams,
    unsetStoredParams,
    unsetClientsRooms,
    addClientsMessages,
    updateClientsRooms,
    addOperatorsHistory,
    setCurrentRoomClients,
    unsetOperatorsHistory,
    deleteClientsMessages,
    unsetCurrentRoomClients,
} from "@apps/redux/store";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ClientStateProvider } from "@apps/clients-state-context";
// import { DateContext } from "@apps/context";

const Client = (props) => {
    const { setShowPage404 } = props;
    // const dayjs = useContext(DateContext);
    const [currentOptionId, setCurrentOptionId] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { roomId, tab } = useParams();
    const initialTab = "conversation";
    const [tabs, setTabs] = useState(tab);
    const allowedPermission = props.allowedPermission === "clients:view_clients" ? true : false;
    const [menuOptions, setMenuOptions] = useState([]);
    const [table, setTable] = useState(true);
    const [loadingMoreRooms, setLoadingMoreRooms] = useState(false);
    const [isLoadingChatProfile, setIsLoadingChatProfile] = useState(false);

    const navigate = useNavigate();

    const bots = useSelector((state) => state.bots);
    const company = useSelector((state) => state.company);
    const users = useSelector((state) => state.users);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const operators = useSelector((state) => state.operators);
    const rooms = useSelector((state) => state.clientsRooms);

    const [bot, setBot] = useState(null);
    const [operator, setOperator] = useState(null);
    const [channel, setChannel] = useState(null);

    const prevLangRef = useRef();
    useEffect(() => {
        prevLangRef.current = lang;
    }, []);
    const initialFiltersProfile = { channel: [], date: [], globalSearch: [] };
    const [selectedOptionsProfile, setSelectedOptionsProfile] = useState(initialFiltersProfile);

    let initialFiltersConversation = {
        bots: [],
        operators: [],
        date: [],
        globalSearch: [],
    };
    const [selectedOptionsConversation, setSelectedOptionsConversation] = useState(initialFiltersConversation);

    const [queryConversation, setQueryConversation] = useState("");
    const [fieldConversation, setFieldConversation] = useState("");
    const [queryProfile, setQueryProfile] = useState("");
    const [fieldProfile, setFieldProfile] = useState("");
    const [hasRoomidParam, setHasRoomidParam] = useState(false);

    useEffect(() => {
        setSelectedOptionsConversation(initialFiltersConversation);
        setBot(null);
        setOperator(null);
        setQueryConversation("");
        setFieldConversation("");
    }, [tab]);

    useEffect(() => {
        if (isEmpty(tab)) {
            setTabs(initialTab);
            setCurrentOptionId(0);
        } else {
            if (tab === "profile") {
                setCurrentOptionId(1);
            } else {
                setCurrentOptionId(0);
            }
            setTabs(tab);
        }
    }, []);

    useEffect(() => {
        let tabsArray = [
            { name: t("clients.conversations"), tab: "conversation" },
            { name: t("clients.profile"), tab: "profile" },
        ];
        if (isEmpty(menuOptions) || prevLangRef.current !== lang) {
            setMenuOptions(tabsArray);
            prevLangRef.current = lang;
        }
    }, [menuOptions, lang]);

    useEffect(() => {
        if (!isEmpty(users)) dispatch(setOperators(users));
    }, [users]);

    const options = menuOptions.map((opt, index) => {
        return {
            id: index,
            name: opt.children ? opt.children.toLowerCase() : opt.tab.toLowerCase(),
            label: opt.children ? opt.children.toLowerCase() : opt.name.toLowerCase(),
            hidden: index > 3 ? true : false,
            handleClick: () => {
                setCurrentOptionId(index);
                setTabs(opt.tab);
                navigate(`clients/${opt.tab}`);
            },
        };
    });

    useEffect(() => {
        if (!isEmpty(roomId)) {
            setCurrentOptionId(0);
            setHasRoomidParam(true);
        }
    }, [roomId]);

    const handleToConversation = async () => {
        const companyId = get(company, "id");
        let referenceId = "";
        let botId = "";
        //get Room
        try {
            const {
                data: { results },
            } = await DashboardServer.get(`/clients/room/${roomId}`);
            if (!isEmpty(results)) {
                const _rooms = results.map((room) => {
                    return { ...room, _id: uuidv4() };
                });
                const room = first(_rooms);
                referenceId = room.referenceId;
                botId = room.botId;
                dispatch(setCurrentRoomClients(room));
                dispatch(updateClientsRooms(room));
                setIsLoadingChatProfile(false);
            }
            setTabs({ name: t("clients.conversations"), tab: "conversations" });
            const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/messages`);
            if (!isEmpty(data)) {
                const message = get(data, "rows", []);
                dispatch(addClientsMessages(message));
            }
            setHasRoomidParam(false);
        } catch (err) {
            console.log(err);
            setHasRoomidParam(false);
        }
        //get Operators History
        try {
            const operators = await DashboardServer.get(`/clients/rooms/${roomId}/operators?`, {
                params: {
                    page: 1,
                    limit: 10,
                },
            });
            const dataOperators = get(operators, "data", []);
            if (!isEmpty(dataOperators)) {
                let operatorsHistory = dataOperators.map((operator) => {
                    return { ...operator, isSelected: false };
                });
                operatorsHistory = operatorsHistory.sort(function (a, b) {
                    return dayjs(b.operators, "date").format("DD/MM/YYYY hh:mm:ss") - dayjs(a.date).format("DD/MM/YYYY hh:mm:ss");
                });
                dispatch(addOperatorsHistory(operatorsHistory));
            } else {
                dispatch(unsetOperatorsHistory());
            }
        } catch (err) {
            console.log(err);
        }
        //get Stored Params
        try {
            const storedParamsData = await DashboardServer.get(`/clients/rooms/${roomId}/information?`, {
                params: {
                    referenceId,
                    botId,
                    companyId,
                },
            });
            const storedParams = get(storedParamsData, "data", []);
            if (!isEmpty(storedParams)) {
                const { results } = storedParams;
                dispatch(setStoredParams(results));
            } else {
                dispatch(unsetStoredParams());
            }
        } catch (err) {
            console.log(err);
        }
    };

    //componentDidUnmount
    useEffect(() => {
        return () => {
            dispatch(unsetStoredParams());
            dispatch(unsetOperatorsHistory());
            dispatch(unsetCurrentRoomClients());
            dispatch(unsetClientsRooms());
            dispatch(deleteClientsMessages());
        };
    }, []);

    const switchTab = (tab) => {
        switch (toUpper(tab)) {
            case "CONVERSATION":
                return (
                    <Conversation
                        bot={bot}
                        setBot={setBot}
                        operator={operator}
                        setOperator={setOperator}
                        initialFilters={initialFiltersConversation}
                        selectedOptions={selectedOptionsConversation}
                        setSelectedOptions={setSelectedOptionsConversation}
                        query={queryConversation}
                        setQuery={setQueryConversation}
                        field={fieldConversation}
                        setField={setFieldConversation}
                        hasRoomidParam={hasRoomidParam}
                        handleToConversation={handleToConversation}
                        bots={bots}
                        company={company}
                        operators={operators}
                        rooms={rooms}
                        loadingMoreRooms={loadingMoreRooms}
                        setLoadingMoreRooms={setLoadingMoreRooms}
                        isLoadingChatProfile={isLoadingChatProfile}
                        setIsLoadingChatProfile={setIsLoadingChatProfile}
                    />
                );
            case "PROFILE":
                return (
                    <Profile
                        bots={bots}
                        company={company}
                        channel={channel}
                        setChannel={setChannel}
                        setTab={setTabs}
                        table={table}
                        setTable={setTable}
                        initialFilters={initialFiltersProfile}
                        selectedOptions={selectedOptionsProfile}
                        setSelectedOptions={setSelectedOptionsProfile}
                        query={queryProfile}
                        setQuery={setQueryProfile}
                        field={fieldProfile}
                        setField={setFieldProfile}
                    />
                );
            default:
                return setShowPage404(true);
        }
    };

    return (
        <div>
            {allowedPermission && (
                <div className="relative flex h-full max-h-screen w-full flex-col px-5 pl-6 pt-4">
                    <ClientStateProvider>
                        <Menu title={t("sideBar.clients")} options={options} currentOptionId={currentOptionId} view={"clients"} hasTabs={true} tabs={tabs} lang={lang} />
                        {switchTab(tab)}
                    </ClientStateProvider>
                </div>
            )}
        </div>
    );
};

export default Client;
