import debounce from "lodash/debounce";
import get from "lodash/get";
import { useState } from "react";
import { useReactFlow, type Node } from "reactflow";

import type { ContactTypes, MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { CONTACT_VIEW } from "../helpers/constants.contact";
import { checkContactFieldsFull, parseContactBlock } from "../helpers/utils.contact";

type ContactBlockMessage = MessageNode["configuration"]["messages"][0];

type ContactsProps = {
    messageId: string;
    nodeId: string;
};

export const useContact = ({ messageId, nodeId }: ContactsProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const [contactBlock, setContactBlock] = useState<ContactTypes>(getContacts(currentNode, messageId)[0]);

    const { updateLocalNode } = useCustomsNodes();

    const [contactView, setContactView] = useState(CONTACT_VIEW.CONTACT);
    const isContactView = contactView === CONTACT_VIEW.CONTACT;

    const handleChangeInputs = debounce((event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const formData = new FormData();
        formData.append(fieldName, fieldValue);
        const data = Object.fromEntries(formData as unknown as Iterable<[object, FormDataEntryValue]>);

        if (checkContactFieldsFull(data)) {
            const formattedContact = parseContactBlock(data, contactBlock);
            handleSaveContactBlock(formattedContact);
        }
    }, 500);

    const handleSaveContactBlock = (data: ContactTypes) => {
        const messages = get(currentNode, "data.configuration.messages") || [];
        const newMessages = messages.map((message) => (message.id === messageId ? { ...message, contacts: [data] } : message));

        const dataUpdated = {
            ...currentNode.data.configuration,
            messages: newMessages,
        };

        setContactBlock(data);
        updateLocalNode(currentNode.id, { configuration: dataUpdated });
    };

    const handleReturnView = () => {
        setContactView(CONTACT_VIEW.CONTACT);
    };

    const handleChangeView = (view: string) => {
        setContactView(view);
    };

    return {
        contactView,
        contactBlock,
        isContactView,
        handleReturnView,
        handleChangeView,
        handleChangeInputs,
        handleSaveContactBlock,
    };
};

function getContacts(currentNode: Node<MessageNode>, messageId: string) {
    const messages = get(currentNode, "data.configuration.messages") || [];
    const contactsBock = messages.find((message) => message.id === messageId) as ContactBlockMessage;
    const contacts = contactsBock?.contacts ?? [];
    return contacts;
}
