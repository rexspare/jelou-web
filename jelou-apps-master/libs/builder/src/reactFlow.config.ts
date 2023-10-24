import { EdgeTypes, NodeTypes } from "reactflow";

import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { EDGES_TYPES } from "../modules/Edges/domain/constanst";
import { DefaultEdge, ErrorEdge, SuccessEdge } from "./Edges";
import { SkillNode } from "./Nodes/Skill";
import {
    CodeNode,
    ConditionalNode,
    ContextMenuNode,
    DatumNode,
    EndNode,
    HttpNode,
    IFNode,
    IfErrorNode,
    InputNode,
    MemoryNode,
    MessageNode,
    NodePMA,
    RandomNode,
    StartNode,
    StepNode,
    StickyNoteNode,
    TimerNode,
    ToolNode,
} from "./Nodes/index";

export const rfStyle = {
    backgroundColor: "#F4F4F4",
};

export const defaultEdgeOptions = {
    markerEnd: "customArrowEnd",
};

export const nodeTypes: NodeTypes = {
    [NODE_TYPES.START]: StartNode,
    [NODE_TYPES.MESSAGE]: MessageNode,
    [NODE_TYPES.HTTP]: HttpNode,
    [NODE_TYPES.PMA]: NodePMA,
    [NODE_TYPES.IF_ERROR]: IfErrorNode,
    [NODE_TYPES.IF]: IFNode,
    [NODE_TYPES.INPUT]: InputNode,
    [NODE_TYPES.CONTEXT_MENU]: ContextMenuNode,
    [NODE_TYPES.CODE]: CodeNode,
    [NODE_TYPES.END]: EndNode,
    [NODE_TYPES.TOOL]: ToolNode,
    [NODE_TYPES.NOTE]: StickyNoteNode,
    [NODE_TYPES.TIMER]: TimerNode,
    [NODE_TYPES.EMPTY]: StepNode,
    [NODE_TYPES.CONDITIONAL]: ConditionalNode,
    [NODE_TYPES.RANDOM]: RandomNode,
    [NODE_TYPES.SKILL]: SkillNode,
    [NODE_TYPES.DATUM]: DatumNode,
    [NODE_TYPES.MEMORY]: MemoryNode,
};

export const edgeType: EdgeTypes = {
    [EDGES_TYPES.DEFAULT]: DefaultEdge,
    [EDGES_TYPES.SUCCESS]: SuccessEdge,
    [EDGES_TYPES.ERROR]: ErrorEdge,
};
