import type { DatumQuery, IDatum, QueryInputName } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { nanoid } from "nanoid";
import { useCallback, useMemo } from "react";
import { useReactFlow, type Node } from "reactflow";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { useQueryDatumOneDatabase } from "@builder/modules/Nodes/Datum/infrastructure/queryDatum";
import { ConditionalOperator } from "../../Conditional/domain/conditional.domain";

type Props = {
    nodeId: string;
    databaseId?: number;
    row?: IDatum["configuration"]["row"];
};
export function useDatumNode({ databaseId, nodeId, row }: Props) {
    const { data: database, isLoading } = useQueryDatumOneDatabase(databaseId);
    const { updateLocalNode } = useCustomsNodes();

    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<IDatum>;

    const dbColums = useMemo(() => {
        if (!databaseId) return [];
        const columns = database?.columns.map(({ id, key, name, description }) => ({
            id,
            key,
            name,
            description,
            value: key,
        }));

        if (!columns) return [];
        return columns;
    }, [databaseId, database]);

    const handleChangeInput = useCallback(
        (key: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = evt.target;
            const newRow = {
                ...row,
                data: {
                    ...row?.data,
                    [key]: value,
                },
            };

            const configuration = {
                ...node.data.configuration,
                row: newRow,
            };

            updateLocalNode(nodeId, { configuration });
        },
        [row, node, nodeId, updateLocalNode]
    );

    const handleUpdateRowId = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = evt.target;
            const newRow = {
                ...row,
                id: value,
            };

            const configuration = {
                ...node.data.configuration,
                row: newRow,
            };

            updateLocalNode(nodeId, { configuration });
        },
        [row, node, nodeId, updateLocalNode]
    );

    function getNewQuery(): DatumQuery {
        return {
            id: nanoid(),
            field: "",
            value: "",
            operator: ConditionalOperator.IS,
        };
    }

    const handleAddNewQuery = () => {
        const newQuery = getNewQuery();
        const currentQueries = node.data.configuration.query || [];

        const updatedConfiguration = {
            ...node.data.configuration,
            query: [...currentQueries, newQuery],
        };
        updateLocalNode(nodeId, { configuration: updatedConfiguration });
    };

    const handleDeleteQuery = (idQuery: string) => {
        const currentQueries = node.data.configuration.query || [];
        const newQuery = currentQueries.filter((query) => query.id !== idQuery);
        const updatedConfiguration = {
            ...node.data.configuration,
            query: newQuery,
        };
        updateLocalNode(nodeId, { configuration: updatedConfiguration });
    };

    const handleUpdateVariable = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = evt.target;

            const configuration = {
                ...node.data.configuration,
                variable: value,
            };

            updateLocalNode(nodeId, { configuration });
        },
        [row, node, nodeId, updateLocalNode]
    );

    const handleUpdateQuery = useCallback(
        (queryId: string, nameInput: QueryInputName, inputValue: string) => {
            const currentQueries = node.data.configuration.query || [];
            const updatedQueries = currentQueries.map((query) => (query.id === queryId ? { ...query, [nameInput]: inputValue } : query));

            const updatedConfiguration = {
                ...node.data.configuration,
                query: updatedQueries,
            };

            updateLocalNode(nodeId, { configuration: updatedConfiguration });
        },
        [node.data.configuration.query, nodeId, updateLocalNode]
    );

    return {
        handleChangeInput,
        handleUpdateRowId,
        dbColums,
        isLoading,
        handleAddNewQuery,
        handleDeleteQuery,
        handleUpdateVariable,
        handleUpdateQuery,
    };
}
