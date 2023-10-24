/**
 * This function is used to get the styles of the handle target when the node is connecting
 * @param nodeId id of the node to get the styles
 * @param connectionNodeId id of the node that is connecting
 */
export const getHandleTargetStyles = (nodeId: string, connectionNodeId: string | null, hover = false): React.CSSProperties => {
    const isTarget = connectionNodeId && connectionNodeId !== nodeId;

    return {
        zIndex: isTarget ? 3 : -1,
        position: "absolute",
        left: 0,
        width: "100%",
        height: "100%",
        borderWidth: isTarget && hover ? 2 : 0,
        borderColor: isTarget && hover ? "#00B3C7" : "",
        borderRadius: 10,
        backgroundColor: "transparent",
    };
};

export type StyleNode = {
    bg?: string;
    bgHeader?: string;
    border?: string;
    textColorHeader?: string;
};

export function stylesForNode(styleNode: StyleNode): StyleNode {
    return Object.assign(
        {
            bg: "#F1F3F5",
            bgHeader: "#fff",
            border: "#DCDEE4",
            textColorHeader: "#727C94",
        },
        styleNode
    );
}
