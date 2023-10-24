import debounce from "lodash/debounce";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { OutputsRepository } from "@builder/modules/OutputTools/Infrastructure/outputs";
import { OutputsCreator } from "@builder/modules/OutputTools/application/outputCreator";
import { INITIAL_SCHEMA_VALUES } from "@builder/modules/OutputTools/domain/contants.output";
import { OutputsSchemaValues, type Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";

type OutputSchemaHook = {
    outputData: Partial<Output>;
    onClose: () => void;
};

export function useOutputsSchema({ onClose, outputData }: OutputSchemaHook) {
    const { toolkitId, toolId } = useParams();
    const { revalidateTool, tool } = useQueryTool();

    const outputsRepository = new OutputsRepository(String(toolkitId), String(toolId));
    const outputCreator = new OutputsCreator(outputsRepository);

    const [schemaValues, setSchemaValues] = useState<OutputsSchemaValues[]>(schemaValuesInitialState(outputData));

    const addVariable = () => {
        const newSchema: OutputsSchemaValues = {
            id: v4(),
            name: "",
            variable: "",
        };

        setSchemaValues((prevSchema) => [...prevSchema, newSchema]);
    };

    const handleDeletefield = (idItem: string) => () => {
        setSchemaValues((prevSchema) => prevSchema.filter((schema) => schema.id !== idItem));
    };

    const handleInputChange = (id: string) =>
        debounce((evt: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = evt.target as HTMLInputElement;
            setSchemaValues((prevSchema) => prevSchema.map((schema) => (schema.id === id ? { ...schema, [name]: value } : schema)));
        }, 200);

    const prepareSchema = () => {
        const objcetSchema: Record<string, string> = {};
        schemaValues.forEach(({ name, variable }) => (objcetSchema[`${variable}`] = name));

        outputData.schema = objcetSchema;

        return { newOutput: outputData };
    };

    const handleUpdateOutput = async (outputId: string) => {
        const { newOutput } = prepareSchema();
        try {
            await outputsRepository.update(outputId, newOutput);
            revalidateTool();
            renderMessage("Output actualizado correctamente", TYPE_ERRORS.SUCCESS);
            onClose();
        } catch (error) {
            let message = "Ha ocurrido un error al actualizar el output";
            if (error instanceof Error) message = error.message;
            renderMessage(message, TYPE_ERRORS.ERROR);
        }
    };

    const handleCreateOutput = async () => {
        const hasOneFielEmpty = schemaValues.some(({ name, variable }) => !name || !variable);

        if (hasOneFielEmpty) {
            return renderMessage("Asegúrate de haber llenado todos los campos correctamente antes de continuar", "warning");
        }

        const { newOutput } = prepareSchema();
        const allCurrentOutputs = tool?.Outputs || [];

        try {
            await outputCreator.create(newOutput, allCurrentOutputs);
            revalidateTool();
            renderMessage("Output creado correctamente", "success");
            onClose();
        } catch (error) {
            let message = "Ha ocurrido un error al crear el output";
            if (error instanceof Error) message = error.message;
            renderMessage(message, TYPE_ERRORS.ERROR);
        }
    };

    return {
        schemaValues,
        addVariable,
        handleDeletefield,
        handleInputChange,
        handleCreateOutput,
        setSchemaValues,
        handleUpdateOutput,
    };
}
function schemaValuesInitialState(outputData: Partial<Output>): OutputsSchemaValues[] | (() => OutputsSchemaValues[]) {
    return () => {
        if (outputData?.schema) {
            const schema: OutputsSchemaValues[] = [];
            Object.entries(outputData.schema).forEach(([variable, name]) => {
                schema.push({ id: v4(), name, variable });
            });

            return schema;
        }
        return INITIAL_SCHEMA_VALUES;
    };
}
