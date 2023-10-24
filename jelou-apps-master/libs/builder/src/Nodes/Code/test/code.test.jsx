/** @typedef {import('@nodes/utils/types.nodes').Code } CodeTypes */
/** @typedef {import('reactflow').Node<CodeTypes>} Node */

import { cleanup, render } from "@testing-library/react";
// import userEvent from '@testing-library/user-event'
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NODE_TYPES, TITLE_NODES } from "@/constants.local";
import { configByNodeType } from "@nodes/utils/constants.utils-nodes";
import { CodeNode } from "../index";

// const user = userEvent.setup()

/** @type {CodeTypes} */
const codeDataMock = {
  // @ts-ignore
  configuration: {
    ...configByNodeType[NODE_TYPES.CODE],
  },
};

/** @type {Node} */
const codeNodeMock = {
  id: "1",
  type: NODE_TYPES.CODE,
  position: { x: 0, y: 0 },
  data: codeDataMock,
};

const wrapper = ({ children }) => <ReactFlowProvider>{children}</ReactFlowProvider>;

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

describe("Code node", () => {
  beforeEach(cleanup);

  it("should render the code node with the empty data", () => {
    const { getByText } = render(<CodeNode {...codeNodeMock} />, { wrapper });

    expect(getByText(TITLE_NODES[NODE_TYPES.CODE])).toBeTruthy();
    expect(getByText(/Code here/)).toBeTruthy();
  });

  it("should render the code node with the data", () => {
    codeNodeMock.data.configuration = {
      content: 'console.log("Hello world")',
      description: "This is a description",
      title: "This is a title",
      codeInstruction: "",
      instruction: "",
      collapsed: false,
    };

    const { getByText } = render(<CodeNode {...codeNodeMock} />, { wrapper });

    expect(getByText("This is a title")).toBeTruthy();
    expect(getByText("This is a description")).toBeTruthy();
    expect(getByText(/"Hello world"/i)).toBeTruthy();
  });
});

// describe('Code configuration', () => {
//   beforeEach(cleanup)

//   it('should render the code configuration with the empty data', async () => {
//     const node = { ...codeNodeMock }
//     // @ts-ignore
//     node.data.configuration = {}

//     const { getByLabelText } = render(<CodeConfigPanel dataNode={node} />, { wrapper })

//     const descriptionInput = getByLabelText('Descripción')
//     expect(descriptionInput).toBeTruthy()
//     // @ts-ignore
//     expect(descriptionInput.value).toBe('')
//     await user.type(descriptionInput, 'This is a description')
//     // @ts-ignore
//     expect(descriptionInput.value).toBe('This is a description')
//   })
// })
