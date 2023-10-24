/*Table*/
import Tippy from "@tippyjs/react";
import axios from "axios";
import es from "date-fns/locale/es";
import dayjs from "dayjs";
import enDayjs from "dayjs/locale/en";
import "dayjs/locale/es";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { registerLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { renderMessage } from "@apps/shared/common";
import { DataPic, ExitIcon } from "@apps/shared/icons";
import { MetricServer } from "@apps/shared/modules";

import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useNavigate } from "react-router-dom";
import TableComponent from "./Components/Table";
import TableContainer from "./Components/TableContainer";

registerLocale("es", es);

dayjs.locale({
    ...enDayjs,
    weekStart: 1,
});

const Table = (props) => {
    const { report } = props;
    const [data, setData] = useState([]);
    const [dataCards, setDataCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginationData, setPaginationData] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [requestParams, setRequestParams] = useState({});
    const [downloading, setDownloading] = useState(false);
    const cancelToken = axios.CancelToken.source();
    const [delim, setDelim] = useState(",");

    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const { t } = useTranslation();
    const [defaultPeriodDate, setDefaultPeriodDate] = useState({
        startAt: dayjs().startOf("year"),
        endAt: dayjs().endOf("year"),
        key: 7,
        label: t("dataReport.thisYear"),
    });

    let uri = get(report, "Report.url", "");
    uri = uri.replace("https://metrics.jelou.ai", "");

    const getLinks = (urlsArray, value) => {
        return !isEmpty(urlsArray)
            ? urlsArray.map((url) => {
                  return (
                      <li className="list-none pb-1" key={url}>
                          <a href={url} rel="noreferrer" target="_blank" className="flex items-center gap-2 text-primary-200 hover:underline">
                              {value.label}
                              <ExitIcon width={10} height={10} />
                          </a>
                      </li>
                  );
              })
            : "-";
    };

    const RenderCell = useCallback((props) => {
        const tooltip = get(props, "value.tooltip", null);

        if (typeof props.value === "string" || typeof props.value === "number" || typeof props.value === "boolean") {
            return props.value;
        }

        const { value } = props;

        if (!value) {
            return "-";
        }

        const { type } = value;
        const urlsArray = value.mediaUrl ? value.mediaUrl.split(",") : null;

        switch (toUpper(type)) {
            case "BADGE":
                // eslint-disable-next-line no-case-declarations
                const { backgroundColor = "", color = "" } = value || {};
                return (
                    <Tippy content={tooltip} disabled={!tooltip} placement={"top"}>
                        <span
                            className="inline-flex w-full justify-center rounded-3xl px-3 py-2 text-center text-xs font-bold leading-4"
                            style={{ backgroundColor, color }}>
                            {value.text}
                        </span>
                    </Tippy>
                );
            case "DOT":
                return <div style={{ backgroundColor: value.backgroundColor }} className="h-3 w-3 rounded-full" />;
            case "URL":
                return getLinks(urlsArray, value);
            case "TEXT":
                return value.text;
            default:
                return "-";
        }
    }, []);

    const getColumns = useCallback(() => {
        const headers = get(report, "properties.headers2", []);

        return headers.map((header) => {
            return {
                Header: get(header, "Header", header?.Header),
                accessor: get(header, "accessor", header?.accessor),
                Cell: (props) => {
                    return <RenderCell {...props}></RenderCell>;
                },
            };
        });
    }, [report, RenderCell]);

    const navigate = useNavigate();

    useEffect(() => {
        if (isEmpty(report)) navigate("/datum/reports");
    }, [report]);

    useEffect(() => {
        if (!isEmpty(uri)) getReport();
        return () => cancelToken.cancel("Cancelling");
    }, [uri, requestParams, page, limit]);

    const getReport = async () => {
        const headers = get(report, "properties.headers2", []);
        const { companyId } = userSession;
        try {
            setLoading(true);

            const formatHeaders = {};
            for (const header of headers) {
                formatHeaders[header.accessor] = header.Header;
            }

            if (requestParams?.estado === "") delete requestParams.estado;
            if (requestParams?.date) {
                const [startAt, endAt] = requestParams.date.scopes[0].parameters;
                delete requestParams.date;
                requestParams.startAt = dayjs(startAt);
                requestParams.endAt = dayjs(endAt);
            }

            const { data } = await MetricServer.post(
                uri,
                {
                    companyId,
                    headers: formatHeaders,
                    startAt: defaultPeriodDate.startAt,
                    endAt: defaultPeriodDate.endAt,
                    ...requestParams,
                },
                {
                    cancelToken: cancelToken.token,
                    params: {
                        limit,
                        page,
                    },
                }
            );
            setDataCards(data?.cards ?? []);
            setData(data.rows);
            setPaginationData({ total: data.count, limit: data.limit, page: data.page, totalPages: data.totalPages });
            setLoading(false);
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoading(true);
            } else {
                const status = get(error, "response.status", 500);
                if (status === 422) {
                    setLoading(true);
                    return;
                }
                setLoading(false);
            }
        }
    };

    const downloadReport = async () => {
        const headers = get(report, "properties.headers2", []);
        const { companyId, id: userId } = userSession;
        setDownloading(true);
        try {
            const reportId = get(report, "Report.id");

            const formatHeaders = {};
            for (const header of headers) {
                formatHeaders[header.accessor] = header.Header;
            }

            if (requestParams?.estado === "") delete requestParams.estado;
            if (requestParams?.date) {
                const [startAt, endAt] = requestParams.date.scopes[0].parameters;
                delete requestParams.date;
                requestParams.startAt = dayjs(startAt);
                requestParams.endAt = dayjs(endAt);
            }

            await MetricServer.post("/v1/reports/reports_on_demand", {
                reportId,
                userId,
                companyId,
                startAt: defaultPeriodDate.startAt,
                endAt: defaultPeriodDate.endAt,
                headers: formatHeaders,
                ...requestParams,
                ...(!isEmpty(delim) ? { delimitator: delim } : {}),
            });
            renderMessage(t("dataReport.downloadReport"), MESSAGE_TYPES.SUCCESS);

            setDownloading(false);
        } catch (error) {
            const message = get(error, `response.data.error.clientMessages.${lang}`, error.message);
            renderMessage(message, MESSAGE_TYPES.ERROR);

            setDownloading(false);
        }
    };

    const columnsData = useMemo(() => getColumns(), []);
    const reportTitle = get(report, "Report.displayNames");
    const title = get(reportTitle, lang);
    const filters = get(report, "Report.payload.filters2", []);
    const customSort = Boolean(get(report, "customSort"));

    const requestParamsResetPage = (callback) => {
        setPage(1);
        setRequestParams(callback);
    };

    return (
        <TableContainer
            title={title}
            dataCards={dataCards}
            handleDelimChange={setDelim}
            setRequestParams={requestParamsResetPage}
            onDownload={downloadReport}
            downloading={downloading}
            filters={filters}
            customSort={customSort}
            // defaultPeriodDate={defaultPeriodDate}
            setDefaultPeriodDate={setDefaultPeriodDate}>
            <div>
                {loading === false && data.length === 0 ? (
                    <section className="grid h-table place-content-center bg-white" style={{ borderRadius: "0 0 0.75rem 0.75rem" }}>
                        <DataPic width="30rem" />
                        <p className="pt-4 text-center text-2xl font-semibold text-gray-500">{t("dataReport.empty")}</p>
                    </section>
                ) : (
                    <>
                        <TableComponent
                            columns={columnsData}
                            currentPage={page}
                            data={data}
                            loading={loading}
                            paginationData={paginationData}
                            setLimit={setLimit}
                            setPage={setPage}
                        />
                        <div className="rp-toast-container">
                            <ToastContainer />
                        </div>
                    </>
                )}
            </div>
        </TableContainer>
    );
};

export default Table;
