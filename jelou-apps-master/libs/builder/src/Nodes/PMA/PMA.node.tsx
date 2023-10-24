import type { PMANode } from "@builder/modules/Nodes/domain/nodes";
import type { NodeProps } from "reactflow";

import { useSelector } from "react-redux";
import { Handle, Position } from "reactflow";

import { CustomerConnect } from "@builder/Icons";
import { PREFIX_SOURCE_SUCCESS, PREFIX_TARGET_IF_ERROR_NODE } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";

import { WrapperNode } from "..";
import { useQueryOperatorsPMANode, useQueryTeamsPMANode } from "./configPanel/queryPMA";
import { ASSIGNMENT_BY_NAMES, LABELS_VALUES } from "./constants.pma";

type CompanySelector = {
    company: {
        id: number;
    };
};

export const NodePMA = ({ id: nodeId, selected, data }: NodeProps<PMANode>) => {
    const { title, teamId, operatorId, assignment } = data?.configuration ?? {};
    const { by, type } = assignment ?? {};

    const onConnect = useOnConnect();
    const companyId = useSelector<CompanySelector, CompanySelector["company"]["id"]>((state) => state.company.id);

    const { data: teams = [] } = useQueryTeamsPMANode({ companyId });
    const { data: operators = [] } = useQueryOperatorsPMANode({ companyId });

    const teamName = teams.find((team) => team.id === teamId)?.name ?? teamId;
    const operatorName = operators.find((operator) => operator.id === operatorId)?.names ?? operatorId;

    const PMA_DATA = [
        {
            label: "Tipo de asignación",
            value: LABELS_VALUES[type],
            show: true,
        },
        {
            label: "Asignar por",
            value: LABELS_VALUES[by],
            show: true,
        },
        {
            label: "Asignar a equipo",
            value: teamName,
            show: Boolean(teamId) && by === ASSIGNMENT_BY_NAMES.TEAM,
        },
        {
            label: "Asignar a operador",
            value: operatorName,
            show: Boolean(operatorId) && by === ASSIGNMENT_BY_NAMES.OPERATORS,
        },
    ];

    return (
        <WrapperNode Icon={() => <CustomerConnect />} title={title} nodeId={nodeId} selected={selected} showDefaultHandle={false} isActiveButtonsBlock={false}>
            <section className="space-y-5 text-gray-400">
                {PMA_DATA.map((item) => {
                    const { label, show, value } = item;

                    if (show === false) return null;

                    return (
                        <aside key={value + label} className="space-y-2">
                            <h3 className="text-13 font-semibold">{label}</h3>
                            {value ? (
                                <p className="min-h-[2rem] rounded-10 bg-white px-2 py-2">{value}</p>
                            ) : (
                                <p className="min-h-[2rem] rounded-10 bg-white px-2 py-2 text-13 font-semibold text-gray-330">Selecciona una opción</p>
                            )}
                        </aside>
                    );
                })}

                <Handle
                    id={`${PREFIX_SOURCE_SUCCESS}${nodeId}`}
                    style={{ stroke: "#59AD00" }}
                    onConnect={onConnect({ type: EDGES_TYPES.SUCCESS })}
                    type="source"
                    position={Position.Right}
                    className="targetsHandlesSucces !-right-[0.5rem] !top-[4rem]"
                />

                <Handle
                    id={`${PREFIX_TARGET_IF_ERROR_NODE}${nodeId}`}
                    style={{ stroke: "#EC5F4F" }}
                    type="source"
                    position={Position.Right}
                    className="targetsHandlesError !-right-[0.5rem]"
                    isValidConnection={(connection) => {
                        if (connection.sourceHandle === null) return false;
                        return connection.sourceHandle.startsWith(PREFIX_TARGET_IF_ERROR_NODE);
                    }}
                    onConnect={onConnect({ type: EDGES_TYPES.ERROR })}
                />
            </section>
        </WrapperNode>
    );
};
