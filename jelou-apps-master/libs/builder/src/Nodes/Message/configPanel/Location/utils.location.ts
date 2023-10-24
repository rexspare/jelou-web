import get from "lodash/get";
import { Node } from "reactflow";
import z from "zod";

import { LocationBlock, MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";

type MessageNodeType = Node<MessageNode>;

export function getCurrentBlock(currentNode: MessageNodeType, messageId: string) {
    const messages = get(currentNode, "data.configuration.messages") ?? [];
    const locationBlock = messages.find((message) => message.id === messageId) as LocationBlock;
    return { locationBlock, messages };
}

export function getInitialsMarker(locationBlock: LocationBlock) {
    const { latitude, longitude } = locationBlock.coordinates;
    return latitude && longitude ? { lat: Number(latitude), lng: Number(longitude) } : null;
}

export function updateLocationBlock(currentNode: MessageNodeType, messageId: string, dataToSave: Partial<LocationBlock>) {
    const { messages, locationBlock: currentBlock } = getCurrentBlock(currentNode, messageId);

    const newLocationBlock = {
        ...currentBlock,
        ...dataToSave,
    };

    const newMessages = messages.map((message) => (message.id === messageId ? newLocationBlock : message));

    const newConfiguration = {
        ...currentNode.data.configuration,
        messages: newMessages,
    };

    return newConfiguration;
}

export function nameAndDirectionValidator(locationData: unknown) {
    try {
        const location = z
            .object({
                name: z.string().min(1),
                address: z.string().min(1),
            })
            .parse(locationData);

        return Promise.resolve(location);
    } catch (error) {
        return Promise.reject(error);
    }
}
