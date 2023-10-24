import type { IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";

import { useCallback, useMemo } from "react";
import { useReactFlow, type Node } from "reactflow";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { InputErrorMessage } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { useQueryDatumDatabases } from "@builder/modules/Nodes/Datum/infrastructure/queryDatum";

type Props = { databaseId?: number; nodeId: string };

export function DatabaseSelection({ databaseId, nodeId }: Props) {
    const { data: databases, isLoading, isError } = useQueryDatumDatabases();

    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<IDatum>;
    const { updateLocalNode } = useCustomsNodes();

    const databasesOptions: ListBoxElement[] = useMemo(
        () =>
            databases.map(({ id, name, description }) => ({
                id,
                name,
                value: String(id),
                description,
            })),
        [databases]
    );

    const handleSelectDatabase = useCallback(
        (databaseSelected: ListBoxElement) => {
            const configuration: IDatum["configuration"] = {
                ...node.data.configuration,
                databaseId: Number(databaseSelected.id),
                row: {
                    id: undefined,
                    data: {},
                },
                query:[],
                variable:''
            };
            updateLocalNode(nodeId, { configuration });
        },
        [node.data.configuration, nodeId, updateLocalNode]
    );

    const databaseSelected = useMemo(() => databasesOptions.find(({ id }) => id === databaseId), [databaseId, databasesOptions]);

    return (
        <div className="border-b-1 border-gray-230 p-5 leading-5">
            <h4 className="mb-4 text-sm font-light">Seleciona una base de datos para continuar</h4>

            <ListBoxHeadless
                defaultValue={databaseSelected}
                setValue={handleSelectDatabase}
                isLoading={isLoading}
                list={databasesOptions}
                label=""
                placeholder="Selecciona una base de datos"
                slideover
            />

            {isError && <InputErrorMessage hasError="No pudimos recuperar tus bases de datos" />}
        </div>
    );
}
