import axios from "axios";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import NewFilters from "../new-filters/new-filters";

const KIAFilters = (props) => {
    const {
        filteredCategory,
        setFilteredCategory,
        filteredAgencies,
        setFilteredAgencies,
        filteredGroups,
        setFilteredGroups,
        filteredCities,
        setFilteredCities,
        setInitialDate,
        setFinalDate,
        searchReports,
        searchMissedConversation,
        notDerivedMetrics,
        setMyTeams,
        setCleanFilters,
    } = props;
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [cities, setCities] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const company = useSelector((state) => state.company);
    const teams = useSelector((state) => state.teams);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingAgencies, setLoadingAgencies] = useState(false);

    const PREFIX = "/monitoring/"; // process.env.REACT_APP_USE_PREFIX ? // : '/';

    let location = useLocation();

    const getCategories = () => {
        setLoadingCategories(true);
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/categories/`, {
                params: {
                    ...(filteredAgencies && filteredAgencies.value !== "-1" ? { agency: filteredAgencies.label } : {}),
                    ...(filteredGroups && filteredGroups.value !== "-1" ? { group: filteredGroups.label } : {}),
                    ...(filteredCities && filteredCities.value !== "-1" ? { city: filteredCities.label } : {}),
                    teamIds: teams,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") setMyTeams(data[combo]);
                });
                setLoadingCategories(false);
            })
            .catch((err) => {
                setLoadingCategories(false);
                console.log(err);
            });
    };

    const getCities = () => {
        setLoadingCities(true);
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/cities/`, {
                params: {
                    ...(filteredAgencies && filteredAgencies.value !== "-1" ? { agency: filteredAgencies.label } : {}),
                    ...(filteredGroups && filteredGroups.value !== "-1" ? { group: filteredGroups.label } : {}),
                    ...(filteredCategory && filteredCategory.value !== "-1" ? { category: filteredCategory.label } : {}),
                    teamIds: teams,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") setMyTeams(data[combo]);
                });
                setLoadingCities(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingCities(false);
            });
    };

    const getGroups = () => {
        setLoadingGroups(true);
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/groups/`, {
                params: {
                    ...(filteredAgencies && filteredAgencies.value !== "-1" ? { agency: filteredAgencies.label } : {}),
                    ...(filteredCities && filteredCities.value !== "-1" ? { city: filteredCities.label } : {}),
                    ...(filteredCategory && filteredCategory.value !== "-1" ? { category: filteredCategory.label } : {}),
                    teamIds: teams,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") setMyTeams(data[combo]);
                });
                setLoadingGroups(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingGroups(false);
            });
    };

    const getAgencies = () => {
        setLoadingAgencies(true);
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/agencies/`, {
                params: {
                    ...(filteredGroups && filteredGroups.value !== "-1" ? { group: filteredGroups.label } : {}),
                    ...(filteredCities && filteredCities.value !== "-1" ? { city: filteredCities.label } : {}),
                    ...(filteredCategory && filteredCategory.value !== "-1" ? { category: filteredCategory.label } : {}),
                    teamIds: teams,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") setMyTeams(data[combo]);
                    setLoadingAgencies(false);
                });
            })
            .catch((err) => {
                setLoadingAgencies(false);
                console.log(err);
            });
    };

    useEffect(() => {
        getCategories();
    }, [filteredGroups, filteredCities, filteredAgencies]);

    useEffect(() => {
        getCities();
    }, [filteredAgencies, filteredCategory, filteredGroups]);

    useEffect(() => {
        getGroups();
    }, [filteredAgencies, filteredCategory, filteredCities]);

    useEffect(() => {
        getAgencies();
    }, [filteredGroups, filteredCategory, filteredCities]);

    const cleanFilters = () => {
        if (isEmpty(filteredCategory) && isEmpty(filteredGroups) && isEmpty(filteredCities) && isEmpty(filteredAgencies)) {
            return;
        }
        //status, tags, teams, operator, dates

        // status
        setFilteredCategory("");

        //tags
        setFilteredGroups("");

        //teams
        setFilteredCities("");

        //operators
        setFilteredAgencies("");

        //dates
        getKIAFilters();

        if (location.pathname === `${PREFIX}reports`) {
            setInitialDate(dayjs().hour(0).minute(0).second(0).format());
            const updInitiallDate = dayjs().hour(0).minute(0).second(0).format();
            const updFinalDate = dayjs().hour(23).minute(59).second(59).format();
            setFinalDate(dayjs().hour(23).minute(59).second(59).format());
            searchReports(false, true, updInitiallDate, updFinalDate);
            searchMissedConversation(false, true, updInitiallDate, updFinalDate);
            notDerivedMetrics(true, updInitiallDate, updFinalDate);
        }

        if (location.pathname === `${PREFIX}`) {
            setCleanFilters(true);
        }
    };

    const filters = [
        {
            placeholder: "Categorías",
            multipleSelect: false,
            filteredOption: filteredCategory,
            setFilteredOption: setFilteredCategory,
            options: categories,
            loading: loadingCategories,
        },
        {
            placeholder: "Grupos",
            multipleSelect: false,
            filteredOption: filteredGroups,
            setFilteredOption: setFilteredGroups,
            options: groups,
            loading: loadingGroups,
        },
        {
            placeholder: "Ciudades",
            multipleSelect: false,
            filteredOption: filteredCities,
            setFilteredOption: setFilteredCities,
            options: cities,
            loading: loadingCities,
        },
        {
            placeholder: "Agencias",
            multipleSelect: false,
            filteredOption: filteredAgencies,
            setFilteredOption: setFilteredAgencies,
            options: agencies,
            loading: loadingAgencies,
        },
    ];

    const getKIAFilters = () => {
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/`, {
                params: { teamIds: teams },
            })
            .then(({ data }) => {
                Object.keys(data.combos).forEach((combo) => {
                    if (combo === "categories") setCategories(data.combos[combo]);
                    if (combo === "groups") setGroups(data.combos[combo]);
                    if (combo === "cities") setCities(data.combos[combo]);
                    if (combo === "agencies") setAgencies(data.combos[combo]);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (company.id === 118) {
            getKIAFilters();
        }
    }, [company]);

    return <NewFilters filters={filters} cleanFilters={cleanFilters} />;
};
export default KIAFilters;
