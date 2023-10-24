import { useState } from "react";
import { useReactFlow, Node } from "reactflow";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { getCustomInputs } from "../../libs/customInputs/parseInputs";
import { Http } from "@builder/modules/Nodes/Http/http.domain";
import { Input } from "../../pages/Home/ToolKits/types.toolkits";
import { TYPE_ERRORS, renderMessage } from "../../common/Toastify";
import * as HttpNodesService from "../../services/nodes";
import { useExecuteNodeStore } from "@builder/Stores/nodeConfigStore";
import { Company } from "@builder/pages/Variables/models/variables";
import { userMock } from "@builder/ToolBar/constants.toolbar";

const regex = /\{\{\$input.(.*?)\}\}/g;
const ORIGIN_TEST = "TEST";

export default function useExecuteNode() {
    const [outputExecuted, setOutputExecuted] = useState<HttpNodesService.ExecuteHttpNodeResponse | null>(null);
    const [isLoadingExecution, setIsLoadingExecution] = useState<boolean>(false);

    const { id, name, clientId, clientSecret, socketId } = useSelector<{ company: Company }>((state) => state.company) as Company;

    const { selectedNodeId } = useExecuteNodeStore();
    const { tool } = useQueryTool();
    const { Inputs = [], workflowId } = tool ?? {};

    const { getNode } = useReactFlow();
    const currentNode = getNode(selectedNodeId ?? "") as Node<Http>;
    const nodeConfiguration = get(currentNode, "data.configuration");

    const nodeInputs = nodeConfiguration && getCustomInputs(nodeConfiguration, regex, ["authentication", "body", "headers", "parameters"]);

    const mandatoryInputs = nodeInputs.reduce<Input[]>((acc, inputName) => {
        const currentInput = Inputs.find(({ name }) => inputName === name);

        if (currentInput) return [...acc, currentInput];
        return acc;
    }, []);

    const executeHttpNode = async (inputs: Record<string, any>) => {
        try {
            const output = await HttpNodesService.executeHttpNode(String(workflowId), currentNode.id, {
                input: inputs,
                user: userMock,
                company: { id, name, clientId, clientSecret, socketId },
                origin: ORIGIN_TEST,
            });
            setOutputExecuted(output);
        } catch (reason) {
            let messageError = "Tuvimos un error al ejecutar la herramienta";
            if (reason instanceof Error) messageError = reason.message;
            renderMessage(messageError, TYPE_ERRORS.ERROR);
        } finally {
            setIsLoadingExecution(false);
        }
    };

    return {
        outputExecuted,
        setOutputExecuted,
        isLoadingExecution,
        setIsLoadingExecution,
        mandatoryInputs,
        executeHttpNode,
    };
}
