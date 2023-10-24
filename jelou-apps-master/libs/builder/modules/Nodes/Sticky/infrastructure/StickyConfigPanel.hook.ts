import type { ListBoxElement } from "@builder/common/Headless/Listbox";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { get } from "lodash";
import debounce from "lodash/debounce";
import { useCallback, useMemo, useState } from "react";
import { Node, useReactFlow } from "reactflow";
import { BaseConfiguration } from "../../domain/nodes";
import { MAX_CONTENT_LENGHT, StickyColorPaletteColor, StickyColorPaletteType, StickyNote, stickyColorPalette } from "../domain/sticky.domain";

type StickyConfigPanelProps = {
    nodeId: string;
    parseListCallback: ([key, value]: [StickyColorPaletteColor, StickyColorPaletteType]) => ListBoxElement;
};

export const useStickyConfigPanel = ({ nodeId, parseListCallback }: StickyConfigPanelProps) => {
    const node = useReactFlow().getNode(nodeId) as Node<StickyNote>;

    const [selectedColor, setSelectedColor] = useState<ListBoxElement>(
        parseListCallback([node.data.configuration.colorPalette, stickyColorPalette.get(node.data.configuration.colorPalette) as StickyColorPaletteType])
    );
    const [comments, setComments] = useState<string>(get(node, "data.configuration.comments") ?? "");
    const [contentExceedError, setContentExceedError] = useState<string>("");
    const { updateLocalNode } = useCustomsNodes();

    const list = useMemo(() => Array.from(stickyColorPalette.entries()).map(parseListCallback), [stickyColorPalette]);

    const handleSelectedColor = (optionSelected: ListBoxElement) => {
        setSelectedColor(optionSelected);

        const updatedData = { ...node.data.configuration, colorPalette: optionSelected.value };
        updateNodeDebounce(nodeId, updatedData);
    };

    const handleChangeComments = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget.value.length > MAX_CONTENT_LENGHT) {
            setContentExceedError(`Solo se puede introducir hasta ${MAX_CONTENT_LENGHT} carácteres`);
            return;
        }

        setComments(event.currentTarget.value);
        setContentExceedError("");

        const newConfiguration: BaseConfiguration = {
            ...node.data.configuration,
            comments: event.currentTarget.value,
        };
        updateNodeDebounce(nodeId, newConfiguration);
    };

    const updateNodeDebounce = useCallback(
        debounce((nodeId, updatedData) => updateLocalNode(nodeId, { configuration: updatedData }), 200),
        []
    );

    return {
        selectedColor,
        comments,
        contentExceedError,
        list,
        handleSelectedColor,
        handleChangeComments,
    };
};
