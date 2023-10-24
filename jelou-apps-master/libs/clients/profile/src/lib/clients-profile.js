import React, { useState, useEffect, useRef, Fragment, useCallback, useContext } from "react";
import { Filters, ProfileModal } from "@apps/clients/ui-shared";
import ProfileTable from "./Components/ProfileTable";
import isEmpty from "lodash/isEmpty";
import isDate from "lodash/isDate";
import get from "lodash/get";
import first from "lodash/first";
import { useSelector, useDispatch } from "react-redux";
import { addClients, resetClients, setChannels, setStoredParams, unsetStoredParams, unsetCurrentRoomClients } from "@apps/redux/store";
import ProfileGrid from "./Components/ProfileGrid";
import { GlobalSearch } from "@apps/shared/common";
import { Menu, Transition } from "@headlessui/react";
import FileDownload from "js-file-download";
import { BeatLoader } from "react-spinners";
import { DashboardServer } from "@apps/shared/modules";
import { CleanIcon, DownIcon, SortIcon, DownloadIcon3, GridViewIcon, TableViewIcon } from "@apps/shared/icons";
import { ComboboxSelect } from "@apps/shared/common";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { DateRangePicker } from "@apps/shared/common";
import { DateContext } from "@apps/context";

import { renderMessage as renderToastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const ClientsProfile = (props) => {
    const { company, channel, setChannel, table, setTable, initialFilters, selectedOptions, setSelectedOptions, query, setQuery, field, setField } =
        props;
    const dayjs = useContext(DateContext);
    const channels = useSelector((state) => state.channel);
    const clients = useSelector((state) => state.clients);
    const bots = useSelector((state) => state.bots);
    const storedParams = useSelector((state) => state.storedParams);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const [currentClient, setCurrentClient] = useState([]);
    const input = useRef();
    const [pageLimit, setPageLimit] = useState(1);
    const [maxPage, setMaxPage] = useState(null);
    const searchButton = useRef();
    const [nrows, setRows] = useState(10);
    const [sortOrder, setSortOrder] = useState("asc_alphabet");
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [loadingCards, setLoadingCards] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [cancelToken, setCancelToken] = useState();
    const [totalResults, setTotalResults] = useState(0);
    const search = [
        {
            id: 0,
            name: t("clients.clients"),
            type: "client",
        },
    ];
    const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {
        unsetCurrentRoomClients();
    }, []);

    const handleClientInfo = (clientsInfo) => {
        getStoredParams(clientsInfo);
        setOpenProfile(true);
        setCurrentClient(clientsInfo);
    };

    function closeProfile() {
        setOpenProfile(false);
    }

    useEffect(() => {
        if (isEmpty(channels) && !isEmpty(bots)) {
            dispatch(setChannels(bots));
        }
    }, [bots]);

    useEffect(() => {
        if (table) {
            getClients();
        }
        if (!table) {
            getClients();
        }
    }, [pageLimit, nrows, selectedOptions, table]);

    const onChangeChannel = (evt) => {
        const channelId = evt.id;
        const channel = channels.find((c) => c.id === Number(channelId));
        setSelectedOptions({ ...selectedOptions, channel: channel.name });
        setChannel(channel);
        setPageLimit(1);
    };

    const getClients = useCallback(async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        try {
            const companyId = get(company, "id");
            let params = {};
            const source = axios.CancelToken.source();
            setCancelToken(source);

            setIsLoadingClients(true);
            setLoadingCards(true);

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
            const channel = get(params, "channel", []);
            const globalSearch = first(get(params, "globalSearch", []));
            const query = get(globalSearch, "query", []);
            const field = get(globalSearch, "field", []);
            const [dates] = get(params, "date", []);
            let startAt, endAt;

            if (!isEmpty(dates)) {
                [startAt, endAt] = dates;
                startAt = dayjs(startAt).format();
                endAt = dayjs(endAt).endOf("day").format();
            }

            const { data } = await DashboardServer.get(`/clients?`, {
                params: {
                    ...(table ? { limit: nrows } : { limit: 20 }),
                    page: pageLimit,
                    shouldPaginate: true,
                    companyId,
                    ...(!isDate(startAt) && !isEmpty(startAt) ? { startAt } : {}),
                    ...(!isDate(endAt) && !isEmpty(endAt) ? { endAt } : {}),
                    ...(!isEmpty(channel) ? { type: channel[0] } : {}),
                    ...(!isEmpty(query) ? { query } : {}),
                    ...(!isEmpty(field) && !isEmpty(query) ? { field: field[0] } : {}),
                },
                cancelToken: source.token,
            });

            if (!isEmpty(data)) {
                const { results, pagination } = data;
                if (!isEmpty(results)) {
                    setMaxPage(get(pagination, "totalPages", 1));
                    setTotalResults(get(pagination, "total", 0));
                    if (pageLimit > 1) {
                        let updatedClients = [];
                        table ? (updatedClients = results) : (updatedClients = [...clients, ...results]);
                        dispatch(addClients(updatedClients));
                    } else {
                        dispatch(addClients(results));
                    }
                } else {
                    dispatch(resetClients(results));
                }
            }
            setLoadingCards(false);
            setIsLoadingClients(false);
        } catch (err) {
            setLoadingCards(false);
            setIsLoadingClients(false);
            console.log(err);
        }
        setLoadingCards(false);
        setIsLoadingClients(false);
    }, [nrows, pageLimit, table, isLoadingClients, selectedOptions, channel, field, query]);

    const getStoredParams = async (room) => {
        const roomId = get(room, "roomId");
        const { referenceId } = room;
        const { botId } = room;
        const companyId = get(company, "id");
        setLoadingProfile(true);
        try {
            const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/information?`, {
                params: {
                    referenceId,
                    botId,
                    companyId,
                },
            });
            if (!isEmpty(data)) {
                const { results } = data;
                dispatch(setStoredParams(results));
            } else {
                dispatch(unsetStoredParams());
            }
            setLoadingProfile(false);
        } catch (err) {
            console.log(err);
            setLoadingProfile(false);
        }
    };

    const clearFilters = () => {
        setSelectedOptions(initialFilters);
        setChannel({});
        setQuery("");
        setField("");
    };

    const profileFilter = [
        {
            id: 0,
            name: "channel",
            placeholderButtonLabel: "Canal",
            options: channels,
            value: channel,
            placeholder: t("clients.channel"),
            type: "MultiCheckBox",
            onChange: onChangeChannel,
        },
        {
            id: 1,
            name: "date",
            startDate: selectedOptions.date[0],
            endDate: selectedOptions.date[0],
            placeholder: "Fecha",
            type: "Date",
        },
    ];

    const handleDownload = async () => {
        const [startAt, endAt] = selectedOptions.date;
        try {
            setLoadingDownload(true);
            const response = await DashboardServer.get(`/clients?`, {
                params: {
                    startAt,
                    endAt,
                    companyId: get(company, "id"),
                    download: true,
                    shouldPaginate: false,
                    ...(!isEmpty(channel) ? { type: channel.name } : {}),
                },
                responseType: "blob",
            });
            const { headers, data } = response;
            const isJsonResponse = headers['content-type'].includes("application/json");
            if (isJsonResponse){
                const link = document.createElement("a");
                link.href = data.url;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                FileDownload(response.data, `clients_${dayjs().format("DD/MM/YYYY-hh:mm:ss")}.xlsx`);
            }
        } catch (err) {
            renderToastMessage(t("plugins.error2"), MESSAGE_TYPES.ERROR);
        } finally {
            setLoadingDownload(false);
        }
    };

    const dateChange = (range) => {
        let [startDate, endDate] = range;
        setSelectedOptions({ ...selectedOptions, date: [startDate, endDate] });
    };

    const clearDate = () => {
        setSelectedOptions({ ...selectedOptions, date: [] });
    };

    const clearFilter = (filter) => {
        setSelectedOptions({ ...selectedOptions, [filter]: [] });
    };

    if (table) {
        return (
            <div>
                <div className="mt-4 flex space-x-2 rounded-t-xl bg-white pl-2 pr-4">
                    <div className="flex w-full items-center rounded-tl-xl bg-white">
                        <Filters
                            filters={profileFilter}
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
                            cancelToken={cancelToken}
                        />
                        <Tippy content={t("clients.download")} theme="jelou" placement={"bottom"} touch={false}>
                            <button
                                className="color-gradient flex h-8 w-8 flex-1 items-center justify-center rounded-full bg-primary-600 p-3 font-semibold text-white mid:flex-none"
                                onClick={handleDownload}>
                                {loadingDownload ? (
                                    <BeatLoader color={"#fff"} size={"0.25rem"} />
                                ) : (
                                    <DownloadIcon3 className="fill-current text-white" width="0.8125rem" height="0.9375rem" />
                                )}
                            </button>
                        </Tippy>
                    </div>
                    <div className="ml-3 flex space-x-2">
                        <button
                            onClick={() => {
                                setTable(false);
                                setPageLimit(1);
                            }}>
                            <svg
                                width="1.875rem"
                                height="1.875rem"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="rounded-md shadow-menu">
                                <path
                                    d="M0 7C0 3.13401 3.13401 0 7 0H33C36.866 0 40 3.13401 40 7V33C40 36.866 36.866 40 33 40H7C3.13401 40 0 36.866 0 33V7Z"
                                    fill="white"
                                />
                                <rect x="10" y="10" width="6.8" height="6.8" rx="1" stroke="#727C94" strokeOpacity="0.25" strokeWidth="2" />
                                <rect x="10" y="23.2" width="6.8" height="6.8" rx="1" stroke="#727C94" strokeOpacity="0.25" strokeWidth="2" />
                                <rect x="23.2" y="10" width="6.8" height="6.8" rx="1" stroke="#727C94" strokeOpacity="0.25" strokeWidth="2" />
                                <rect x="23.2" y="23.2" width="6.8" height="6.8" rx="1" stroke="#727C94" strokeOpacity="0.25" strokeWidth="2" />
                            </svg>
                        </button>
                        <button>
                            <svg width="1.875rem" height="1.875rem" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 7C0 3.13401 3.13401 0 7 0H33C36.866 0 40 3.13401 40 7V33C40 36.866 36.866 40 33 40H7C3.13401 40 0 36.866 0 33V7Z"
                                    fill="#00B3C7"
                                    fillOpacity="0.65"
                                />
                                <rect x="8" y="11" width="24" height="4" rx="2" fill="white" />
                                <rect x="8" y="18" width="24" height="4" rx="2" fill="white" />
                                <rect x="8" y="25" width="24" height="4" rx="2" fill="white" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex max-h-client flex-1 flex-col border-t-1 border-gray-100 border-opacity-25">
                    <ProfileTable
                        data={clients}
                        pageLimit={pageLimit}
                        setPageLimit={setPageLimit}
                        maxPage={maxPage}
                        nrows={nrows}
                        setRows={setRows}
                        isLoadingClients={isLoadingClients}
                        handleClientInfo={handleClientInfo}
                        query={query}
                        field={field}
                        totalResults={totalResults}
                        clearFilters={clearFilters}
                    />
                    <ProfileModal
                        openProfile={openProfile}
                        closeProfile={closeProfile}
                        profile={currentClient}
                        params={storedParams}
                        loadingProfile={loadingProfile}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mt-8 flex h-10 flex-row items-center justify-end space-x-3 px-4">
                <div className="relative flex h-full rounded-full">
                    <GlobalSearch
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        query={query}
                        setQuery={setQuery}
                        field={field}
                        setField={setField}
                        clearFilters={clearFilters}
                        search={search}
                        searchButton={searchButton}
                    />
                </div>
                {profileFilter.map((filter) => (
                    <div key={filter.id} className={`relative mr-5 flex items-center`}>
                        {get(filter, "type", "") === "Date" ? (
                            <DateRangePicker
                                dateValue={selectedOptions.date}
                                icon={filter.icon}
                                dateChange={dateChange}
                                clearDate={clearDate}
                                background={"#EEF1F4"}
                            />
                        ) : (
                            <div className={`mx-3 flex w-48 items-center`}>
                                <ComboboxSelect
                                    options={filter.options}
                                    icon={filter.icon}
                                    value={filter.value}
                                    placeholder={filter.placeholder}
                                    label={filter.placeholder}
                                    handleChange={filter.onChange}
                                    name={filter.name}
                                    background={"#EEF1F4"}
                                    clearFilter={clearFilter}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <div className="flex h-full">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="focus-visible:ring-2 inline-flex h-10 w-full justify-items-center rounded-[0.8125rem] border-1 border-gray-400 border-opacity-25 px-4 py-2 text-sm font-medium text-gray-400 focus:outline-none">
                                <SortIcon className="mr-2 mt-1 fill-current font-bold text-gray-400 text-opacity-50" width="20" height="15" />
                                {t("clients.sort")}
                                <DownIcon
                                    className="-mr-1 ml-2 h-5 w-5 fill-current text-gray-400"
                                    aria-hidden="true"
                                    stroke={"rgba(166, 180, 208, 0.5)"}
                                />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className="ring-1 ring-opacity-5 divide-y absolute right-0 z-30 mt-2 w-56 origin-top-right divide-gray-400/75 rounded-lg bg-white shadow-lg ring-black focus:outline-none">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        <button
                                            onClick={() => setSortOrder("asc_alphabet")}
                                            className={`${
                                                sortOrder === "asc_alphabet" ? "text-primary-200" : "text-gray-400"
                                            } group flex w-full items-center justify-center border-b-1 border-gray-400 border-opacity-25 px-2 py-2 text-sm font-semibold hover:bg-gray-400 hover:bg-opacity-15 hover:text-primary-200`}>
                                            A - Z
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            onClick={() => setSortOrder("desc_alphabet")}
                                            className={`${
                                                sortOrder === "desc_alphabet" ? "text-primary-200" : "text-gray-400"
                                            } group flex w-full items-center justify-center border-b-1 border-gray-400 border-opacity-25 px-2 py-2 text-sm font-semibold hover:bg-gray-400 hover:bg-opacity-15 hover:text-primary-200`}>
                                            Z - A
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            onClick={() => setSortOrder("asc_client")}
                                            className={`${
                                                sortOrder === "asc_client" ? "text-primary-200" : "text-gray-400"
                                            } group flex w-full items-center justify-center border-b-1 border-gray-400 border-opacity-25 px-2 py-2 text-sm font-semibold hover:bg-gray-400 hover:bg-opacity-15 hover:text-primary-200`}>
                                            {t("clients.createdRecently")}
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            onClick={() => setSortOrder("desc_client")}
                                            className={`${
                                                sortOrder === "desc_client" ? "text-primary-200" : "text-gray-400"
                                            } group flex w-full items-center justify-center px-2 py-2 text-sm font-semibold hover:bg-gray-400 hover:bg-opacity-15 hover:text-primary-200`}>
                                            {t("clients.createdLessRecently")}
                                        </button>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
                <Tippy content={t("AdminFilters.clean")} theme="jelou" placement={"bottom"} touch={false}>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-960 focus:outline-none" onClick={clearFilters}>
                        <CleanIcon className="fill-current text-white" width="0.8125rem" height="0.9375rem" />
                    </button>
                </Tippy>
                <Tippy content={t("clients.download")} theme="jelou" placement={"bottom"} touch={false}>
                    <button
                        onClick={handleDownload}
                        className="color-gradient flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 font-semibold text-white">
                        {loadingDownload ? (
                            <BeatLoader color={"#fff"} size={"0.25rem"} />
                        ) : (
                            <DownloadIcon3 className="fill-current text-white" width="0.8125rem" height="0.9375rem" />
                        )}
                    </button>
                </Tippy>
                <div className="flex items-center space-x-2">
                    <GridViewIcon selected={!table} width="1.875rem" height="1.875rem" className="rounded-md" />
                    <button onClick={() => setTable(true)}>
                        <TableViewIcon selected={table} width="1.875rem" height="1.875rem" className="rounded-md" />
                    </button>
                </div>
            </div>
            <ProfileGrid
                data={clients}
                sortOrder={sortOrder}
                maxPage={maxPage}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
                loadingCards={loadingCards}
                getStoredParams={getStoredParams}
                loadingProfile={loadingProfile}
                query={query}
                field={field}
            />
        </>
    );
};

export default ClientsProfile;
