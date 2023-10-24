import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
// import { SectionWrapper } from "@apps/shared/common";

import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import Chart from "@apps/metrics/chart";
import { setDashboards } from "@apps/redux/store";
import { useDispatch, useSelector } from "react-redux";

const Metrics = (props) => {
    const { setShowPage404 } = props;
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState([]);
    const [companies, setCompanies] = useState([]);
    const company = useSelector((state) => state.company);
    const [companyId, setCompanyId] = useState(null);
    const dashboards = useSelector((state) => state.dashboards);
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const dashboardName = get(localStorage, "dashboardName", "");
    const { t } = useTranslation();

    const { dash } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isEmpty(company) && !isEmpty(userSession)) getAnalytics();
    }, [company, userSession]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getDashboards();
            setCompanyId(company.id);
        }
    }, [company]);

    const getDashboards = async () => {
        if (!company) {
            return;
        }
        try {
            setLoading(true);
            const { data } = await DashboardServer.get(`companies/${company.id}/dashboards`);
            const dashboardsList = get(data, "data.dashboards", []);
            dispatch(setDashboards(orderBy(dashboardsList, ["favorite"], ["desc"])));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    async function getAnalytics() {
        if (!company) {
            return;
        }

        try {
            setLoading(true);
            const { id: userId } = userSession;
            const { data } = await DashboardServer.get(`companies/${company.id}/dashboards/${dash}`);
            const { id: companyId } = company;
            let { data: companies } = await DashboardServer.get(`users/${userId}/companies`, {
                params: {
                    inProduction: true,
                },
            });

            const { data: bots } = await JelouApiV1.get(`/bots`, {
                params: {
                    userId,
                    state: 1,
                    ...(companyId === 5 || companyId === 135 || companyId === 155 || companyId === 11 ? { inProduction: true } : {}),
                },
            });
            const results = orderBy(bots, ["name"], ["asc"]);
            setLoading(false);
            setBots(results);
            setCompanies(get(companies, "data"));
            const analyticsOrdered = orderBy(get(data, "data", []), ["order"], ["asc"]);
            setAnalytics(analyticsOrdered);
        } catch (error) {
            console.error(error);
            const errorResponse = get(error, "response.data.error", "");
            if (errorResponse.code === "E0422") {
                setShowPage404(true);
            }
            console.log(errorResponse);
        }
    }

    function calculateWidth(width) {
        switch (width) {
            case "1/4":
                return "span-1";
            case "1/2":
                return "span-1";
            case "1/3":
                return "span-1";
            default:
                return "span-2";
        }
    }

    return (
        // <SectionWrapper className="px-12 py-6 ml-20">
        <div className="space-y-9 px-12 py-6">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-start space-x-2 text-xl leading-9 text-gray-500">
                    {dashboards.length > 1 && (
                        <>
                            <Link className="cursor-pointer " to={`/metrics`}>
                                {t("plugins.Mis métricas")}
                            </Link>
                            <div>/</div>
                        </>
                    )}
                    <div className="flex font-bold text-primary-200"> {dashboardName}</div>
                </div>
            </div>
            <div>
                {loading ? (
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center" id="loading-metrics">
                        <GridLoader size={15} color={"#00B3C7"} loading={loading} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {analytics.map((analytic) => {
                            const { Analytic, chartProperties } = analytic;
                            if (analytic.state === 0) {
                                return;
                            }
                            // get type name
                            const graphType = get(Analytic, "type", "").toString();

                            const width = graphType === "nodes" ? "span-2" : calculateWidth(chartProperties.width);
                            const analyticTitle = Analytic.displayNames;
                            const translationsTitles = get(Analytic, "translationsTitles", {});
                            let title = get(chartProperties, "chartName", get(analyticTitle, lang));
                            const hasCustomFilters = get(analytic, "customFilters", false) === 1;
                            if (!title) {
                                title = get(Analytic, `displayName`);
                            }
                            const showPercentage = get(chartProperties, "showPercentage", false);

                            return (
                                <div className={`col-${width} mb-10 lg:mb-0`} key={Analytic.id}>
                                    <Chart
                                        type={Analytic.type.toString()}
                                        id={Analytic.id}
                                        chartProperties={chartProperties}
                                        invocationName={Analytic.invocationName}
                                        title={title}
                                        bots={bots}
                                        companies={companies}
                                        description={Analytic.description}
                                        schemaPayload={Analytic.schemaPayload}
                                        companyId={companyId}
                                        translationsTitles={translationsTitles}
                                        hasCustomFilters={hasCustomFilters}
                                        showPercentage={showPercentage}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
        // </SectionWrapper>
    );
};

export default Metrics;
