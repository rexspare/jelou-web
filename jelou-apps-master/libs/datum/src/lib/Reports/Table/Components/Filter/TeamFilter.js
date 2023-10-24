import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";

import { ComboboxSelect } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import LoadingFilter from "./LoadingFilter";

const TeamFilter = ({ setRequestParams, companyId, filter }) => {
    const { key, placeholder } = filter;
    const [value, setValue] = useState({});
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState([]);
    const userSession = useSelector((state) => state.userSession);

    useEffect(() => {
        getTeams();
    }, []);

    useEffect(() => {
        const filteredTeams = teams.filter((team) => team.companyId === companyId);
        setTeams(filteredTeams);
    }, [companyId]);

    const getTeams = async () => {
        setLoading(true);
        try {
            const { companyId } = userSession;
            const { data: teams } = await JelouApiV1.get(`v1/company/${companyId}/teams`, {
                params: {
                    shouldPaginate: false,
                },
            });

            setTeams(teams.results);
            setLoading(false);
        } catch (error) {
            console.error(error.message);
            console.error(error.response);
            setLoading(false);
        }
    };

    const teamsOptions = teams.map((team) => ({
        name: `${team.name}`,
        value: team.id,
    }));

    const handleChange = (value) => {
        // setValue((preState) => ({ ...preState, [key]: value }));
        setValue(value);
        setRequestParams((preState) => ({ ...preState, [key]: value.value }));
    };

    if (loading) {
        return <LoadingFilter />;
    }

    if (!isEmpty(teams) && teams.length <= 1) {
        return null;
    }

    const clearFilter = () => {
        setValue({});
        setRequestParams((preState) => ({ ...preState, [key]: "" }));
    };

    return (
        teamsOptions &&
        teamsOptions.length > 0 && (
            <div className="w-60">
                <ComboboxSelect
                    // icon={filter.icon}
                    background={"#fff"}
                    clearFilter={clearFilter}
                    handleChange={handleChange}
                    label={filter.label}
                    name={key}
                    options={teamsOptions}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
        )
    );
};

export default TeamFilter;
