import type { ListBoxElement } from "@builder/common/Headless/Listbox";

import { get } from "lodash";
import { SVGProps } from "react";
import { Node } from "reactflow";

import { ToolKitIcon } from "@builder/Icons";
import { INPUTS_NAMES_TOOL_CONFIG_PANEL, IToolNode } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { Version } from "@builder/modules/ToolsVersions/domain/versions.domain";
import { getThumbnailsIcon } from "@builder/shared/utils";

export function getInputsFromVersion(versions: Version[], versionSelected?: string) {
    const selectVersionData = versions.find((version) => version.version === versionSelected);
    const { Inputs = [] } = selectVersionData?.snapshot ?? {};
    return Inputs;
}

export function getToolConfig(formRef: React.MutableRefObject<HTMLFormElement | null>, currentNode: Node<IToolNode>, selectedVersion: ListBoxElement | undefined) {
    const currentConfig = get(currentNode, "data.configuration");
    if (!formRef.current) return currentConfig;

    const formData = new FormData(formRef.current) as unknown as Iterable<[object, FormDataEntryValue]>;
    const { [INPUTS_NAMES_TOOL_CONFIG_PANEL.VARIABLE]: variable, ...inputsData } = Object.fromEntries(formData) ?? {};

    const configuration = {
        ...currentConfig,
        input: inputsData,
        variable,
        version: selectedVersion?.value,
    };
    return configuration;
}

const EMPTY_VERSION_OPTION: ListBoxElement = {
    id: "empty-version",
    name: "No version",
    description: "Este tool no tiene versiones",
    Icon: ({ width = 20, height = 20 }: SVGProps<SVGSVGElement>) => <ToolKitIcon height={Number(height)} width={Number(width)} />,
    value: "",
    disabled: true,
    separator: false,
};

export function getVersionOptions(versions: Version[]): ListBoxElement[] {
    const lengthVersions = versions.length;
    if (lengthVersions === 0) return [EMPTY_VERSION_OPTION];

    return versions.map((version, index) => {
        const { snapshot, version: versionValue } = version;
        const { configuration, name, id, description } = snapshot.Tool;
        const { thumbnail } = configuration;

        const Icon = getThumbnailsIcon(thumbnail) as React.FunctionComponent<SVGProps<SVGSVGElement>>;

        return { id: `${id}-${versionValue}`, name: `${name} (${versionValue})`, description, Icon, separator: index !== lengthVersions - 1, value: versionValue };
    });
}
