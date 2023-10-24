import type { IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";

import { SpinnerIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TextInput } from "@builder/common/inputs";
import { useDatumNode } from "@builder/modules/Nodes/Datum/infrastructure/datumNode.hook";

type Props = {
    nodeId: string;
    databaseId?: number;
    row?: IDatum["configuration"]["row"];
};

const INPUT_ROW_ID = "rowId";

export function DeleteActionDatum({ databaseId, row, nodeId }: Props) {
    const { isLoading, dbColums, handleUpdateRowId } = useDatumNode({ nodeId, databaseId, row });

    return (
        <div className="h-[calc(100vh-20rem)] overflow-y-scroll">
            <Switch>
                <Switch.Case condition={isLoading}>
                    <div className="flex h-20 items-center justify-center text-primary-200">
                        <SpinnerIcon />
                    </div>
                </Switch.Case>
                <Switch.Case condition={dbColums.length > 0}>
                    <div className="border-b-1 border-gray-230 p-5">
                        <TextInput
                            onChange={handleUpdateRowId}
                            name={INPUT_ROW_ID}
                            labelClassName="mb-1 text-xs font-semibold block"
                            label="Ingresa el ID del registro a actualizar"
                            defaultValue={row?.id}
                            placeholder="P. ej. 1192845465"
                        />
                    </div>
                </Switch.Case>
            </Switch>
        </div>
    );
}
