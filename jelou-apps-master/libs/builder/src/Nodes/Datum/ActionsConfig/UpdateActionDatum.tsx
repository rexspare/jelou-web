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

export function UpdateActionDatum({ databaseId, row, nodeId }: Props) {
    const { dbColums, isLoading, handleUpdateRowId, handleChangeInput } = useDatumNode({ nodeId, databaseId, row });

    return (
        <div className="h-[calc(100vh-20rem)] overflow-y-scroll">
            <Switch>
                <Switch.Case condition={isLoading}>
                    <div className="flex h-20 items-center justify-center text-primary-200">
                        <SpinnerIcon />
                    </div>
                </Switch.Case>
                <Switch.Case condition={dbColums.length > 0}>
                    <>
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

                        <div className="p-5">
                            <h4 className="mb-3 text-xs font-light leading-4 ">Columnas de la base de datos</h4>
                            <ul className="space-y-3">
                                {dbColums.map((colum) => {
                                    const { description, id, key, name } = colum;
                                    const defaultValue = row?.data[key];
                                    const placeholder = description || `Ingresa el valor de ${name}`;

                                    return (
                                        <li key={id}>
                                            <TextInput
                                                onChange={handleChangeInput(key)}
                                                name={key}
                                                labelClassName="mb-1 text-xs font-semibold block"
                                                label={name}
                                                defaultValue={defaultValue}
                                                placeholder={placeholder}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </>
                </Switch.Case>
            </Switch>
        </div>
    );
}
