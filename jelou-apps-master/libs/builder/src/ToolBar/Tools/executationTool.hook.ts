import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { TYPE_ERRORS, renderMessage } from "../../common/Toastify";
import { OutputExecution } from "../../pages/Home/ToolKits/types.toolkits";
import { ToolExecutionRepository } from "../../services/tools";
import { userMock } from "../constants.toolbar";
import { KEY_NAME, TestInputRepository } from "./TestInputRepository";
import { Company } from "@builder/pages/Variables/models/variables";

type UseExecutationToolProps = {
    setOutputExecuted: (output: OutputExecution | null) => void;
};

type ExecuteProps = {
    inputData: unknown;
};

const ORIGIN_TEST = "TEST";

export function useExecutationTool({ setOutputExecuted }: UseExecutationToolProps) {
    const { toolkitId, toolId } = useParams();
    const [isLoadingOutput, setIsLoadingOutput] = useState(false);
    const { clientId, clientSecret, id, name, socketId } = useSelector<{ company: Company }>((state) => state.company) as Company;

    const execute = async ({ inputData }: ExecuteProps) => {
        setIsLoadingOutput(true);
        setOutputExecuted(null);

        TestInputRepository.save(KEY_NAME.INPUT, inputData);
        try {
            const outputExecuted = await ToolExecutionRepository.execute(toolkitId, toolId, {
                input: inputData,
                user: userMock,
                company: { clientId, clientSecret, id, name, socketId },
                origin: ORIGIN_TEST,
            });
            setOutputExecuted(outputExecuted);
        } catch (error) {
            let messageError = "Tuvimos un error al ejecutar la herramienta";
            if (error instanceof Error) messageError = error.message;
            renderMessage(messageError, TYPE_ERRORS.ERROR);
        } finally {
            setIsLoadingOutput(false);
        }
    };

    return { execute, isLoadingOutput };
}
