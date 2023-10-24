import type { Input, OutputExecution } from "@builder/pages/Home/ToolKits/types.toolkits";

import { InputsForm } from "@builder/common/inputs.form";
import { KEY_NAME, TestInputRepository } from "./TestInputRepository";
import { useExecutationTool } from "./executationTool.hook";

type FormExecutionToolsProps = {
    inputs: Input[];
    setOutputExecuted: (output: OutputExecution | null) => void;
    handleClearToolTest: () => void;
    inputFormDataTest: Record<any, any>;
    setInputFormDataTest: React.Dispatch<React.SetStateAction<Record<any, any>>>;
};

export function FormExecutionTools({ handleClearToolTest, inputs, setOutputExecuted, inputFormDataTest, setInputFormDataTest }: FormExecutionToolsProps) {
    const { execute, isLoadingOutput } = useExecutationTool({ setOutputExecuted });
    const inputData = TestInputRepository.get(KEY_NAME.INPUT, {} as Record<string, string>);

    const handleExecuteTool = (inputData: Record<string, unknown>) => execute({ inputData });

    return (
        <InputsForm
            inputs={inputs}
            isLoadingPrimaryAction={isLoadingOutput}
            primaryAction={handleExecuteTool}
            primaryActionLabel="Ejecutar"
            secondaryAction={handleClearToolTest}
            secondaryActionLabel="Limpiar"
            defaultValues={inputData}
            inputFormDataTest={inputFormDataTest}
            setInputFormDataTest={setInputFormDataTest}
        />
    );
}
