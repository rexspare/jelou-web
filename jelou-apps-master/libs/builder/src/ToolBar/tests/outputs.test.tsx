import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactFlowProvider } from "reactflow";

import { TOOLS_KEY_RQ } from "../../constants.local";
import { mockReactFlow } from "../../e2e/Mocks/reactflow";
import { CreateOutput } from "../Tools/Create.output";
import { DeleteOutput } from "../Tools/Delete.output";
import { Output } from "../Tools/Outputs.admin";
import { UpdateOutput } from "../Tools/Update.output";

// TODO: FIX THIS TEST

const user = userEvent.setup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ReactFlowProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ReactFlowProvider>
);

jest.mock("react-router-dom", () => ({
  useParams: jest.fn().mockReturnValue({ toolkitId: "3", toolId: "21" }),
}));

// const { renderMessageMock } = jest.hoisted(() => ({ renderMessageMock: jest.fn() }));

// jest.mock("@common/Toastify", async () => {
//   const actual = await jest.importActual("@common/Toastify");
//   return {
//     ...actual,
//     renderMessage: renderMessageMock,
//   };
// });

// jest.mock("@/Stores", async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     ...actual,
//     useWorkflowStore: jest.fn().mockReturnValue({
//       id: "1",
//     }),
//   };
// });

describe("Create output", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("should create output", async () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<CreateOutput isOpenCreateOutput onClose={onClose} />, { wrapper });

    const nameoutput = getByLabelText("Nombre");
    const variableoutput = getByLabelText("Variable");
    const descriptionoutput = getByLabelText("Descripción");
    const createButton = getByText("Crear");

    await user.type(nameoutput, "test");
    await user.type(variableoutput, "test");

    const typeField = getByText("Selecciona un tipo");
    await user.click(typeField);
    await user.click(getByText("Éxito"));
    expect(getByText("option Éxito, selected.")).toBeTruthy();

    await user.type(descriptionoutput, "test");
    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    // expect(renderMessageMock).toHaveBeenCalledWith("Output creado correctamente", "success");
  });

  it("output creation fails", async () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<CreateOutput isOpenCreateOutput onClose={onClose} />, { wrapper });

    const nameoutput = getByLabelText("Nombre");
    const variableoutput = getByLabelText("Variable");
    const descriptionoutput = getByLabelText("Descripción");
    const createButton = getByText("Crear");

    await user.type(nameoutput, "test");
    await user.type(variableoutput, "error");
    await user.type(descriptionoutput, "test");

    const typeField = getByText("Selecciona un tipo");
    await user.click(typeField);
    await user.click(getByText("Éxito"));
    expect(getByText("option Éxito, selected.")).toBeTruthy();

    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0));
    // expect(renderMessageMock).toHaveBeenCalledWith(
    // "Tuvimos un error al crear este output, por favor intente nuevamente resfrescando la página o comuníquese con un asesor",
    // "error"
    // );
  });

  it("You can only create one success output", async () => {
    queryClient.setQueryData([TOOLS_KEY_RQ, "3", "21"], toolMock);

    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<CreateOutput isOpenCreateOutput onClose={onClose} />, { wrapper });

    const nameoutput = getByLabelText("Nombre");
    const variableoutput = getByLabelText("Variable");
    const descriptionoutput = getByLabelText("Descripción");
    const createButton = getByText("Crear");

    await user.type(nameoutput, "test");
    await user.type(variableoutput, "test");
    const typeField = getByText("Selecciona un tipo");
    await user.click(typeField);
    await user.click(getByText("Éxito"));
    expect(getByText("option Éxito, selected.")).toBeTruthy();

    await user.type(descriptionoutput, "test");
    await user.click(createButton);

    // expect(renderMessageMock).toHaveBeenCalledWith('Solo puede haber un output de tipo "success"', "error");
  });
});

/**
 * @type {Output}
 */
const output = {
  id: 1,
  name: "test",
  createdAt: "2021-08-10T15:00:00.000Z",
  updatedAt: "2021-08-10T15:00:00.000Z",
  description: "test",
  deletedAt: null,
  displayName: "test",
  required: true,
  state: true,
  toolId: 1,
  type: "SUCCESS",
};

describe("update outputs", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("outputs update is successful", async () => {
    const onClose = jest.fn();
    const { getByText } = render(<UpdateOutput isOpenUpdateOutput outputToUpdate={output} onClose={onClose} />, { wrapper });

    const createButton = getByText("Actualizar");
    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    // expect(renderMessageMock).toHaveBeenCalledWith("Output actualizado correctamente", "success");
  });

  it("Output update fails", async () => {
    const onClose = jest.fn();

    const outputFails = { ...output, name: "error" };
    const { getByText } = render(<UpdateOutput isOpenUpdateOutput outputToUpdate={outputFails} onClose={onClose} />, { wrapper });

    const createButton = getByText("Actualizar");
    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0));
    // expect(renderMessageMock).toHaveBeenCalledWith(
    //   "Error al actualizar este output, por favor intente nuevamente o comuníquese con un asesor",
    //   "error"
    // );
  });
});

describe("delete outputs", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("Output delete is successful", async () => {
    const onClose = jest.fn();

    const { getByText } = render(<DeleteOutput isOpenDeleteOutput outputToDelete={output} onClose={onClose} />, { wrapper });

    expect(getByText("¿Deseas hacerlo?")).toBeTruthy();

    const deleteButton = getByText("Si, deseo eliminar");
    await user.click(deleteButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    // expect(renderMessageMock).toHaveBeenCalledWith("Output eliminado correctamente", "success");
  });

  it("Output delete fails", async () => {
    const onClose = jest.fn();

    const outputFails = { ...output, id: 0 };
    const { getByText } = render(<DeleteOutput isOpenDeleteOutput outputToDelete={outputFails} onClose={onClose} />, { wrapper });

    expect(getByText("¿Deseas hacerlo?")).toBeTruthy();

    const deleteButton = getByText("Si, deseo eliminar");
    await user.click(deleteButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0));
    // expect(renderMessageMock).toHaveBeenCalledWith(
    //   "Tuvimos un error al eliminar este output, por favor intente nuevamente resfrescando la página o comuníquese con un asesor",
    //   "error"
    // );
  });
});

describe("outputs tools", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("renders the outputs data correctly", async () => {
    const showOutput = {
      ...output,
      displayName: "Test Input",
    };

    const handleOpenDeleteOutputModal = jest.fn();
    const handleOpenUpdateOutputModal = jest.fn();

    const { getByText } = render(
      <Output
        handleOpenDeleteOutputModal={handleOpenDeleteOutputModal}
        handleOpenUpdateOutputModal={handleOpenUpdateOutputModal}
        output={showOutput}
      />,
      { wrapper }
    );

    expect(getByText("Test Input")).toBeTruthy();

    const munuBtn = getByText("menuHeadlessBtn");
    expect(munuBtn).toBeTruthy();

    await user.click(munuBtn);

    expect(getByText("Editar")).toBeTruthy();
    expect(getByText("Eliminar")).toBeTruthy();

    await user.click(getByText("Editar"));
    expect(handleOpenUpdateOutputModal).toHaveBeenCalledTimes(1);
    expect(handleOpenUpdateOutputModal).toHaveBeenCalledWith(showOutput);

    await user.click(munuBtn);
    await user.click(getByText("Eliminar"));
    expect(handleOpenDeleteOutputModal).toHaveBeenCalledTimes(1);
    expect(handleOpenDeleteOutputModal).toHaveBeenCalledWith(showOutput);
  });
});
