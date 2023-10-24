import React, { useState } from "react";
import { ComboboxSelect, Input } from "@apps/shared/common";
import { Circle, CleanIcon, DownloadIcon, SearchIcon, TeamIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";
import { DashboardServer } from "@apps/shared/modules";

import FileDownload from "js-file-download";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import dayjs from "dayjs";

const OperatorsFilters = (props) => {
    const { status, operatorParams, setOperatorParams, team, teamOptions, company, setStatus, setTeam, query, setQuery, setPageLimit } = props;
    const { t } = useTranslation();
    const [isLoadingDownload, setIsLoadingDownload] = useState();
    const statusOptions = [
        {
            id: "online",
            value: "online",
            name: t("monitoring.Conectado"),
        },
        {
            id: "offline",
            value: "offline",
            name: t("monitoring.Desconectado"),
        },
        {
            id: "busy",
            value: "busy",
            name: t("monitoring.No disponible"),
        },
    ];

    const selectStatus = (status) => {
        setOperatorParams({ ...operatorParams, status, page: 1 });
        setPageLimit(1);
        setStatus(status);
    };

    const selectTeam = (team) => {
        setOperatorParams({ ...operatorParams, team, page: 1 });
        setPageLimit(1);
        setTeam(team);
    };

    const cleanStatus = () => {
        let tmp = { ...operatorParams };
        delete tmp.status;
        setOperatorParams({ ...tmp, page: 1 });
        setPageLimit(1);
        setStatus({});
    };

    const cleanTeams = () => {
        let tmp = { ...operatorParams };
        delete tmp.team;
        setOperatorParams({ ...tmp, page: 1 });
        setPageLimit(1);
        setTeam({});
    };

    const clearFilters = () => {
        let tmp = { ...operatorParams };
        delete tmp.team;
        delete tmp.status;
        delete tmp.query;
        setOperatorParams({ ...tmp, page: 1 });
        setPageLimit(1);
        setQuery("");
        setTeam({});
        setStatus({});
    };

    const downloadUsers = async () => {
        setIsLoadingDownload(true);
        try {
            const companyId = get(company, "id", "");
            const teams = get(operatorParams, "team.id", []);
            const query = get(operatorParams, "query", "");
            const active = get(operatorParams, "status.id", "");

            const { data } = await DashboardServer.get(`/companies/${companyId}/users`, {
                responseType: "blob",
                params: {
                    ...(!isEmpty(query) ? { query } : {}),
                    ...(isNumber(teams) ? { teams: [teams] } : {}),
                    ...(!isEmpty(active) ? { active } : {}),
                    download: true,
                    state: true,
                    isOperator: true,
                },
            });
            FileDownload(data, `operators_${dayjs().format()}.xlsx`);
        } catch (err) {
            console.log(err);
        }
        setIsLoadingDownload(false);
    };

    const onChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setOperatorParams({ ...operatorParams, query, page: 1 });
            setPageLimit(1);
        }
    };

    return (
        <div className="my-auto flex w-full flex-col justify-between space-y-2 p-3 lg:flex-row lg:space-y-0 lg:p-5">
            <div className="flex w-full space-x-4">
                <div className="relative flex h-full w-70 rounded-[0.8125rem] border-[0.0938rem] border-transparent">
                    <div className="absolute bottom-0 left-0 top-0 ml-4 flex items-center">
                        <SearchIcon className="fill-current" width="1rem" height="1rem" />
                    </div>
                    <Input
                        id="operatorName"
                        type="text"
                        value={query}
                        name="operatorName"
                        className="w-full rounded-[0.8125rem] border-[0.0938rem] border-gray-100/50 py-1 pl-10 text-sm text-gray-500 focus:border-gray-100 focus:ring-transparent"
                        onKeyPress={(event) => handleKeyDown(event)}
                        placeholder={t("monitoring.Buscar operador")}
                        onChange={onChange}
                        autoFocus
                    />
                </div>
                <div className="min-w-64 lg:w-64">
                    <ComboboxSelect
                        value={status}
                        handleChange={selectStatus}
                        name="status"
                        options={statusOptions}
                        icon={<Circle width="1rem" fillOpacity="0.75" fill="white" />}
                        label={t("monitoring.Estado")}
                        clearFilter={cleanStatus}
                    />
                </div>
                <div className="min-w-64 lg:w-64">
                    <ComboboxSelect
                        value={team}
                        handleChange={selectTeam}
                        name={"team"}
                        options={teamOptions}
                        icon={<TeamIcon width="1.3125rem" height="1rem" fillOpacity="0.75" />}
                        label={t("monitoring.Equipos")}
                        clearFilter={cleanTeams}
                    />
                </div>
            </div>
            <div className="flex w-full items-center justify-end space-x-2">
                <Tippy content={t("AdminFilters.clean")} placement={"bottom"} theme={"jelou"} touch={false}>
                    <button
                        className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-green-960 focus:outline-none"
                        onClick={clearFilters}>
                        <CleanIcon className="fill-current text-white" width="0.844rem" height="1.178rem" />
                    </button>
                </Tippy>
                <Tippy content={t("clients.download")} placement={"bottom"} theme={"jelou"} touch={false}>
                    <button
                        onClick={() => downloadUsers()}
                        className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-primary-200 focus:outline-none">
                        {isLoadingDownload ? (
                            <ClipLoader color={"white"} size="1.1875rem" />
                        ) : (
                            <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                        )}
                    </button>
                </Tippy>
            </div>
        </div>
    );
};

export default OperatorsFilters;
