import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { addEdge, useReactFlow, type Connection, type Edge, type Node, type OnConnect } from "reactflow";

import { useValidatorSingleConnection } from "@builder/Nodes/hooks/validationConnections";
import { useWorkflowStore } from "@builder/Stores";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { EdgeCreator } from "@builder/modules/Edges/application/create.edge";
import { EdgeRepository } from "@builder/modules/Edges/infrastructure/edgeRepository";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";

import { OptionsPayloadMessageNode } from "../domain/actions.messages";
import { MessageNode } from "../domain/message.domain";

const edgeAdapter = new ServerEdgeAdapter();

export const useConnectionWithPayload = () => {
    const { serviceId: skillId } = useParams();
    const { setEdges, getNode } = useReactFlow();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const { updateServerNode, updateLocalNode } = useCustomsNodes();
    const validationConnectionHandler = useValidatorSingleConnection();

    /**
     * it creates a new edge with a payload of flowId. This function is used by textList and quickReply blocks
     */
    const onConnetEdgeWithPayload =
        (nodeId: string, messageId: string, optionId: string, edge?: Edge): OnConnect =>
        (params) => {
            const validConnection = validationConnectionHandler(params);
            if (!validConnection) return;

            // TODO: refactor this function
            const newEdge: Edge | Connection = edge ?? {
                id: nanoid(),
                ...params,
            };

            setEdges((eds) => addEdge(newEdge, eds));

            new EdgeCreator(new EdgeRepository(String(workflowId)), edgeAdapter).create(newEdge as Edge).catch((err) => console.error("error creating edge", { err }));

            if (!params.target || !skillId) return renderMessage("Error al intentar actualizar el payload en esta accion. Por favor intenta de nuevo", TYPE_ERRORS.ERROR);

            const messageNode = getNode(nodeId) as Node<MessageNode>;

            const optionsPayloadMessageNode = new OptionsPayloadMessageNode(messageNode, messageId, optionId);
            const { configuration, optionMessageNode } = optionsPayloadMessageNode.update({ skillId, targetId: params.target });

            updateLocalNode(nodeId, { configuration });
            updateServerNode(optionMessageNode).catch((err) => console.error("error updating node ~ onConnetEdgeWithPayload", { err }));
        };
    return { onConnetEdgeWithPayload };
};
