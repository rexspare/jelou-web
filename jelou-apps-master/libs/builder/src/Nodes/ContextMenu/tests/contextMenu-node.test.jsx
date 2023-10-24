import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import cloneDeep from "lodash/cloneDeep";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DBNodeToReactFlowNode } from "@/helpers/utils";
import { nodesMock } from "@mocks/data";
import { ContextMenuNode } from "../ContextMenu.node";

const user = userEvent.setup();
vi.mock("@/Stores", async () => {
  const actual = await vi.importActual("@/Stores");

  return {
    // @ts-ignore
    ...actual,
    useWorkflowStore: vi.fn().mockReturnValue({
      id: "1",
    }),
  };
});

const wrapper = ({ children }) => <ReactFlowProvider>{children}</ReactFlowProvider>;

describe("ContextMenu node", () => {
  beforeEach(cleanup);

  it("should render", () => {
    const data = cloneDeep(nodesMock.data[1]);
    data.configuration = {};
    const nodeMock = DBNodeToReactFlowNode(data);
    const nodeMockProps = { ...nodeMock, xPos: "", yPos: "" };

    const { getByText } = render(<ContextMenuNode {...nodeMockProps} />, { wrapper });

    const element = getByText("contextMenu-node");
    expect(element).toBeDefined();
    expect(element.textContent).toBe("contextMenu-node");
  });

  it("should render search tool", async () => {
    const data = cloneDeep(nodesMock.data[1]);
    data.configuration = {};
    const nodeMock = DBNodeToReactFlowNode(data);
    const nodeMockProps = { ...nodeMock, xPos: "", yPos: "" };

    const { getByRole, getByPlaceholderText } = render(<ContextMenuNode {...nodeMockProps} />, { wrapper });

    const wrapSearch = getByRole("search");
    expect(wrapSearch).toBeDefined();

    const searchInput = getByPlaceholderText("Buscar");
    expect(searchInput).toBeDefined();
    // @ts-ignore
    expect(searchInput.value).toBe("");

    await user.type(searchInput, "Texto");
    // @ts-ignore
    expect(searchInput.value).toBe("Texto");

    const list = getByRole("list");
    expect(list).toBeDefined();
    expect(list.children.length).toBe(1);
    expect(list.children[0].textContent).toBe("Texto");
  });
});
