import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

import { useConfigNodeId } from "@builder/Stores";
import { SlideOverCustom } from "@builder/common/Headless/Slide-over";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";

import { CodeConfigPanel } from "../Code";
import { ConditionalConfig } from "../Conditional/conditional.config";
import { DatumNodeConfig } from "../Datum/datum.config";
import { EndConfig } from "../End";
import { HttpConfig } from "../Http";
import { IFConfig } from "../If";
import { IfErrorConfigNode } from "../IfError";
import { InputConfigNode } from "../Input";
import { MemoryNodeConfig } from "../Memory/memory.config";
import { MessageConfigPanel } from "../Message";
import { PMAConfigNode } from "../PMA";
import { RandomConfigPanel } from "../Random/random.config";
import { SkillNodeConfig } from "../Skill";
import { StepConfigPanel } from "../Step/step.config";
import { StickyNoteConfig } from "../Sticky/sticky.config";
import { TimerConfigPanel } from "../Timer/timer.config";
import { ToolNodeConfigPanel } from "../Tool";

const RENDER_CONFIG_PANEL: Record<string, (nodeId: string) => JSX.Element> = {
    [NODE_TYPES.HTTP]: (nodeId) => <HttpConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.IF_ERROR]: (nodeId) => <IfErrorConfigNode nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.IF]: (nodeId) => <IFConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.INPUT]: (nodeId) => <InputConfigNode nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.MESSAGE]: (nodeId) => <MessageConfigPanel nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.PMA]: (nodeId) => <PMAConfigNode nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.CODE]: (nodeId) => <CodeConfigPanel nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.END]: (nodeId) => <EndConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.TOOL]: (nodeId) => <ToolNodeConfigPanel nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.NOTE]: (nodeId) => <StickyNoteConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.TIMER]: (nodeId) => <TimerConfigPanel nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.EMPTY]: (nodeId) => <StepConfigPanel nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.CONDITIONAL]: (nodeId) => <ConditionalConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.RANDOM]: (nodeId) => <RandomConfigPanel nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.SKILL]: (nodeId) => <SkillNodeConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.DATUM]: (nodeId) => <DatumNodeConfig nodeId={nodeId} key={nodeId} />,
    [NODE_TYPES.MEMORY]: (nodeId) => <MemoryNodeConfig nodeId={nodeId} key={nodeId} />,
};

export const ConfigPanel = () => {
    const [showConfigState, setShowConfigState] = useState(false);

    const { clearNodeIdSelected, nodeIdSelected, previouslyNodeIdSelected } = useConfigNodeId();
    const { getNode } = useReactFlow();
    const { updateServerNode } = useCustomsNodes();

    const currentNode = getNode(nodeIdSelected || "");

    const close = () => {
        setTimeout(
            (nodeIdSelectedArg) => {
                if (nodeIdSelectedArg) {
                    const node = getNode(nodeIdSelectedArg);
                    if (node) {
                        updateServerNode(node).catch((error) => {
                            console.error("error al actualizar el nodo, cerrando la configuracion", { error });
                            renderMessage(error.message, TYPE_ERRORS.ERROR);
                        });
                    }
                }
            },
            1000,
            nodeIdSelected
        );
        setShowConfigState(false);
        clearNodeIdSelected();
    };

    useEffect(() => {
        if (previouslyNodeIdSelected) {
            const node = getNode(previouslyNodeIdSelected);
            if (node)
                updateServerNode(node).catch((error) => {
                    console.error("error al actualizar el nodo, cambiando de nodo", { error });
                    renderMessage(error.message, TYPE_ERRORS.ERROR);
                });
        }
    }, [previouslyNodeIdSelected]);

    useEffect(() => {
        if (nodeIdSelected !== undefined) setShowConfigState(true);
    }, [nodeIdSelected]);

    if (!nodeIdSelected || !currentNode) return null;

    const renderConfig = showConfigState && currentNode.type && RENDER_CONFIG_PANEL[currentNode.type];

    return (
        <SlideOverCustom open={showConfigState} onClose={close} nodeId={nodeIdSelected}>
            {showConfigState && renderConfig && renderConfig(nodeIdSelected)}
        </SlideOverCustom>
    );
};
