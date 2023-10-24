import { useReactFlow, type Node } from "reactflow";

import { Switch } from "@builder/common/Headless/conditionalRendering";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";

import { ACTIONS_DATUM, type IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { ACTIONS_LABELS, BUTTONS_ACTIONS_DATUM } from "@builder/modules/Nodes/Datum/domain/datum.node.constants";
import { CreateActionDatum, DatabaseSelection, DeleteActionDatum, SearchActionDatum, UpdateActionDatum } from "./ActionsConfig";

type Props = {
    nodeId: string;
};

export function DatumNodeConfig({ nodeId }: Props) {
    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<IDatum>;
    const { updateLocalNode } = useCustomsNodes();

    const { action, databaseId, variable, row, query } = node.data.configuration ?? {};

    const handleSelectAction = (action: ACTIONS_DATUM) => () => {
        const configuration = {
            ...node.data.configuration,
            action,
        };
        updateLocalNode(nodeId, { configuration });
    };

    return (
        <div className="text-gray-610">
            <Switch>
                <Switch.Case condition={Boolean(action)}>
                    <>
                        <Action action={action} />
                        <DatabaseSelection databaseId={databaseId} nodeId={nodeId} />
                        <Switch>
                            <Switch.Case condition={action === ACTIONS_DATUM.CREATE && Boolean(databaseId)}>
                                <CreateActionDatum row={row} nodeId={nodeId} databaseId={databaseId} variable={variable} />
                            </Switch.Case>
                            <Switch.Case condition={action === ACTIONS_DATUM.UPDATE && Boolean(databaseId)}>
                                <UpdateActionDatum row={row} nodeId={nodeId} databaseId={databaseId} />
                            </Switch.Case>
                            <Switch.Case condition={action === ACTIONS_DATUM.DELETE && Boolean(databaseId)}>
                                <DeleteActionDatum row={row} nodeId={nodeId} databaseId={databaseId} />
                            </Switch.Case>
                            <Switch.Case condition={action === ACTIONS_DATUM.SEARCH && Boolean(databaseId)}>
                                <SearchActionDatum nodeId={nodeId} databaseId={databaseId} query={query} variable={variable} />
                            </Switch.Case>
                        </Switch>
                    </>
                </Switch.Case>
                <Switch.Default>
                    <div className="space-y-4 p-5">
                        <p className="text-15 font-light leading-5 ">Selecciona la acción que deseas realizar sobre una base de datos </p>

                        {BUTTONS_ACTIONS_DATUM.map(({ id, label }) => (
                            <button onClick={handleSelectAction(id)} key={id} className="h-8 w-full rounded-full border-1 border-primary-200 font-semibold text-primary-200">
                                {label}
                            </button>
                        ))}
                    </div>
                </Switch.Default>
            </Switch>
        </div>
    );
}

function Action({ action }: { action: ACTIONS_DATUM | undefined }) {
    return (
        <div className="border-b-1 border-gray-230 p-5">
            <h4 className="mb-3 text-xs font-light leading-4 text-gray-400">Acción a realizar</h4>
            <p className="leading-5">{ACTIONS_LABELS[action as ACTIONS_DATUM]}</p>
        </div>
    );
}
