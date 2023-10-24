/** @typedef {import('@nodes/utils/types.nodes').PMANode } PMANodeConfig */
/** @typedef {import('reactflow').Node<PMANodeConfig>} Node */

import { cleanup, render } from "@testing-library/react";
// import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NodePMA } from "./PMA.node";
import { ASSIGNMENT_BY_NAMES, ASSIGNMENT_TYPE_NAMES, LABELS_VALUES } from "./constants.pma";

// const user = userEvent.setup()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }) => (
  <ReactFlowProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ReactFlowProvider>
);

/** @type {Node} node */
const PMANode = {
  id: "node-id",
  type: "PMA",
  position: { x: 0, y: 0 },
  data: {
    configuration: {
      title: "Test PMA",
      teamId: null,
      operatorId: 577,
      assignment: {
        by: ASSIGNMENT_BY_NAMES.OPERATORS,
        type: ASSIGNMENT_TYPE_NAMES.DIRECT,
      },
    },
  },
};

vi.mock("@/Stores/workflow.store", async () => {
  const actual = vi.importActual("@/Stores/workflow.store");

  return {
    ...actual,
    useWorkflowStore: vi.fn().mockReturnValue({ companyId: "135" }),
  };
});

describe("PMA node", () => {
  beforeEach(cleanup);

  it("renders with the correct data", () => {
    const { getByText } = render(<NodePMA {...PMANode} />, { wrapper });

    expect(getByText("Test PMA")).toBeTruthy();
    expect(getByText(LABELS_VALUES[ASSIGNMENT_BY_NAMES.OPERATORS])).toBeTruthy();
    expect(getByText(LABELS_VALUES[ASSIGNMENT_TYPE_NAMES.DIRECT])).toBeTruthy();
    expect(getByText("577")).toBeTruthy();
  });

  it("renders with empty data and selected", async () => {
    // @ts-ignore
    const { getAllByText } = render(<NodePMA {...PMANode} data={{ configuration: {} }} selected={false} />, { wrapper });

    const [assignationTypeSel, assignationBySel] = getAllByText("Selecciona una opción");

    expect(assignationTypeSel).toBeTruthy();
    expect(assignationBySel).toBeTruthy();
  });
});

// describe('PMA node configuration', () => {
//   beforeEach(cleanup)
// })
