import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Node, useReactFlow } from "reactflow";

import type { ListBoxElement } from "@builder/common/Headless/Listbox";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { IToolNode } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { Version } from "@builder/modules/ToolsVersions/domain/versions.domain";
import { getInputsFromVersion, getToolConfig, getVersionOptions } from "./configPanelLogic";

type ToolNodeConfigPanelProps = {
    nodeId: string;
    versions: Version[];
    defaultVersion?: string;
};

export const useToolNodeConfigPanel = ({ nodeId, versions, defaultVersion }: ToolNodeConfigPanelProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<IToolNode>;

    const formRef = useRef<HTMLFormElement | null>(null);
    const { updateLocalNode } = useCustomsNodes();
    const versionsOptions: ListBoxElement[] = getVersionOptions(versions);

    const [selectedVersion, setSelectedVersion] = useState<ListBoxElement | undefined>(() => {
        const { version } = currentNode.data.configuration;
        return versionsOptions.find((option) => option.value === version);
    });

    const Inputs = getInputsFromVersion(versions, selectedVersion?.value);

    const onChangeForm = debounce((evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const configuration = getToolConfig(formRef, currentNode, selectedVersion);

        updateLocalNode(nodeId, { configuration });
    }, 500);

    const onChangeSelectVersion = (optionSelected: ListBoxElement) => {
        setSelectedVersion(optionSelected);

        const configuration = getToolConfig(formRef, currentNode, optionSelected);

        updateLocalNode(nodeId, { configuration });
    };

    useEffect(() => {
        if (selectedVersion) return;
        const defaultVersionOption = versionsOptions.find((option) => option.value === defaultVersion);
        setSelectedVersion(defaultVersionOption);
    }, [defaultVersion, versionsOptions, selectedVersion]);

    return { formRef, onChangeForm, selectedVersion, onChangeSelectVersion, versionsOptions, Inputs };
};
