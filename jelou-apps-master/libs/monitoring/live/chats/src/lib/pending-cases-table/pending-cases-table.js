import "dayjs/locale/en";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import relativeTime from "dayjs/plugin/relativeTime";

import get from "lodash/get";
import isNull from "lodash/isNull";
import toUpper from "lodash/toUpper";

import { ArrowIcon } from "@apps/shared/icons";
import { ReasonIcon } from "@apps/shared/icons";
import { ComboboxSelect } from "@apps/shared/common";
import { NOT_ASSIGN_REASON } from "@apps/shared/constants";
import { Table, TransferModal } from "@apps/monitoring/ui-shared";

dayjs.extend(relativeTime);

export function PendingCasesTable(props) {
    const {
        data,
        loading,
        actualPage,
        setActualPage,
        maxPage,
        row,
        setRows,
        totalResults,
        selectedReason,
        setSelectedReason,
        setRecoverCases,
        teamOptions,
    } = props;
    const [conversation, setConversation] = useState([]);
    const [assign, setAssign] = useState(false);
    const { t } = useTranslation();
    const noDataMessage = t("monitoring.No existen casos por recuperar");

    const REASONS = [
        {
            id: "OPERATORS_NOT_IN_SCHEDULER",
            name: t("monitoring.Operador fuera de horario"),
        },
        {
            id: "OPERATOR_NOT_FOUND",
            name: t("monitoring.Operador no encontrado"),
        },
        {
            id: "AUTOMATIC_ASSIGNATION_CLOSE",
            name: t("monitoring.Cierre automático"),
        },
        {
            id: "NOT_REPLIED_BY_OPERATOR",
            name: t("monitoring.No gestionado"),
        },
    ];

    const asignCase = (data) => {
        setConversation(data);
        setAssign(true);
    };

    const Badge = (status) => {
        const badgeStyle = "inline-flex items-center px-3 py-px rounded-md text-xs font-medium uppercase";
        switch (toUpper(status)) {
            case NOT_ASSIGN_REASON.OPERATORS_NOT_IN_SCHEDULER:
                return <span className={`${badgeStyle} bg-gray-20 text-gray-375`}>{t("monitoring.Operador fuera de horario")}</span>;
            case NOT_ASSIGN_REASON.OPERATOR_NOT_FOUND:
                return <span className={`${badgeStyle} bg-orange-200 text-orange-800`}>{t("monitoring.Operador no encontrado")}</span>;
            case NOT_ASSIGN_REASON.AUTOMATIC_ASSIGNATION_CLOSE:
                return <span className={`${badgeStyle} bg-orange-200 text-orange-800`}>{t("monitoring.Cierre automático")}</span>;
            case NOT_ASSIGN_REASON.NOT_REPLIED_BY_OPERATOR:
                return <span className={`${badgeStyle} bg-orange-200 text-orange-800`}>{t("monitoring.No gestionado")}</span>;
            case NOT_ASSIGN_REASON.MANAGING:
                return <span className={`${badgeStyle} bg-blue-300 text-blue-800`}>{t("monitoring.En gestion")}</span>;
            default:
                return <span className={`${badgeStyle} bg-black-200 text-black-800`}> - </span>;
        }
    };
    const language = localStorage.getItem("lang");
    const columns = useMemo(
        () => [
            {
                id: "expander",
                Cell: ({ row }) =>
                    row.canExpand ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${row.depth * 2}rem`,
                                },
                            })}>
                            {row.isExpanded ? (
                                <ArrowIcon className="-rotate-90 transform fill-current text-gray-400" width="20" height="20" />
                            ) : (
                                <ArrowIcon className="rotate-180 transform fill-current text-gray-400" width="20" height="20" />
                            )}
                        </span>
                    ) : null,
            },
            {
                Header: t("monitoring.Nombre"),
                accessor: (row) => get(row, "client.names", "--"),
                Cell: ({ row: { original } }) => {
                    const hasSubRows = original.subRows;
                    const isParent = original.isParent;
                    const showSpace = !isParent && !hasSubRows;
                    return showSpace ? (
                        <div className="w-34 ml-4 flex">
                            <p className="truncate">{original.client.names}</p>
                        </div>
                    ) : (
                        <div className="w-34 flex truncate">
                            <p className="truncate">{original.client.names}</p>
                        </div>
                    );
                },
            },
            {
                Header: t("monitoring.Id"),
                accessor: (row) => row.client.id,
                Cell: ({ row: { original } }) => {
                    const id = get(original.client, "id", "-");
                    return <div>{id.replace("+", "").replace("593", "0").replace("@c.us", "")}</div>;
                },
            },
            {
                Header: t("monitoring.Flujo"),
                accessor: "flow.name",
                Cell: ({ row: { original } }) => <div className="flex max-w-64 truncate xxl:max-w-72">{get(original, "flow.name", "--")}</div>,
            },
            {
                Header: t("monitoring.status"),
                accessor: "status",
                Cell: ({ row: { original } }) => <div>{Badge(original.status)}</div>,
            },
            {
                Header: t("monitoring.Razón"),
                accessor: "reason",
                Cell: ({ row: { original } }) => <div>{Badge(original.reason)}</div>,
            },
            {
                Header: t("monitoring.Equipo"),
                accessor: "Equipo",
                Cell: ({ row: { original } }) => <div>{get(original, "assignationMethod.teamName", get(original, "team.name", "--"))}</div>,
            },
            {
                Header: t("monitoring.Fecha de creación"),
                accessor: (row) => (isNull(row.createdAt) ? "--" : dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")),
            },
            {
                Header: t("monitoring.Acciones"),
                Cell: ({ row: { original } }) => {
                    const hasSubRows = original.subRows;
                    const isParent = original.isParent;
                    const showButton = isParent || hasSubRows;
                    const disabled = dayjs().diff(dayjs(original.createdAt), "hour") > 23 || original.status === NOT_ASSIGN_REASON.MANAGING;
                    return showButton ? (
                        <div className="flex h-10 items-center justify-center md:h-12 xxl:h-14">
                            <button
                                disabled={disabled}
                                className="h-fit rounded-lg bg-primary-200 px-2 py-1 text-xs text-white focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:bg-opacity-30"
                                onClick={() => asignCase(original)}>
                                {t("monitoring.Asignar")}
                            </button>
                        </div>
                    ) : null;
                },
                sticky: "left",
            },
        ],
        [language]
    );

    const filterByReason = (reason) => {
        setSelectedReason(reason);
    };

    const cleanReason = () => {
        setSelectedReason("");
    };

    return (
        <div>
            <div className="relative flex w-60 py-2 pl-5">
                <ComboboxSelect
                    options={REASONS}
                    value={selectedReason}
                    label={t("monitoring.Razon")}
                    handleChange={filterByReason}
                    icon={<ReasonIcon width="1.3125rem" fillOpacity="0.75" height="1rem" />}
                    name={"razon"}
                    clearFilter={cleanReason}
                />
            </div>
            <Table
                row={row}
                data={data}
                columns={columns}
                loading={loading}
                maxPage={maxPage}
                setRows={setRows}
                loadingColumns={8}
                actualPage={actualPage}
                totalResults={totalResults}
                setActualPage={setActualPage}
                noDataMessage={noDataMessage}
            />
            {assign && (
                <TransferModal
                    setForward={setAssign}
                    recoverCases={data}
                    setRecoverCases={setRecoverCases}
                    conversation={conversation}
                    actualCases={false}
                    textObj={{
                        success: t("Conversación asignada correctamente"),
                        button: t("Asignar"),
                        title: t("Asignar conversación"),
                    }}
                    view={"RECOVER_CASES"}
                    teamOptions={teamOptions}
                />
            )}
        </div>
    );
}
export default PendingCasesTable;
