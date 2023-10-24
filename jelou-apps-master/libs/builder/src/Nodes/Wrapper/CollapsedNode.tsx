import { useRef } from "react";

import { StyleNode } from "@builder/helpers/utils";

type CollapsedNodeProps = {
    styles: StyleNode;
    title: string;
    nodeId: string;
    workflowId: number;
    isNodeCollapsed: boolean;
    setIsNodeCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
    Icon: React.FC<{
        width?: number;
        height?: number;
        color?: string;
    }>;
};

export function CollapsedNode({ styles, title, nodeId, Icon, workflowId, isNodeCollapsed, setIsNodeCollapsed }: CollapsedNodeProps) {
    const ref = useRef<HTMLHeadElement>(null);

    return (
        <header
            style={{
                backgroundColor: styles.bgHeader,
                color: styles.textColorHeader,
                borderColor: styles.border,
            }}
            ref={ref}
            className="shadow-nodo relative flex w-64 justify-between rounded-lg border-2 p-4 font-medium"
        >
            <div className="flex items-center gap-3 self-center">
                <div className="scale-125">
                    <Icon width={20} />
                </div>
                <h3 aria-label="title-node" className="truncate text-lg font-semibold">
                    {title}
                </h3>
            </div>
        </header>
    );
}
