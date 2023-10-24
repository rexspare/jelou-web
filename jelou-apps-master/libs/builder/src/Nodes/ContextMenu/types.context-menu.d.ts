import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { Node } from "reactflow";

export interface ContextMenuProps extends Node {
    edgeType?: EDGES_TYPES;
    xPos: string;
    yPos: string;
}
