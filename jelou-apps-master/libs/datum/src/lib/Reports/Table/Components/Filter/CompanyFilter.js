import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";

import { ComboboxSelect } from "@apps/shared/common";
import { DashboardServer } from "@apps/shared/modules";
import LoadingFilter from "./LoadingFilter";
import { useSelector } from "react-redux";

const CompanyFilter = ({ filter, setRequestParams, setCompanySeleted }) => {
    const { key, placeholder } = filter;
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState({});

    const userSession = useSelector((state) => state.userSession);

    useEffect(() => {
        getCompanies();
        return () => {
            setCompanies([]);
            setCompanySeleted(null);
        };
    }, []);

    const getCompanies = async () => {
        try {
            const { id: userId, companyId } = userSession;
            const { data: companies } = await DashboardServer.get(`users/${userId}/companies`);

            setCompanies(get(companies, "data", []));

            const company = companies.data.find((company) => company.id === companyId);

            if (!isEmpty(company)) {
                setRequestParams((preState) => ({ ...preState, [key]: company.id }));
                // setValue((preState) => ({ ...preState, [key]: { name: company.name, value: company.id } }));
                setValue({ name: company.name, value: company.id, id: company.id });
                setCompanySeleted(company.id);
                setLoading(false);
                return;
            }

            const getFirstCompany = first(companies.data);
            if (!isEmpty(getFirstCompany)) {
                setCompanySeleted(getFirstCompany.id);
                setRequestParams((preState) => ({ ...preState, [key]: getFirstCompany.id }));
                // setValue((preState) => ({ ...preState, [key]: { name: getFirstCompany.name, value: getFirstCompany.id } }));
                setValue({ name: company.name, value: company.id, id: company.id });
            }
        } catch (error) {
            console.error(error.message);
            console.error(error.response);
        }
        setLoading(false);
    };

    const handleChange = (value) => {
        const { key } = filter;
        setCompanySeleted(value.value);
        // setValue((preState) => ({ ...preState, [key]: value }));
        setValue(value);
        setRequestParams((preState) => ({ ...preState, [key]: value.value }));
    };

    const companiesOptions = companies.map((company) => ({
        name: company.name,
        value: company.id,
        id: company.id,
    }));

    if (loading) {
        return <LoadingFilter />;
    }

    if (!isEmpty(companies) && companies.length <= 1) {
        return null;
    }

    return (
        companiesOptions &&
        companiesOptions.length > 0 && (
            <div className="w-60">
                <ComboboxSelect
                    hasClearButton={false}
                    background="#fff"
                    handleChange={handleChange}
                    label={filter.label}
                    name={key}
                    options={companiesOptions}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
        )
    );
};

export default CompanyFilter;
