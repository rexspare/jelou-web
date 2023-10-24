/** @typedef {import('@nodes/utils/types.nodes').IfErrorNode} IfErrorNode */
/** @typedef {import('reactflow').Node<IfErrorNode>} Node */

import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ERRORS_PMA, ERRORS_VALUES } from "../PMA/constants.pma";
import { IfErrorNode } from "./IFError.node";
import { IfErrorConfigNode } from "./IfError.config";

const wrapper = ({ children }) => <ReactFlowProvider>{children}</ReactFlowProvider>;

const user = userEvent.setup();

/** @type {IfErrorNode} */
const ifErrorNodeData = {
    configuration: {
        collapsed: false,
        title: "Test Title",
        terms: [
            {
                operator: "",
                value1: "",
                value2: ERRORS_VALUES.GENERAL,
            },
        ],
    },
};

/** @type {Node} */
const ifErrorNode = {
    id: "1",
    type: "ifError",
    position: { x: 0, y: 0 },
    data: ifErrorNodeData,
};

describe("If error node", () => {
    beforeEach(cleanup);

    it("should render with the correctly data", () => {
        const { getByText } = render(<IfErrorNode {...ifErrorNode} />, { wrapper });

        expect(getByText(ifErrorNodeData.configuration.title)).toBeTruthy();

        const errorLabel = ERRORS_PMA.find((error) => error.value === ERRORS_VALUES.GENERAL).label;
        expect(getByText(errorLabel)).toBeTruthy();
    });

    it("should render message when error is not selected", () => {
        const emptyError = {
            configuration: {
                title: "Test Title",
                terms: [
                    {
                        operator: "",
                        value1: "",
                        value2: "",
                    },
                ],
            },
        };

        const { getByText } = render(<IfErrorNode {...ifErrorNode} data={emptyError} />, { wrapper });

        expect(getByText("Por favor seleccione un error")).toBeTruthy();
    });
});

vi.mock("@/Stores", async () => {
    const actual = await vi.importActual("@/Stores");

    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...actual,
        useWorkflowStore: vi.fn().mockReturnValue({
            id: "1",
        }),
    };
});

const { sendUpdateNodeMock } = vi.hoisted(() => ({ sendUpdateNodeMock: vi.fn() }));

vi.mock("@hooks/customNodes.hook", () => ({
    useCustomsNodes: () => ({
        updateLocalNode: sendUpdateNodeMock,
    }),
}));

describe("If error node config", () => {
    beforeEach(cleanup);

    it("should render with the correctly data", () => {
        const { getByText } = render(<IfErrorConfigNode dataNode={ifErrorNode} />, { wrapper });
        expect(getByText("Acción del botón")).toBeTruthy();
        expect(getByText("Error general"));
    });

    it("should render message when error is not selected and select one", async () => {
        /** @type {Node} */
        const emptyError = {
            ...ifErrorNode,
            data: {
                configuration: {
                    collapsed: false,
                    title: "Test Title",
                    terms: [
                        {
                            operator: "",
                            value1: "",
                            value2: "",
                        },
                    ],
                },
            },
        };

        const { getByText } = render(<IfErrorConfigNode dataNode={emptyError} />, { wrapper });

        await user.click(getByText("Selecione el tipo de botón"));
        await user.click(getByText("Operador no disponible"));

        expect(sendUpdateNodeMock).toHaveBeenCalledOnce();
        const configData = {
            ...emptyError.data.configuration,
            terms: [
                {
                    operator: "",
                    value1: "",
                    value2: ERRORS_VALUES.OPERATOR_NOT_FOUND,
                },
            ],
        };
        expect(sendUpdateNodeMock).toHaveBeenCalledWith(emptyError.id, { configuration: configData });
    });
});
