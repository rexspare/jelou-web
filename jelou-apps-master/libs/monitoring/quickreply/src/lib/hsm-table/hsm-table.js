import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import orderBy from "lodash/orderBy";

import "dayjs/locale/es";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DebounceInput } from "react-debounce-input";

import { ComboboxSelect } from "@apps/shared/common";
import { PencilIcon, TrashIcon } from "@apps/shared/icons";
import { Table } from "@apps/monitoring/ui-shared";
import { NobotsMonitoringModal } from "../..";
import { useOnClickOutside } from "@apps/shared/hooks";
// import NobotsMonitoringModal from "libs/monitoring/quickreply/components/NobotsMonitoringModal";

const HsmTable = (props) => {
    const {
        setBot,
        row,
        bot,
        data,
        setRows,
        maxPage,
        loading,
        setQuery,
        pageLimit,
        changeBot,
        botOptions,
        teamOptions,
        setPageLimit,
        selectedTeam,
        totalResults,
        filterByTeam,
        deleteTemplate,
        setTeamSelected,
        openEditTemplateModal,
        openCreateTemplateModal,
    } = props;

    const userSession = useSelector((state) => state.userSession);
    const lang = get(userSession, "lang", "es");
    const { t } = useTranslation();
    const botsMonitoring = useSelector((state) => state.botsMonitoring);
    const [showNoBotsModal, setShowNoBotsModal] = useState(false);

    const disableCreateQuickreply = isEmpty(botsMonitoring);

    const modalRef = useRef();
    useOnClickOutside(modalRef, () => {
        return setShowNoBotsModal(false);
    });

    const columns = useMemo(
        () => [
            {
                Header: t("monitoring.Nombre"),
                accessor: (row) => <div className="max-w-80">{get(row, "displayName", "--")}</div>,
            },
            {
                Header: t("Bot"),
                accessor: (row) => {
                    const botsFromRow = get(row, "botsNames", []);
                    const isGlobal = get(row, "isGlobal", false);
                    const botsParsed = botsFromRow.toString().split(",").join(", ");
                    return (
                        <Tippy
                            content={isGlobal ? t("monitoring.Todos") : !isEmpty(botsFromRow) ? botsParsed : "-"}
                            theme={"tomato"}
                            arrow={false}
                            placement={"top"}
                            touch={false}>
                            <div className="max-w-[20rem] truncate">
                                {isGlobal ? t("monitoring.Todos") : !isEmpty(botsFromRow) ? botsParsed : "-"}
                            </div>
                        </Tippy>
                    );
                },
            },
            {
                Header: t("monitoring.Equipo"),
                accessor: (row) => {
                    const teamsFromRow = get(row, "teamsNames", []);
                    const isGlobal = get(row, "isGlobal", false);
                    const teamsParsed = teamsFromRow.toString().split(",").join(", ");
                    return (
                        <Tippy
                            content={isGlobal ? t("monitoring.Todos") : !isEmpty(teamsFromRow) ? teamsParsed : "-"}
                            theme={"tomato"}
                            arrow={false}
                            placement={"top"}
                            touch={false}>
                            <div className="truncate">{isGlobal ? t("monitoring.Todos") : !isEmpty(teamsFromRow) ? teamsParsed : "-"}</div>
                        </Tippy>
                    );
                },
            },
            {
                Header: t("monitoring.Fecha de creación"),
                accessor: (row) => (isNull(row.createdAt) ? "--" : dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")),
            },
            {
                Header: t("monitoring.Acciones"),
                Cell: ({ row: { original } }) => (
                    <div className="flex items-center space-x-2">
                        <Tippy content={t("hsm.editTemplate")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                            <button className="w-8" onClick={() => openEditTemplateModal(original)}>
                                <PencilIcon
                                    className="fill-current text-gray-375 hover:text-primary-200"
                                    width="1.1875rem"
                                    height="1.125rem"
                                    fillOpacity={0.75}
                                />
                            </button>
                        </Tippy>
                        <Tippy content={t("hsm.deleteTemplate")} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                            <button className="w-8" onClick={() => deleteTemplate(original)}>
                                <TrashIcon className="fill-current text-gray-375 hover:text-primary-200" width="1rem" height="1.125rem" />
                            </button>
                        </Tippy>
                    </div>
                ),
            },
        ],
        [lang]
    );

    const handleInput = (evt) => {
        const { target } = evt;
        const { value } = target;
        setQuery(value);
    };

    return (
        <div>
            <div className="mt-8 flex h-16 items-center justify-between rounded-t-xl bg-white px-4">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-row items-center space-x-2 sm:w-78">
                        <DebounceInput
                            className="input"
                            minLength={3}
                            debounceTimeout={500}
                            name="team"
                            onChange={handleInput}
                            placeholder={t("monitoring.Buscar mensaje rápido")}
                            autoFocus
                        />
                    </div>
                    {botOptions.length > 1 && (
                        <div className="w-full sm:w-64">
                            <ComboboxSelect
                                options={orderBy(props.botOptions, ["name"], ["asc"])}
                                value={bot}
                                label={t("Bots")}
                                handleChange={changeBot}
                                name={"bots"}
                                clearFilter={() => setBot([])}
                            />
                        </div>
                    )}
                    {teamOptions.length > 1 && (
                        <div className="w-full sm:w-64">
                            <ComboboxSelect
                                options={teamOptions}
                                value={selectedTeam}
                                label={t("monitoring.Equipos")}
                                handleChange={filterByTeam}
                                name={"team"}
                                clearFilter={() => setTeamSelected([])}
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        className="button-primary w-52"
                        onClick={disableCreateQuickreply ? () => setShowNoBotsModal(true) : openCreateTemplateModal}>
                        {t("monitoring.Crear mensaje rápido")}
                    </button>
                </div>
            </div>
            <Table
                row={row}
                data={data}
                columns={columns}
                loading={loading}
                maxPage={maxPage}
                setRows={setRows}
                loadingColumns={5}
                actualPage={pageLimit}
                totalResults={totalResults}
                setActualPage={setPageLimit}
                noDataMessage={t("monitoring.No existen mensajes rápidos en el bot seleccionado")}
            />
            {showNoBotsModal && <NobotsMonitoringModal setOpen={setShowNoBotsModal} modalRef={modalRef} />}
        </div>
    );
};

export default HsmTable;
