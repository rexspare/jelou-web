import { type NodeProps } from "reactflow";

import { DatumNodeIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
// import { useQueryDatumOneDatabase } from "@builder/modules/Nodes/Datum/infrastructure/queryDatum";

import { ACTIONS_DATUM, type IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";
// import { ACTIONS_ICONS, ACTIONS_LABELS } from "@builder/modules/Nodes/Datum/domain/datum.node.constants";

import { WrapperNode } from "../Wrapper";
import { PathsDatumNode, SelectionDBNode, ShowQueryDatumNode, ShowRowsActionNode } from "./ActionsNode";

export function DatumNode({ id, data, selected }: NodeProps<IDatum>) {
    const { title, action, databaseId, row, query, variable } = data.configuration ?? {};

    return (
        <WrapperNode title={title} nodeId={id} selected={selected} Icon={() => <DatumNodeIcon height={22} width={24} color="#00B3C7" />} isActiveButtonsBlock>
            <Switch>
                <Switch.Case condition={Boolean(action) && Boolean(databaseId)}>
                    <>
                        <SelectionDBNode action={action} databaseId={databaseId} />
                        <Switch>
                            <Switch.Case condition={action === ACTIONS_DATUM.CREATE}>
                                <ShowRowsActionNode nodeId={id} databaseId={databaseId} row={row} />
                            </Switch.Case>
                            <Switch.Case condition={action === ACTIONS_DATUM.UPDATE}>
                                <ShowRowsActionNode nodeId={id} databaseId={databaseId} row={row} />
                            </Switch.Case>
                            <Switch.Case condition={action === ACTIONS_DATUM.SEARCH}>
                                <ShowQueryDatumNode nodeId={id} databaseId={databaseId} row={row} query={query} variable={variable} />
                            </Switch.Case>
                        </Switch>
                        <PathsDatumNode nodeId={id} action={action} />
                    </>
                </Switch.Case>
                <Switch.Default>
                    <div className="grid h-40 w-full place-content-center rounded-4 bg-gray-34 text-white">
                        <DatumNodeIcon width={48} height={48} />
                    </div>
                </Switch.Default>
            </Switch>
        </WrapperNode>
    );
}
