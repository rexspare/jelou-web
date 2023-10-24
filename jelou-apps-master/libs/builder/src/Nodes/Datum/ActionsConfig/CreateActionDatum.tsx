import type { IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";

import { SpinnerIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TextInput } from "@builder/common/inputs";
import { useDatumNode } from "@builder/modules/Nodes/Datum/infrastructure/datumNode.hook";

type Props = {
    nodeId: string;
    databaseId?: number;
    row?: IDatum["configuration"]["row"];
    variable?: string;
};

export function CreateActionDatum({ databaseId, row, nodeId, variable }: Props) {
    const { isLoading, dbColums, handleChangeInput, handleUpdateVariable } = useDatumNode({ nodeId, databaseId, row });

    return (
        <div className="h-[calc(100vh-20rem)] overflow-y-scroll py-5">
            <h4 className="mb-3 text-xs font-light leading-4 px-5">Columnas de la base de datos</h4>
            <Switch>
                <Switch.Case condition={isLoading}>
                    <div className="flex h-20 items-center justify-center text-primary-200 px-5">
                        <SpinnerIcon />
                    </div>
                </Switch.Case>
                <Switch.Case condition={dbColums.length > 0}>
                <>
                    <ul className="space-y-3 my-5">
                        {dbColums.map((colum) => {
                            const { description, id, key, name } = colum;
                            const defaultValue = row?.data[key];
                            const placeholder = description || `Ingresa el valor de ${name}`;

                            return (
                                <li key={id} className='px-5'>
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
                    <div className="border-b-1 border-gray-230 my-5"></div>
                    <div className="px-5">
                            <TextInput
                                onChange={handleUpdateVariable}
                                name="variable"
                                labelClassName="mb-1 text-xs font-semibold block"
                                label="Ingresa el nombre con el que guardarás este nuevo registro"
                                defaultValue={variable}
                                placeholder="Ingresa {{}} para agregar variables"
                            />
                        </div></>
                </Switch.Case>
            </Switch>

        </div>
    );
}
