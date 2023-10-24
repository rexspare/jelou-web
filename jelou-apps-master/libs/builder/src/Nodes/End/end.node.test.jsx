import { cleanup, render } from "@testing-library/react";
import { OUTPUT_TYPES } from "@toolbar/constants.toolbar";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TOOLS_KEY_RQ } from "@/constants.local";
import { EndNode } from "./End.node";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const tool = {
    Outputs: [
        {
            id: 1,
            displayName: "Output 1",
            description: "This is output 1",
            type: OUTPUT_TYPES.SUCCESS,
        },
        {
            id: 2,
            displayName: "Output 2",
            description: "This is output 2",
            type: OUTPUT_TYPES.FAILED,
        },
        {
            id: 3,
            displayName: "Output 1",
            description: "This is output 1",
            type: "INVALID_TYPE",
        },
    ],
};

vi.mock("react-router-dom", () => ({
    useParams: vi.fn().mockReturnValue({ toolkitId: "3", toolId: "21" }),
}));

const { sendUpdateNodeMock } = vi.hoisted(() => ({ sendUpdateNodeMock: vi.fn() }));

vi.mock("@hooks/customNodes.hook", () => ({
    useCustomsNodes: () => ({
        updateLocalNode: sendUpdateNodeMock,
    }),
}));

queryClient.setQueryData([TOOLS_KEY_RQ, "3", "21"], tool);

const wrapper = ({ children }) => (
    <ReactFlowProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReactFlowProvider>
);

describe("Node end", () => {
    beforeEach(cleanup);

    it("renders correctly with a SUCCESS output type", () => {
        const data = {
            configuration: {
                outputId: 1,
            },
        };

        const { getByText } = render(<EndNode data={data} id={1} />, { wrapper });

        expect(getByText("Success")).toBeTruthy();
        expect(getByText("Output 1")).toBeTruthy();
        expect(getByText("This is output 1")).toBeTruthy();
    });

    it("renders correctly with a FAILED output type", () => {
        const data = {
            configuration: {
                outputId: 2,
            },
        };

        const { getByText } = render(<EndNode data={data} id={1} />, { wrapper });
        expect(getByText("Error")).toBeTruthy();
        expect(getByText("Output 2")).toBeTruthy();
        expect(getByText("This is output 2")).toBeTruthy();
    });

    it("renders correctly when output is undefined", () => {
        const data = {
            configuration: {
                outputId: 4,
            },
        };

        const { getByText } = render(<EndNode data={data} id={1} />, { wrapper });
        expect(getByText("Error")).toBeTruthy();
    });

    it("renders correctly when output type is not SUCCESS or FAILED", () => {
        const data = {
            configuration: {
                outputId: 3,
            },
        };

        const { getByText } = render(<EndNode data={data} id={1} />, { wrapper });

        expect(getByText("Error")).toBeTruthy();
        expect(getByText("Output 1")).toBeTruthy();
        expect(getByText("This is output 1")).toBeTruthy();
    });
});
