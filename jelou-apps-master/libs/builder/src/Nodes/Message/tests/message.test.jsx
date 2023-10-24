/** @typedef {import('@nodes/utils/types.nodes').MessageNode } MessageNodeData */

import { cleanup, render } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DBNodeToReactFlowNode } from "@/helpers/utils";
import { nodesMock } from "@mocks/data";
import { BLOCK_TYPES, BUTTONS_OPTIONS_TYPES } from "@nodes/Message/constants.message";
import { MessageNode } from "@nodes/Message/message.node";

const nodeMock = DBNodeToReactFlowNode(nodesMock.data[1]);

vi.mock("@/Stores/workflow.store", async () => {
    const actual = vi.importActual("@/Stores/workflow.store");

    return {
        ...actual,
        useWorkflowStore: vi.fn().mockReturnValue({ id: "1" }),
    };
});

describe("Message node", () => {
    beforeEach(cleanup);

    it("should render", () => {
        const { getByText, getByLabelText } = render(
            <ReactFlowProvider>
                <MessageNode {...nodeMock} />
            </ReactFlowProvider>
        );

        const titelNode = nodeMock.data.configuration.title;
        const textElement = getByText(titelNode).textContent;
        expect(textElement).toBe(titelNode);

        const nodeId = nodeMock.id;
        const mainNode = getByLabelText(`wrapNode-${nodeId}`);
        expect(mainNode).toBeTruthy();
    });

    it("Empty text area", () => {
        const node = {
            ...nodeMock,
            data: {
                configuration: {
                    title: "Mensaje",
                    messages: [
                        {
                            id: "1",
                            type: "text",
                            text: "",
                            initialData: "text",
                        },
                    ],
                },
            },
        };
        const { getByText } = render(
            <ReactFlowProvider>
                <MessageNode {...node} />
            </ReactFlowProvider>
        );

        const textAreaEmptyText = "Agrega contenido al mensaje";
        const textArea = getByText(textAreaEmptyText);
        expect(textArea).toBeTruthy();
        expect(textArea.textContent).toBe(textAreaEmptyText);
    });

    it("should render image block with the img and the caption empty", () => {
        const { getByLabelText } = render(
            <ReactFlowProvider>
                <MessageNode {...nodeMock} />
            </ReactFlowProvider>
        );

        const imageBlock = getByLabelText("mediaBlock");
        expect(imageBlock).toBeTruthy();
    });

    it("should be render the list block", () => {
        const node = {
            ...nodeMock,
            data: {
                configuration: {
                    title: "Mensaje",
                    messages: [
                        {
                            id: "1",
                            type: BLOCK_TYPES.LIST,
                            text: null,
                            options: [
                                {
                                    id: "test-1",
                                    title: null,
                                    type: BUTTONS_OPTIONS_TYPES.POSTBACK,
                                },
                            ],
                        },
                    ],
                },
            },
        };

        const { getByPlaceholderText } = render(
            <ReactFlowProvider>
                <MessageNode {...node} />
            </ReactFlowProvider>
        );

        const buttonBlockInput = getByPlaceholderText("Escribe tu opción");
        expect(buttonBlockInput).toBeTruthy();
    });

    it("should render the quick reply block", () => {
        const node = {
            ...nodeMock,
            data: {
                configuration: {
                    title: "",
                    messages: [
                        {
                            id: "1",
                            type: BLOCK_TYPES.QUICK_REPLY,
                            text: null,
                            options: [
                                {
                                    id: "test-1",
                                    title: null,
                                    type: BUTTONS_OPTIONS_TYPES.POSTBACK,
                                },
                            ],
                        },
                    ],
                },
            },
        };

        const { getByText, getByPlaceholderText } = render(
            <ReactFlowProvider>
                <MessageNode {...node} />
            </ReactFlowProvider>
        );

        expect(getByText("Respuestas rápidas")).toBeTruthy();
        expect(getByPlaceholderText("Escribe tu opción")).toBeTruthy();
    });
});
