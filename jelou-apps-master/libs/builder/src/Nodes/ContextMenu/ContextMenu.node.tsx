import React, { useEffect, useRef } from "react";
import type { NodeProps } from "reactflow";
import type { ContextMenuProps as ContextMenuPropsType } from "./types.context-menu";

import { useContext, useMemo } from "react";
import { Handle, Position } from "reactflow";

import { MESSAGE_LIST_NODES, TOOL_NODE_LIST } from "@builder/ToolBar/constants.toolbar";
import { useSearch } from "@builder/ToolBar/hook/search";
import { SearchTool } from "@builder/common/Headless/Search";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { FromPageContext } from "@builder/pages/Workflow";
import { FROM_PAGE } from "@builder/pages/constants.home";
import { useCustomHook } from "./contextMenu.hook";
import { validatedMessageListNodes } from "@builder/modules/Nodes/message/domain/messagesByChannels.validation";

const targetHandleStyle: React.CSSProperties = {
    zIndex: -5,
    position: "relative",
    left: 0,
    top: 5,
    border: "none",
    borderRadius: 0,
    backgroundColor: "transparent",
};

export const ContextMenuNode = ({ id: nodeId, xPos, yPos, data }: NodeProps<ContextMenuPropsType>) => {
    const fromPage = useContext(FromPageContext);
    const isToolsView = fromPage === FROM_PAGE.TOOL;
    const nodeRef = useRef<HTMLDivElement>(null);

    const serviceListNode = validatedMessageListNodes();

    const nodeList = useMemo(() => {
        const itemList = isToolsView ? TOOL_NODE_LIST : [...serviceListNode, ...MESSAGE_LIST_NODES];
        return itemList.filter((item) => item.nodeType !== NODE_TYPES.NOTE);
    }, [isToolsView]);

    const { handleSearch, search, searchResults } = useSearch(nodeList);
    const { deleteContextMenuNode, handleCreateNode } = useCustomHook({ data, nodeId, xPos, yPos });

    useEffect(() => {
        let isDragging = false;

        function handlePointerDown(event: PointerEvent) {
            isDragging = true;
            if (isDragging) {
                if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
                    deleteContextMenuNode();
                }
            }
        }

        function handlePointerUp() {
            isDragging = false;
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("pointerup", handlePointerUp);

        const handleClickOutside = (event: MouseEvent) => {
            if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
                deleteContextMenuNode();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("pointerup", handlePointerUp);
        };
    }, [deleteContextMenuNode]);

    return (
        <div
            className="nowheel relative flex max-h-60 w-[17.1875rem] flex-col rounded-xl bg-white"
            ref={nodeRef}
            style={{
                boxShadow: "0px 3px 6px -3px rgba(0, 0, 0, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 24px 8px rgba(0, 0, 0, 0.05)",
            }}
        >
            <Handle id={nodeId} className="absolute left-0 top-0 h-40 w-40" style={targetHandleStyle} position={Position.Left} type="target" />
            <span className="sr-only">contextMenu-node</span>
            <div className="text-grey-75 [&_input]:w-40">
                <SearchTool handleSearch={handleSearch} search={search} formClassName={`pt-3 px-2 h-[3.25rem] ${searchResults && searchResults.length > 0 ? "" : "mb-4"}`} />
            </div>
            <ul className="flex-1 overflow-y-scroll hover:rounded-b-xl">
                {searchResults.map((item) => {
                    const { Icon, id, initialData, nodeType, text } = item;

                    if (nodeType === null) return null;

                    return (
                        <li key={`${id}-${text}`} className="h-12 hover:bg-primary-200 hover:bg-opacity-10 ">
                            <button onClick={handleCreateNode(nodeType, initialData)} className="flex h-full w-full items-center text-gray-400">
                                <div className="flex w-16 items-center justify-center">
                                    <Icon width={22} height={22} />
                                </div>
                                <span className="text-lg">{text}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
