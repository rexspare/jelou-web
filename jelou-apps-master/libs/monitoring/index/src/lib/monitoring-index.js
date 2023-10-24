import axios from "axios";
import get from "lodash/get";
import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Connections from "@apps/monitoring/connections";
import MonitoringHistory from "@apps/monitoring/conversations";
import MonitoringLive from "@apps/monitoring/live";
import Operators from "@apps/monitoring/operators";
import MonitoringReports from "@apps/monitoring/reports";
import { useOperatorDataTable } from "@apps/shared/hooks";
import { JelouApiV1 } from "@apps/shared/modules";

import { Layout } from "@apps/monitoring/index/layout";
import { MonitoringQuickReply } from "@apps/monitoring/quickreply";
import { MonitoringTags } from "@apps/monitoring/tags";
import { BindingOperatorsEvents } from "@apps/monitoring/ui-shared";
import { addOperators, getBotsMonitoring } from "@apps/redux/store";
import { Menu } from "@apps/shared/common";

const Monitoring = (props) => {
    const [menuTabs, setMenuTabs] = useState([]);
    const [hasFilterMenu, setHasFilterMenu] = useState(true);

    const { tab } = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const company = useSelector((state) => state.company);
    const teamScopes = useSelector((state) => state.teamScopes);
    const botsMonitoring = useSelector((state) => state.botsMonitoring);
    const userSession = useSelector((state) => state.userSession);

    const [tabs, setTabs] = useState(tab);

    const { showPage404, setShowPage404 } = props;
    const { section, subsection } = useParams();
    const [teamOptions, setTeamOptions] = useState([]);
    const [allTeamsOptions, setAllTeamsOptions] = useState([]);
    const [chatTeamsOptions, setChatTeamsOptions] = useState([]);
    const [publicsTeamsOptions, setPublicsTeamsOptions] = useState([]);
    const [operatorOptions, setOperatorOptions] = useState([]);
    const [botOptions, setBotOptions] = useState([]);

    const emailBots = botsMonitoring.filter((bot) => bot.type === "email");
    const publicBots = botsMonitoring.filter((bot) => toLower(bot.type) === "facebook_feed" || toLower(bot.type) === "twitter_replies");
    const chatBots = botsMonitoring.filter((bot) => toLower(bot.type) !== "facebook_feed" && toLower(bot.type) !== "twitter_replies" && toLower(bot.type) !== "email");

    const cancelToken = axios.CancelToken.source();

    const [emailsTeamsOptions, setEmailsTeamsOptions] = useState([]);

    const hasEmailBot = botsMonitoring.some((bot) => toUpper(bot.type) === "EMAIL");

    //This is KIA logic
    const ifKia = get(company, "id") === 118;

    const [filteredCategory, setFilteredCategory] = useState({});
    const [filteredAgencies, setFilteredAgencies] = useState({});
    const [filteredGroups, setFilteredGroups] = useState({});
    const [filteredCities, setFilteredCities] = useState({});
    const [cleanFilters, setCleanFilters] = useState(false);
    const [filtersKia, setFiltersKia] = useState(false);

    const [kiaParams, setKiaParams] = useState({ ifKia, filteredCategory, filteredAgencies, filteredGroups, filteredCities });

    const [operatorParams, setOperatorParams] = useState({ page: 1, limit: 10 });
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const prevLangRef = useRef();

    useEffect(() => {
        prevLangRef.current = lang;
    }, []);

    const { isLoading: isLoadingOperators, isFetching: isFetchingOperators, data: dataOperators = [] } = useOperatorDataTable(company, operatorParams, kiaParams);

    useEffect(() => {
        setKiaParams({ ifKia, filteredCategory, filteredAgencies, filteredGroups, filteredCities });
    }, [filteredCategory, filteredAgencies, filteredGroups, filteredCities]);

    useEffect(() => {
        dispatch(getBotsMonitoring());
        document.cookie = "nf_ab=;expires=; path=/";
    }, []);

    useEffect(() => {
        if (isEmpty(section)) {
            setTabs("");
            setHasFilterMenu(true);
        } else {
            if (section === "" || section === "live") {
                setTabs("live");
                setHasFilterMenu(true);
            }
            if (section === "operators") {
                setTabs("operators");
                setHasFilterMenu(false);
            }
            if (section === "cases") {
                setTabs("cases");
                setHasFilterMenu(true);
            }
            if (section === "quickreply") {
                setTabs("quickreply");
                setHasFilterMenu(false);
            }
            if (section === "tags") {
                setTabs("tags");
                setHasFilterMenu(false);
            }
            if (section === "history") {
                setTabs("history");
                setHasFilterMenu(true);
            }

            if (section === "connections") {
                setTabs("connections");
                setHasFilterMenu(false);
            }
        }
    }, [section]);

    useEffect(() => {
        if (section !== "operators") {
            setOperatorParams({ ...operatorParams, query: "" });
        }
    }, [section]);

    useEffect(() => {
        let tabsArray = [
            { name: t("monitoring.En vivo"), tab: "live" },
            { name: t("monitoring.Operadores"), tab: "operators" },
            { name: t("monitoring.Casos"), tab: "cases" },
            { name: t("monitoring.Historial"), tab: "history" },
            { name: t("monitoring.Mensajes Rápidos"), tab: "quickreply" },
            { name: t("monitoring.Etiquetas"), tab: "tags" },
        ];
        if (ifKia) tabsArray.push({ name: t("monitoring.Conexiones"), tab: "connections" });
        if (isEmpty(menuTabs) || prevLangRef.current !== lang) {
            setMenuTabs(tabsArray);
            prevLangRef.current = lang;
        }
    }, [menuTabs, lang]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getTeams();
        }
    }, [company]);

    useEffect(() => {
        if (!isEmpty(botsMonitoring)) {
            getTeams();
        }
    }, [userSession, botsMonitoring]);

    const getTeams = async () => {
        const { id } = company;
        const teamScopes = get(userSession, "teamScopes", []);
        JelouApiV1.get(`/company/${id}/teams`, {
            params: {
                limit: 200,
            },
        })
            .then(({ data }) => {
                const { results } = data;
                if (!isEmpty(teamScopes)) {
                    const teamScopesFiltered = results.filter((team) => includes(teamScopes, team.id));
                    setAllTeamsOptions(teamScopesFiltered);

                    const teamScopesChatFiltered = results.filter((team) => includes(get(team, "properties.views", []), "chats") && includes(teamScopes, team.id));

                    const teamScopesPostsFiltered = results.filter((team) => includes(get(team, "properties.views", []), "posts") && includes(teamScopes, team.id));

                    const teamScopesEmailsFiltered = results.filter((team) => includes(get(team, "properties.views", []), "emails") && includes(teamScopes, team.id));

                    setChatTeamsOptions(teamScopesChatFiltered);
                    setEmailsTeamsOptions(teamScopesEmailsFiltered);
                    setPublicsTeamsOptions(teamScopesPostsFiltered);
                } else {
                    setAllTeamsOptions(results);

                    const teamChatFiltered = results.filter((team) => includes(get(team, "properties.views", []), "chats"));
                    const teamPostsFiltered = results.filter((team) => includes(get(team, "properties.views", []), "posts"));
                    const teamEmailsFiltered = results.filter((team) => includes(get(team, "properties.views", []), "emails"));

                    setChatTeamsOptions(teamChatFiltered);
                    setEmailsTeamsOptions(teamEmailsFiltered);
                    setPublicsTeamsOptions(teamPostsFiltered);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const navigationTabs = (opt) => () => {
        setTabs(opt.tab);
    };

    const options = menuTabs.map((opt, index) => {
        const handleClick = navigationTabs(opt);
        return {
            id: index,
            name: opt.children ? opt.children.toLowerCase() : opt.tab.toLowerCase(),
            label: opt.children ? opt.children.toLowerCase() : opt.name.toLowerCase(),
            hidden: index > 3 ? true : false,
            handleClick,
        };
    });

    useEffect(() => {
        if (!isEmpty(subsection) && !isEmpty(botsMonitoring)) {
            switch (subsection) {
                case "emails":
                    setBotOptions(orderBy(emailBots, ["name"], ["asc"]));
                    setTeamOptions(orderBy(emailsTeamsOptions, ["name"], ["asc"]));
                    break;
                case "chats":
                    setBotOptions(orderBy(chatBots, ["name"], ["asc"]));
                    setTeamOptions(orderBy(chatTeamsOptions, ["name"], ["asc"]));
                    break;
                case "posts":
                    setBotOptions(orderBy(publicBots, ["name"], ["asc"]));
                    setTeamOptions(orderBy(publicsTeamsOptions, ["name"], ["asc"]));
                    break;
                default:
                    setBotOptions(orderBy(botsMonitoring, ["name"], ["asc"]));
                    setTeamOptions(orderBy(allTeamsOptions, ["name"], ["asc"]));
                    break;
            }
        }
    }, [botsMonitoring, subsection, allTeamsOptions, emailsTeamsOptions, chatTeamsOptions, publicsTeamsOptions]);

    const switchTab = (section) => {
        switch (toUpper(section)) {
            case "LIVE":
                return (
                    <MonitoringLive
                        botOptions={botOptions}
                        operatorOptions={operatorOptions}
                        teamOptions={teamOptions}
                        publicBots={publicBots}
                        botEmail={emailBots}
                        showPage404={showPage404}
                        setShowPage404={setShowPage404}
                        //KIA
                        ifKia={ifKia}
                        filteredCategory={filteredCategory}
                        setFilteredCategory={setFilteredCategory}
                        filteredAgencies={filteredAgencies}
                        setFilteredAgencies={setFilteredAgencies}
                        filteredGroups={filteredGroups}
                        setFilteredGroups={setFilteredGroups}
                        filteredCities={filteredCities}
                        setFilteredCities={setFilteredCities}
                        getOperators={getOperators2}
                    />
                );
            case "OPERATORS":
                return (
                    <BindingOperatorsEvents>
                        <Operators
                            isLoadingOperators={isLoadingOperators || isFetchingOperators}
                            company={company}
                            teamScopes={teamScopes}
                            operatorParams={operatorParams}
                            setOperatorParams={setOperatorParams}
                            dataOperators={dataOperators}
                            teams={allTeamsOptions}
                            botEmail={emailBots}
                            teamOptions={teamOptions}
                            //KIA
                            ifKia={ifKia}
                            filteredCategory={filteredCategory}
                            setFilteredCategory={setFilteredCategory}
                            filteredAgencies={filteredAgencies}
                            setFilteredAgencies={setFilteredAgencies}
                            filteredGroups={filteredGroups}
                            setFilteredGroups={setFilteredGroups}
                            filteredCities={filteredCities}
                            setFilteredCities={setFilteredCities}
                            cleanFilters={cleanFilters}
                            setCleanFilters={setCleanFilters}
                            filtersKia={filtersKia}
                            setFiltersKia={setFiltersKia}
                        />
                    </BindingOperatorsEvents>
                );
            case "HISTORY":
                return <MonitoringHistory teamOptions={teamOptions} hasEmailBot={hasEmailBot} botOptions={botOptions} operatorOptions={operatorOptions} company={company} />;
            case "CASES":
                return (
                    <MonitoringReports
                        teamOptions={teamOptions}
                        botOptions={botOptions}
                        ifKia={ifKia}
                        kiaParams={kiaParams}
                        filteredCategory={filteredCategory}
                        setFilteredCategory={setFilteredCategory}
                        filteredAgencies={filteredAgencies}
                        setFilteredAgencies={setFilteredAgencies}
                        filteredGroups={filteredGroups}
                        setFilteredGroups={setFilteredGroups}
                        filteredCities={filteredCities}
                        setFilteredCities={setFilteredCities}
                        operatorOptions={operatorOptions}
                        cleanFilters={cleanFilters}
                        setCleanFilters={setCleanFilters}
                        filtersKia={filtersKia}
                        setFiltersKia={setFiltersKia}
                    />
                );
            case "QUICKREPLY":
                return <MonitoringQuickReply />;
            case "TAGS":
                return <MonitoringTags ifKia={ifKia} company={company} teamsArray={teamOptions} />;
            case "CONNECTIONS":
                return (
                    <div className="mt-4">
                        <Connections ifKia={ifKia} />
                    </div>
                );
            default:
                return setShowPage404(true);
        }
    };

    useEffect(() => {
        if (!isEmpty(teamOptions) && !isEmpty(subsection)) {
            getOperators2(teamOptions);
        }
        return () => cancelToken.cancel("Cancelling");
    }, [teamOptions, subsection, filtersKia, cleanFilters]);

    const getOperators2 = async () => {
        try {
            const { data } = await JelouApiV1.get(`/company/${company.id}/operators`, {
                params: {
                    active: 1,
                    ...(!isEmpty(teamOptions) ? { teams: [teamOptions.map((team) => team.id)] } : {}),
                    ...(ifKia && filtersKia && !cleanFilters
                        ? {
                              storedParams: {
                                  ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                                  ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                                  ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                                  ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                              },
                          }
                        : {}),
                },
                cancelToken: cancelToken.token,
            });
            let orderedOperators = orderBy(data, ["names"], ["asc"]);
            setOperatorOptions(orderedOperators);
            dispatch(addOperators(data));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden px-5 py-6 mid:px-10 lg:px-12">
            <Menu title={t("monitoring.Monitoreo")} options={options} view={"monitoring"} hasTabs={true} tabs={tabs} rounded={!hasFilterMenu} lang={lang} />
            <Layout>{switchTab(section)}</Layout>
        </div>
    );
};
export default Monitoring;
