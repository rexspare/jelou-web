import dagre from "dagre";
import has from "lodash/has";
import includes from "lodash/includes";
import React, { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, useEdgesState, useNodesState } from "react-flow-renderer";
import NotVisitNode from "./NotVisitNode";
import StartNode from "./StartNode";
import VisitEdge from "./VisitEdge";
import VisitNode from "./VisitNode";

const NodeChart = (props) => {
    const { data } = props;

    const nodes = data;

    let visitNodes = nodes.map((node) => {
        return {
            id: node.pathId,
            type: node.type,
            ...(node.sourcePath ? { source: node.sourcePath } : {}),
            data: { label: node.label, total: node.total, percent: node.percentage, ...node },
        };
    });

    const edges = visitNodes
        .filter((node) => node.source)
        .map((node) => {
            return {
                id: `${node.source}-${node.id}`,
                source: node.source,
                markerEnd: {
                    type: MarkerType.Arrow,
                    color: "#DCDEE4",
                    strokeWidth: 1.5,
                },
                type: "smoothstep",
                target: node.id,
                animated: false,
                style: { stroke: "#DCDEE4", strokeWidth: 1.5 },
            };
        });

    visitNodes = visitNodes.map((node) => {
        const edge = edges.find((edge) => edge.source === node.id);
        return {
            ...node,
            data: {
                ...node.data,
                isSource: edge ? true : false,
            },
        };
    });

    const g = new dagre.graphlib.Graph();

    g.setGraph({
        rankdir: "LR",
    });

    g.setDefaultEdgeLabel(function () {
        return {};
    });

    visitNodes.forEach((node) => {
        g.setNode(node.id, { label: node.label, width: 300, height: 65 });
    });

    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    g.nodes().forEach(function (v) {
        const position = g.node(v);
        try {
            visitNodes.find((node) => node.id === v).position = {
                x: position.x,
                y: position.y,
            };
        } catch (err) {
            console.log(err);
        }
    });

    return (
        <div className="h-full w-full">
            <HorizontalFlow nodes={visitNodes} edges={edges} />
        </div>
    );
};

const HorizontalFlow = ({ nodes: n, edges: e }) => {
    const [nodes, setNodes] = useNodesState(n.filter((node) => has(node, "position")));
    const [edges, setEdges] = useEdgesState(e);
    const nodeTypes = useMemo(() => ({ start: StartNode, visit: VisitNode, not_visited: NotVisitNode }), []);
    const edgeTypes = useMemo(() => ({ visit: VisitEdge }), []);
    const [currentNode, setCurrentNode] = useState(null);

    React.useEffect(() => {
        if (currentNode) {
            setEdges((eds) => {
                function animateEdges(edges, nodeId = null) {
                    if (!nodeId || nodeId === "START/") {
                        return edges;
                    }

                    const edg = edges.find((edge) => edge.target === nodeId);

                    const otherEdges = edges.filter((edge) => edge.id !== edg.id);

                    const parsedEdge = {
                        ...edg,
                        animated: true,
                        style: { stroke: "#35D1E2", strokeWidth: 3 },
                        markerEnd: {
                            type: MarkerType.Arrow,
                            color: "#35D1E2",
                            strokeWidth: 1.5,
                        },
                    };

                    const parsedEdges = [...otherEdges, parsedEdge];

                    const node = nodes.find((node) => node.id === edg.source);

                    return animateEdges(parsedEdges, node?.id);
                }

                const parsedEdges = animateEdges(
                    eds.map((edge) => {
                        return {
                            ...edge,
                            style: { stroke: "#DCDEE4", strokeWidth: 1.5 },
                            animated: false,
                            markerEnd: {
                                type: MarkerType.Arrow,
                                color: "#DCDEE4",
                                strokeWidth: 1.5,
                            },
                        };
                    }),
                    currentNode.id
                );

                const nodeIds = [currentNode.id, ...parsedEdges.filter((edge) => edge.animated).map((edge) => edge.source)];

                setNodes((nds) =>
                    nds.map((node) => {
                        if (includes(nodeIds, node.id)) {
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    active: true,
                                },
                            };
                        }

                        return {
                            ...node,
                            data: {
                                ...node.data,
                                active: false,
                            },
                        };
                    })
                );

                return parsedEdges;
            });
        }
    }, [currentNode, setNodes]);

    const handleNodeClick = (event, node) => {
        setCurrentNode(node);
    };

    return (
        <div className="h-full w-full overflow-hidden rounded-3xl border-2 border-[#ccd4e0] bg-[#f7f8fb]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                elementsSelectable={false}
                nodesConnectable={false}
                minZoom={0.5}
                defaultZoom={1}
                edgeTypes={edgeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                onNodeClick={handleNodeClick}
                attributionPosition="bottom-left"
            >
                <Background variant="dots" gap={12} size={0.3} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
};

export default NodeChart;
