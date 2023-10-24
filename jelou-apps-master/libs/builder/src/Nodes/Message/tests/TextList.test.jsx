import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DBNodeToReactFlowNode } from "@/helpers/utils";
import { nodesMock } from "@mocks/data";
import { TextListPanel } from "@nodes/Message/configPanel/TextList";
import { nanoid } from "nanoid";
import { BUTTONS_OPTIONS_TYPES } from "../constants.message";

const user = userEvent.setup();
const nodeMock = DBNodeToReactFlowNode(nodesMock.data[1]);

const node = {
    ...nodeMock,
    data: {
        configuration: {},
    },
};

const initialOptions = [
    {
        id: nanoid(),
        payload: {
            type: "flow",
            flowId: null,
        },
        title: null,
        type: BUTTONS_OPTIONS_TYPES.POSTBACK,
        url: null,
        description: null,
    },
];

vi.mock("@/Stores", async () => {
    const actual = await vi.importActual("@/Stores");

    return {
        ...actual,
        useWorkflowStore: vi.fn().mockReturnValue({
            id: "1",
        }),
    };
});

describe("TextList configuration message node", () => {
    beforeEach(cleanup);

    it("should render and create option with the empty data", async () => {
        const { getByPlaceholderText, getByText, getAllByText, getByLabelText } = render(
            <ReactFlowProvider>
                <TextListPanel bubbleId="" options={initialOptions} text="" dataNode={node} />
            </ReactFlowProvider>
        );

        const input = getByPlaceholderText("Haz clic para escribir");
        expect(input).toBeTruthy();
        expect(input.value).toBe("");

        await user.type(input, "Hola mundo");
        expect(input.value).toBe("Hola mundo");

        const inputOption = getByLabelText("Nombre de la opción");
        expect(inputOption).toBeTruthy();
        expect(inputOption.value).toBe("");

        await user.type(inputOption, "optionItem");
        expect(inputOption.value).toBe("optionItem");

        expect(getAllByText("optionItem")).toHaveLength(1);
        const addOptionBtn = getByText("+ Agregar nuevo botón");
        expect(addOptionBtn).toBeTruthy();
        await user.click(addOptionBtn);
        expect(getAllByText("optionItem")).toHaveLength(2);
    });
});
