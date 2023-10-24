import { ReactFlowProvider } from "reactflow";

import { SpinnerIcon } from "@builder/Icons";
import { ChannelTypes } from "@builder/modules/Channels/domain/channels.domain";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";
import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { useQueryOneSkill } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { useQueryWorkflow } from "@builder/modules/workflow/infrastructure/queryWorkflow";

import WorkFlow from "../Workflow";
import { FROM_PAGE } from "../constants.home";

const serverNodeAdapter = new ServerNodeAdapter();
const serverEdgeAdapter = new ServerEdgeAdapter();

export const SkillWorkflow = () => {
    const { data: skill, isLoading } = useQueryOneSkill();

    const { Channels = [] } = skill ?? {};
    //const [channel] = Channels;
    const channel = Channels.find((c) => c.type === ChannelTypes.WHATSAPP);
    const { workflowId } = channel ?? {};

    const { workflowTool, isFetching } = useQueryWorkflow({ workflowId });

    const { Edges: edgeList = [], Nodes: nodeList = [] } = workflowTool ?? {};
    const initialsNodes = serverNodeAdapter.parserList(nodeList);
    const initialsEdges = serverEdgeAdapter.parserList(edgeList);

    if (isFetching || isLoading) {
        return (
            <div className="grid h-screen w-screen place-content-center">
                <span className="text-primary-200">
                    <SpinnerIcon width={50} />
                </span>
            </div>
        );
    }

    return (
        <ReactFlowProvider>
            <WorkFlow fromPage={FROM_PAGE.SERVICES} initialsEdges={initialsEdges} initialsNodes={initialsNodes} />
        </ReactFlowProvider>
    );
};
