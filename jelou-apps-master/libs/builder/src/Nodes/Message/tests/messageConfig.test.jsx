import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DBNodeToReactFlowNode } from "@/helpers/utils";
import { CustomProviderRF } from "@mocks/CustomReactFlowProvider";
import { nodesMock } from "@mocks/data";
import { mockReactFlow } from "@mocks/reactflow";
import { generateLocationBlock, generateQuickRepliesBlock, generateTextBlock } from "@nodes/Message/Blocks/Factory/message-node.blocks";
import { MessageConfigPanel } from "@nodes/Message/configPanel";

const user = userEvent.setup();
const nodeMock = DBNodeToReactFlowNode(nodesMock.data[1]);

vi.mock("@/Stores", async () => {
  const actual = await vi.importActual("@/Stores");

  return {
    ...actual,
    useWorkflowStore: vi.fn().mockReturnValue({
      id: "1",
    }),
  };
});
describe("Message configuration", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("should render with the config empty", () => {
    nodeMock.data.configuration = {};
    const { getByText } = render(
      <ReactFlowProvider>
        <MessageConfigPanel dataNode={nodeMock} />
      </ReactFlowProvider>
    );

    const btnTextAction = getByText("Texto");
    const btnImageAction = getByText("Imagen");
    const btnFileAction = getByText("Documento");
    const btnButtonsAction = getByText("Lista");

    expect(btnTextAction).toBeTruthy();
    expect(btnImageAction).toBeTruthy();
    expect(btnFileAction).toBeTruthy();
    expect(btnButtonsAction).toBeTruthy();
  });

  it("text block", async () => {
    nodeMock.data.configuration = {
      text: "Hola mundo",
      messages: [generateTextBlock()],
    };
    const { getAllByText, getByPlaceholderText, getByLabelText, getByText } = render(
      <ReactFlowProvider>
        <MessageConfigPanel dataNode={nodeMock} />
      </ReactFlowProvider>
    );

    const btnTextAction = getAllByText("Texto");
    expect(btnTextAction).toBeTruthy();
    expect(btnTextAction.length).toBe(2);

    const textArea = getByPlaceholderText("Escribe tu mensaje");
    expect(textArea).toBeTruthy();
    await user.click(textArea);
    await user.type(textArea, "Hola mundo");
    // @ts-ignore
    expect(textArea.value).toBe("Hola mundo");

    const btnActionsBlock = getByLabelText("menu actions blocks");
    expect(btnActionsBlock).toBeTruthy();
    await user.click(btnActionsBlock);

    const btnDeleteBlock = getByText("Eliminar");
    expect(btnDeleteBlock).toBeTruthy();
  });

  it("should render the quick reply's block", async () => {
    nodeMock.data.configuration = {
      text: "Hola mundo",
      messages: [generateQuickRepliesBlock()],
    };

    const { getByText, getAllByText } = render(
      <ReactFlowProvider>
        <MessageConfigPanel dataNode={nodeMock} />
      </ReactFlowProvider>
    );

    const btnQuickReply = getAllByText("Respuesta rápida");
    expect(btnQuickReply).toBeTruthy();

    const btnActionsBlock = getByText("Respuestas rápidas");
    expect(btnActionsBlock).toBeTruthy();
  });

  it("should render the location block", async () => {
    nodeMock.data.configuration = {
      text: "Hola mundo",
      messages: [generateLocationBlock()],
    };

    const { getAllByText, getByPlaceholderText } = render(
      <CustomProviderRF TestComponent={() => <MessageConfigPanel dataNode={nodeMock} />} nodes={[nodeMock]} />
    );

    const locations = getAllByText("Ubicación");
    expect(locations).toBeTruthy();
    expect(locations).toHaveLength(2);

    const spotNameInput = getByPlaceholderText("Ingresa el nombre del lugar");
    expect(spotNameInput).toBeTruthy();

    await user.type(spotNameInput, "Mi casa");
    // @ts-ignore
    expect(spotNameInput.value).toBe("Mi casa");

    const addressInput = getByPlaceholderText("Ingresa tu dirección");
    expect(addressInput).toBeTruthy();

    await user.type(addressInput, "Calle 123");
    // @ts-ignore
    expect(addressInput.value).toBe("Calle 123");
  });
});
