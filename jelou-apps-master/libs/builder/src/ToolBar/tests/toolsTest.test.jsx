import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToolExecutionRepository } from "@services/tools";
import { FormExecutionTools } from "@toolbar/Tools/FromTest.tools";
import { VisualOutput } from "@toolbar/Tools/ResponseOutput";
import { TestTool } from "@toolbar/Tools/Test.tools";
import { TestInputRepository } from "@toolbar/Tools/TestInputRepository";
import { INPUTS_TYPES, userMock } from "@toolbar/constants.toolbar";

const user = userEvent.setup();
const inputs = [
    {
        createdAt: "2021-08-31T17:00:00.000Z",
        deletedAt: null,
        description: "Input 1",
        displayName: "Input 1",
        id: 1,
        name: "input1",
        required: true,
        state: true,
        toolId: 1,
        type: INPUTS_TYPES.STRING,
        updatedAt: "2021-08-31T17:00:00.000Z",
    },
    {
        createdAt: "2021-08-31T17:00:00.000Z",
        deletedAt: null,
        description: "Input 2",
        displayName: "Input 2",
        id: 2,
        name: "input2",
        required: true,
        state: true,
        toolId: 1,
        type: INPUTS_TYPES.BOOLEAN,
        updatedAt: "2021-08-31T17:00:00.000Z",
    },
    {
        createdAt: "2021-08-31T17:00:00.000Z",
        deletedAt: null,
        description: "Input 3",
        displayName: "Input 3",
        id: 3,
        name: "input3",
        required: true,
        state: true,
        toolId: 1,
        type: INPUTS_TYPES.NUMBER,
        updatedAt: "2021-08-31T17:00:00.000Z",
    },
];

const outputExecutedMock = {
    id: 1,
    name: "outputTes",
    description: "output test",
    type: INPUTS_TYPES.SUCCESS,
    displayName: "output test",
    required: true,
    toolId: 1,
    state: true,
    createdAt: "2021-08-31T17:00:00.000Z",
    updatedAt: "2021-08-31T17:00:00.000Z",
    deletedAt: null,
    value: "test",
};

vi.mock("react-router-dom", () => ({
    useParams: vi.fn().mockReturnValue({ toolkitId: "3", toolId: "21" }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

describe("Form Test tools", () => {
    beforeEach(cleanup);

    it("input values are saved to session storage", async () => {
        const setOutputExecuted = vi.fn();
        const handleClearToolTest = vi.fn();
        const getSpy = vi.spyOn(TestInputRepository, "get");
        const saveSpy = vi.spyOn(TestInputRepository, "save");
        getSpy.mockReturnValueOnce({ input1: "value1" });

        const executeSpy = vi.spyOn(ToolExecutionRepository, "execute");
        executeSpy.mockResolvedValueOnce({ executionId: "123", output: outputExecutedMock });

        const { getByText, getByPlaceholderText } = render(
            <FormExecutionTools inputs={inputs} setOutputExecuted={setOutputExecuted} handleClearToolTest={handleClearToolTest} />
        );

        expect(getSpy).toHaveBeenCalledTimes(1);

        const inputData = { input1: "value1", input2: true, input3: "3" };

        await user.click(getByText("Input 2"));
        await user.type(getByPlaceholderText("Escribe aquí tu Input 3"), "3");

        await user.click(getByText("Ejecutar"));
        expect(saveSpy).toHaveBeenCalledTimes(1);

        expect(saveSpy).toHaveBeenCalledWith(inputData);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith("3", "21", { input: inputData, user: userMock });

        expect(setOutputExecuted).toHaveBeenCalledWith({ executionId: "123", output: outputExecutedMock });
    });

    it("errors are displayed when required inputs are left empty", async () => {
        const setOutputExecuted = vi.fn();
        const handleClearToolTest = vi.fn();

        const getSpy = vi.spyOn(TestInputRepository, "get");
        getSpy.mockReturnValueOnce({});

        const { getAllByText, getByText } = render(
            <FormExecutionTools inputs={inputs} setOutputExecuted={setOutputExecuted} handleClearToolTest={handleClearToolTest} />
        );

        await user.click(getByText("Ejecutar"));
        expect(getAllByText("Este campo es requerido")).toHaveLength(3);
    });
});

const outputExecuted = {
    executionId: "123",
    output: {
        name: "testOutput",
        type: INPUTS_TYPES.SUCCESS,
        createdAt: "2021-08-31T17:00:00.000Z",
        deletedAt: null,
        description: "This is a test output",
        displayName: "testOutput",
        id: 1,
        required: true,
        state: true,
        toolId: 1,
        updatedAt: "2021-08-31T17:00:00.000Z",
        value: { message: "Test message" },
    },
};

describe("Response output", () => {
    beforeEach(cleanup);

    // Tests that the ResponseOutput component renders output information correctly.
    it("test_response_output_renders_correctly", () => {
        const { getByText } = render(<VisualOutput output={outputExecuted.output} />);
        expect(getByText("Tipo:")).toBeTruthy();
        expect(getByText("Variable:")).toBeTruthy();
        expect(getByText("Descripción:")).toBeTruthy();
        expect(getByText("Respuesta:")).toBeTruthy();
        expect(getByText("Éxito")).toBeTruthy();
        expect(getByText("testOutput")).toBeTruthy();
        expect(getByText("This is a test output")).toBeTruthy();
        expect(getByText(/"Test message"/i)).toBeTruthy();
        expect(getByText(/"message"/i)).toBeTruthy();
    });

    // Tests that the ResponseOutput component handles undefined output value correctly.
    it("test_response_output_undefined_value", () => {
        const emptyValueOutput = {
            ...outputExecuted.output,
            type: INPUTS_TYPES.FAILED,
            value: undefined,
        };
        const { getByText } = render(<VisualOutput output={emptyValueOutput} />);
        expect(getByText("Tipo:")).toBeTruthy();
        expect(getByText("Variable:")).toBeTruthy();
        expect(getByText("Descripción:")).toBeTruthy();
        expect(getByText("Respuesta:")).toBeTruthy();
        expect(getByText("Error")).toBeTruthy();
        expect(getByText("testOutput")).toBeTruthy();
        expect(getByText("This is a test output")).toBeTruthy();
        expect(getByText(/"undefined"/i)).toBeTruthy();
    });
});

describe("Test tools", () => {
    beforeEach(cleanup);
    // Tests that the TestTool component renders correctly with all expected elements and buttons.
    it("test_modal_headless_renders_correctly", () => {
        const onClose = vi.fn();
        const isOpenTestTool = true;
        const { getByText } = render(<TestTool isOpenTestTool={isOpenTestTool} onClose={onClose} />, { wrapper });
        expect(getByText("Probar Tool")).toBeTruthy();
        expect(getByText("Input")).toBeTruthy();
        expect(getByText("Formulario")).toBeTruthy();
        expect(getByText("Código")).toBeTruthy();
        expect(getByText("Salir")).toBeTruthy();
        expect(getByText("Publicar herramienta")).toBeTruthy();
    });

    it("change inputs view correctly code and form", async () => {
        const onClose = vi.fn();
        const isOpenTestTool = true;
        const { getByText } = render(<TestTool isOpenTestTool={isOpenTestTool} onClose={onClose} />, { wrapper });

        const codeBtn = getByText("Código");
        const formBtn = getByText("Formulario");

        expect(codeBtn).toBeTruthy();
        expect(formBtn).toBeTruthy();

        expect(getByText("form test tools")).toBeTruthy();

        await user.click(codeBtn);
        expect(getByText("code test tools")).toBeTruthy();
    });
});
