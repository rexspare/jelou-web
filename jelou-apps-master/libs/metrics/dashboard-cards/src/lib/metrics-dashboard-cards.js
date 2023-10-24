import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import toUpper from "lodash/toUpper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";

import { DashboardServer } from "@apps/shared/modules";
import DashboardCard from "./DashboardCard";
import { setDashboards } from "@apps/redux/store";
import { SectionWrapper } from "@apps/shared/common";
import Actions from "./Actions";

const DashboardMenu = (props) => {
    const dashboards = useSelector((state) => state.dashboards);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const company = useSelector((state) => state.company);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEmpty(company)) {
            getDashboards();
        }
    }, [company]);

    useEffect(() => {
        if (dashboards.length === 1) {
            const dash = first(dashboards);
            localStorage.setItem("dashboardName", dash.displayName);
        }
    }, [dashboards]);

    const findUser = ({ target }) => {
        const { value } = target;
        setQuery(value);
    };

    const getFilteredDashboards = () => {
        if (isEmpty(query)) {
            return dashboards;
        }

        return dashboards.filter((dash) => toUpper(dash.displayName).startsWith(toUpper(query)));
    };

    const getDashboards = async () => {
        if (!company) {
            return;
        }
        try {
            setLoading(true);
            const { data } = await DashboardServer.get(`companies/${company.id}/dashboards`);
            const dashboardsList = get(data, "data.dashboards", []);
            const selectedDash = first(dashboardsList);
            dispatch(setDashboards(orderBy(dashboardsList, ["favorite"], ["desc"])));
            if (dashboardsList.length === 1) {
                navigate(`/metrics/${selectedDash.id}`);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const filteredDash = getFilteredDashboards();
    const dashboardsSearch = filteredDash;

    if (loading) {
        return (
            <div className="absolute left-0 flex h-full w-full items-center justify-center" id="loading-metrics">
                <GridLoader size={15} color={"#00B3C7"} loading={loading} />
            </div>
        );
    }

    return (
        <SectionWrapper className="px-12 py-6">
            <div className="relative">
                <div className="z-50 mb-12 space-y-9">
                    <div className="flex items-center justify-between">
                        <h1 className="block justify-start font-primary font-bold leading-9 text-primary-200 sm:text-2xl">
                            {t("plugins.Mis métricas")}
                        </h1>
                        <Actions findUser={findUser} t={t} />
                    </div>
                    <div>
                        <div className="grid grid-flow-row gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minMax(18.125rem, 1fr))" }}>
                            {dashboardsSearch.map((dash) => {
                                return <DashboardCard t={t} key={dash.id} dash={dash} getDashboards={getDashboards} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default DashboardMenu;
