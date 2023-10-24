import get from "lodash/get";
import has from "lodash/has";
import first from "lodash/first";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";

import "dayjs/locale/es";
import dayjs from "dayjs";
import axios from "axios";

import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { withTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { JelouApiV1 } from "@apps/shared/modules";
import { getOperators } from "@apps/redux/store";
import { DownloadIcon } from "@apps/shared/icons";
import { Stats, LogsTable, Filters } from "@apps/monitoring/ui-shared";

const Connections = (props) => {
    const { t } = props;
    const dispatch = useDispatch();
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const operators = useSelector((state) => state.operators);
    const teamScopes = useSelector((state) => state.teamScopes);
    const [operator, setOperator] = useState({});
    const [initialDate, setInitialDate] = useState(new Date(dayjs().day(1).startOf("day")));
    const [finalDate, setFinalDate] = useState(new Date(dayjs().endOf("day")));
    const [pageLimit, setPageLimit] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [row, setRows] = useState(10);
    const [maxPage, setMaxPage] = useState(null);
    const [hoursReport, setHoursReport] = useState(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const cancelToken = axios.CancelToken.source();

    const selectOperator = (operator) => {
        setPageLimit(1);
        setOperator(operator);
    };

    useEffect(() => {
        if (!isEmpty(company) && !isEmpty(userSession)) {
            let data = { Teams: teamScopes };
            dispatch(getOperators(data));
        }
    }, [company, userSession]);

    useEffect(() => {
        if (!isEmpty(operators)) {
            let op = first(orderBy(operators, ["names"], ["asc"]));
            setOperator(op);
        }
    }, [operators, getOperators, company]);

    useEffect(() => {
        if (!isEmpty(operator)) {
            cancelToken.cancel("Cancelling");
            logs();
            if (get(operator, "id") !== -1) {
                report();
            }
        } else {
            setLoading(false);
        }
    }, [operator, row, pageLimit, company, initialDate, finalDate]);

    const logs = async () => {
        try {
            if (!isEmpty(operator)) {
                const { id } = operator;
                setLoading(true);
                const uri = id === -1 ? `company/${company.id}/operators/logs` : `operators/${id}/logs`;
                const { data } = await JelouApiV1.get(
                    `/${uri}`,
                    {
                        params: {
                            page: pageLimit,
                            limit: 20,
                            startAt: initialDate,
                            endAt: finalDate,
                        },
                    },
                    {
                        cancelToken: cancelToken.token,
                    }
                );
                setMaxPage(data.pagination.totalPages);
                setData(data.results);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log("error == ", error);
        }
    };

    const report = async () => {
        try {
            if (!isEmpty(operator)) {
                const { id } = operator;
                setLoading(true);
                const { data } = await JelouApiV1.post(`/operators/${id}/trend`, {
                    startAt: initialDate,
                    endAt: finalDate,
                });
                setLoading(false);
                setHoursReport(get(data, "data", ""));
            }
        } catch (error) {
            setLoading(false);
            console.log("error == ", error);
        }
    };

    const downloadLogs = async (operator) => {
        try {
            const params = {
                download: true,
                startAt: initialDate,
                endAt: finalDate,
            };
            if (!isEmpty(company)) {
                const { id } = operator;
                const uri =
                    id === -1
                        ? JelouApiV1.get(`/company/${company.id}/operators/logs`, { params })
                        : JelouApiV1.post(`/operators/${id}/logs`, params);

                setLoadingButton(true);

                const { data } = await uri;

                if (has(data, "download")) {
                    const link = document.createElement("a");
                    link.href = data.download[0].fileUrl;
                    link.setAttribute("download", "Reporte.xls");
                    document.body.appendChild(link);
                    link.click();
                }
            }
            setLoadingButton(false);
        } catch (error) {
            setLoadingButton(false);
            console.log(error, " error");
        }
    };

    return (
        <div>
            <div className="flex items-center rounded-xl bg-white p-3 px-4">
                <Filters
                    value={operator}
                    setPageLimit={setPageLimit}
                    operators={operators}
                    logs={logs}
                    report={report}
                    onChange={selectOperator}
                    initialDate={initialDate}
                    finalDate={finalDate}
                    setInitialDate={setInitialDate}
                    setFinalDate={setFinalDate}
                    company={company}
                />
                <div className="flex items-center justify-end">
                    <button
                        className="flex h-[1.96rem] w-[1.96rem] items-center justify-center rounded-full bg-primary-200 hover:bg-primary-100 focus:outline-none"
                        onClick={() => downloadLogs(operator)}
                        disabled={loadingButton}>
                        {loadingButton ? (
                            <ClipLoader color={"white"} size="1.1875rem" />
                        ) : (
                            <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                        )}
                    </button>
                </div>
            </div>
            {operator !== "-1" && (
                <div className="my-4 flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Stats title={t("monitoring.Conectado")} number={get(hoursReport, "onlinePercent", "")} loading={loading} />
                    <Stats title={t("monitoring.Ocupado")} number={get(hoursReport, "busyPercent", "")} loading={loading} />
                    <Stats title={t("monitoring.Desconectado")} number={get(hoursReport, "offlinePercent", "")} loading={loading} />
                </div>
            )}

            <div className="h-full w-full items-center rounded-xl bg-white">
                <LogsTable
                    data={data}
                    loading={loading}
                    row={row}
                    pageLimit={pageLimit}
                    maxPage={maxPage}
                    setPageLimit={setPageLimit}
                    setRows={setRows}
                    operator={operator}
                />
            </div>
        </div>
    );
};

export default withTranslation()(Connections);
