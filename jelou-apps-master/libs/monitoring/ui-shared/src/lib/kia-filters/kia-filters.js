import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import NewFilters from "../kia-combobox/kia-combobox";
import { addTeams } from "@apps/redux/store";

const KIAFilters = (props) => {
    const {
        ifKia,
        filteredGroups,
        filteredCities,
        filteredCategory,
        filteredAgencies,
        setFilteredGroups,
        setFilteredCities,
        setFilteredCategory,
        setFilteredAgencies,
        userScopes,
        applySearch,
        cleanFilters,
    } = props;
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [cities, setCities] = useState([]);
    const [agencies, setAgencies] = useState([]);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingAgencies, setLoadingAgencies] = useState(false);

    const dispatch = useDispatch();

    const getCategories = () => {
        setLoadingCategories(true);
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/categories/`, {
                params: {
                    ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                    ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                    ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                    teamIds: userScopes,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") dispatch(addTeams(data[combo]));
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
                    ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                    ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                    ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                    teamIds: userScopes,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") dispatch(addTeams(data[combo]));
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
                    ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                    ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                    ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                    teamIds: userScopes,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") dispatch(addTeams(data[combo]));
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
                    ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                    ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                    ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                    teamIds: userScopes,
                },
            })
            .then(({ data }) => {
                Object.keys(data).forEach((combo) => {
                    if (combo === "categories") setCategories(data[combo]);
                    if (combo === "groups") setGroups(data[combo]);
                    if (combo === "cities") setCities(data[combo]);
                    if (combo === "agencies") setAgencies(data[combo]);
                    if (combo === "teamsIds") dispatch(addTeams(data[combo]));
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

    const filters = [
        {
            placeholder: "Categorías",
            filteredOption: filteredCategory,
            setFilteredOption: setFilteredCategory,
            options: categories.map((category) => ({ name: category, value: category })),
            loading: loadingCategories,
        },
        {
            placeholder: "Grupos",
            filteredOption: filteredGroups,
            setFilteredOption: setFilteredGroups,
            options: groups.map((group) => ({ name: group, value: group })),
            loading: loadingGroups,
        },
        {
            placeholder: "Ciudades",
            filteredOption: filteredCities,
            setFilteredOption: setFilteredCities,
            options: cities.map((city) => ({ name: city, value: city })),
            loading: loadingCities,
        },
        {
            placeholder: "Agencias",
            filteredOption: filteredAgencies,
            setFilteredOption: setFilteredAgencies,
            options: agencies.map((agencie) => ({ name: agencie, value: agencie })),
            loading: loadingAgencies,
        },
    ];

    const getKIAFilters = () => {
        axios
            .get(`https://c1dt2n99y7.execute-api.us-east-1.amazonaws.com/dev/`, {
                params: { teamIds: userScopes },
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
        if (ifKia) {
            getKIAFilters();
        }
    }, [ifKia]);

    return (
        <NewFilters
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
            filteredGroups={filteredGroups}
            setFilteredGroups={setFilteredGroups}
            filteredAgencies={filteredAgencies}
            setFilteredAgencies={setFilteredAgencies}
            filteredCities={filteredCities}
            setFilteredCities={setFilteredCities}
            filters={filters}
            cleanFilters={cleanFilters}
            applySearch={applySearch}
        />
    );
};
export default KIAFilters;
