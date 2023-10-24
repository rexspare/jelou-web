import { CSSProperties, useRef } from "react";

import { StyleNode } from "@builder/helpers/utils";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";

type DefaultWrapperNodeProps = {
    styles: StyleNode;
    title: string;
    nodeId: string;
    workflowId: number;
    selected?: boolean;
    nodeType: NODE_TYPES;
    setIsNodeCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    Icon: React.FC<{
        width?: number;
        height?: number;
        color?: string;
    }>;
};

export function DefaultWrapperNode({ styles, Icon, children, nodeId, title, nodeType, selected = false }: DefaultWrapperNodeProps) {
    const ref = useRef<HTMLElement>(null);

    const defaultClassName = `shadow-nodo min-w-8 max-w-64 rounded-12 border-2 ring-4 ring-transparent bg-[#FAFBFC] ring-opacity-15 ${selected ? "border-[#50B0C4] ring-[#50B0C4]" : ""}`;

    return (
        <article
            style={
                {
                    backgroundColor: styles.bg,
                    color: styles.textColorHeader,
                } as CSSProperties
            }
            ref={ref}
            className={defaultClassName}
        >
            <header
                style={{
                    backgroundColor: styles.bgHeader,
                }}
                className="flex h-11 justify-between rounded-t-10 px-4 font-medium"
            >
                <div className="flex items-center gap-2">
                    <Icon width={26} height={26} color="#50B0C4" />
                    <h3 aria-label="title-node" className="w-[10rem] truncate">
                        {title}
                    </h3>
                </div>
            </header>
            <main aria-label={`wrapNode-${nodeId}`} className="grid gap-2 px-4 py-3">
                {children}
            </main>
        </article>
    );
}
