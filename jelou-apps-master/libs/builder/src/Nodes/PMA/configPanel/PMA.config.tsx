import type { PMANode } from "@builder/modules/Nodes/domain/nodes";

import { useSelector } from "react-redux";
import { Node, useReactFlow } from "reactflow";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import {
    ASSIGNMENT_BY_DIRECT_OPTIONS,
    ASSIGNMENT_BY_NAMES,
    ASSIGNMENT_BY_QUEUE_OPTIONS,
    ASSIGNMENT_TYPE_NAMES,
    ASSIGNMENT_TYPE_OPTIONS,
    INPUTS_NAME_PMA_CONFIG,
    TYPES_INPUT_SELECTOR,
} from "../constants.pma";
import { usePMAConfig } from "./pma-config.hook";
import { useQueryOperatorsPMANode, useQueryTeamsPMANode } from "./queryPMA";

type PMAConfigNodeProps = {
    nodeId: string;
};

type CompanySelector = {
    company: {
        id: number;
    };
};

export const PMAConfigNode = ({ nodeId }: PMAConfigNodeProps) => {
    const dataNode = useReactFlow().getNode(nodeId) as Node<PMANode>;
    const { operatorId, teamId } = dataNode.data.configuration;

    const companyId = useSelector<CompanySelector, CompanySelector["company"]["id"]>((state) => state.company.id);

    const { assignmentBySelected, assignmentTypeSelected, handleAssignmentByChange, handleAssignmentTypeChange, handleComplementInput } = usePMAConfig({ nodeId });

    let ASSIGNMENT_BY_OPTIONS: ListBoxElement<ASSIGNMENT_BY_NAMES>[] = [];
    if (assignmentTypeSelected?.value === ASSIGNMENT_TYPE_NAMES.DIRECT) ASSIGNMENT_BY_OPTIONS = ASSIGNMENT_BY_DIRECT_OPTIONS;
    if (assignmentTypeSelected?.value === ASSIGNMENT_TYPE_NAMES.QUEUE) ASSIGNMENT_BY_OPTIONS = ASSIGNMENT_BY_QUEUE_OPTIONS;

    const hiddenTeamInput = assignmentBySelected === undefined || assignmentBySelected.value !== ASSIGNMENT_BY_NAMES.TEAM;
    const hiddenOperatorInput = assignmentBySelected === undefined || assignmentBySelected.value !== ASSIGNMENT_BY_NAMES.OPERATORS;

    const { data: teams = [] } = useQueryTeamsPMANode({ companyId });
    const teamsOptions: ListBoxElement[] = teams.map(({ id, name }) => ({
        name,
        id,
        value: String(id),
        description: `Identificador: ${id}`,
    }));

    const { data: operators = [] } = useQueryOperatorsPMANode({ companyId });
    const operatorsOptions: ListBoxElement[] = operators.map(({ id, names, email }) => ({
        name: names,
        id,
        value: String(id),
        description: email,
    }));

    const INPUTS_PMA_CONFIG_LIST = [
        {
            name: INPUTS_NAME_PMA_CONFIG.ASSIGNMENT_TYPE,
            label: "Tipo de asignación:",
            typeInput: TYPES_INPUT_SELECTOR,
            options: ASSIGNMENT_TYPE_OPTIONS,
            onChange: handleAssignmentTypeChange(INPUTS_NAME_PMA_CONFIG.ASSIGNMENT_TYPE),
            placeholder: "Seleccione un tipo de asignación",
            hidden: false,
            value: assignmentTypeSelected,
        },
        {
            name: INPUTS_NAME_PMA_CONFIG.ASSIGNMENT_BY,
            label: "Asignar por:",
            typeInput: TYPES_INPUT_SELECTOR,
            options: ASSIGNMENT_BY_OPTIONS,
            onChange: handleAssignmentByChange(INPUTS_NAME_PMA_CONFIG.ASSIGNMENT_BY),
            placeholder: "Seleccione una opción",
            hidden: assignmentTypeSelected === null,
            value: assignmentBySelected,
        },
        {
            name: INPUTS_NAME_PMA_CONFIG.TEAM_ID,
            label: "Equipo:",
            typeInput: TYPES_INPUT_SELECTOR,
            options: teamsOptions,
            onChange: handleComplementInput(INPUTS_NAME_PMA_CONFIG.TEAM_ID),
            placeholder: "Seleccione un equipo",
            hidden: hiddenTeamInput,
            value: teamsOptions.find(({ id }) => id === teamId),
        },
        {
            name: INPUTS_NAME_PMA_CONFIG.OPERATOR_ID,
            label: "Operador:",
            typeInput: TYPES_INPUT_SELECTOR,
            options: operatorsOptions,
            onChange: handleComplementInput(INPUTS_NAME_PMA_CONFIG.OPERATOR_ID),
            placeholder: "Seleccione un operador",
            hidden: hiddenOperatorInput,
            value: operatorsOptions.find(({ id }) => id === operatorId),
        },
    ];

    return (
        <main className="border-t-1 border-gray-230 p-6">
            <form className="space-y-4 text-gray-400">
                {INPUTS_PMA_CONFIG_LIST.map((input) => {
                    const { hidden, label, name, onChange, options, placeholder, value } = input;

                    if (hidden) return null;

                    // const error = hasError[name];
                    // const isSearchable = name === INPUTS_NAME_PMA_CONFIG.TEAM_ID || name === INPUTS_NAME_PMA_CONFIG.OPERATOR_ID;
                    // const valueDefautlValue = typeof value === "object" ? { value } : { defaultValue: String(value) };

                    return (
                        <div key={name} className="space-y-2">
                            <ListBoxHeadless setValue={onChange} label={label} name={name} slideover placeholder={placeholder} list={options} value={value} />
                        </div>
                    );
                })}
            </form>
        </main>
    );
};
