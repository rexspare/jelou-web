import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

import { mockReactFlow } from "../../e2e/Mocks/reactflow";
import { CreateInput } from "../Tools/Createinput";
import { DeleteInput } from "../Tools/Delete.input";
import { Input } from "../Tools/Inputs.tools";
import { UpdateInput } from "../Tools/Update.input";

const user = userEvent.setup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

jest.mock("react-router-dom", () => ({
  useParams: jest.fn().mockReturnValue({ toolkitId: "3", toolId: "21" }),
}));

const renderMessageMock = jest.fn();

jest.mock("@common/Toastify", async () => {
  const actual = await jest.requireActual("@common/Toastify");
  return {
    ...actual,
    renderMessage: jest.fn().mockImplementation((message, type) => {
      renderMessageMock(message, type);
    }),
  };
});

describe("Create input", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("input creation is successful", async () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<CreateInput isOpenCreateInput onClose={onClose} />, { wrapper });

    const nameInput = getByLabelText("Nombre");
    const variableInput = getByLabelText("Variable");
    const descriptionInput = getByLabelText("Descripción");
    const createButton = getByText("Crear");

    await user.type(nameInput, "test");
    await user.type(variableInput, "test");

    const typeField = getByText("Selecciona un tipo");
    await user.click(typeField);
    await user.click(getByText("Texto"));
    expect(getByText("option Texto, selected.")).toBeTruthy();

    await user.type(descriptionInput, "test");
    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(renderMessageMock).toHaveBeenCalledWith("Input creado correctamente", "success");
  });

  it("input creation fails", async () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<CreateInput isOpenCreateInput onClose={onClose} />, { wrapper });

    const nameInput = getByLabelText("Nombre");
    const variableInput = getByLabelText("Variable");
    const descriptionInput = getByLabelText("Descripción");
    const createButton = getByText("Crear");

    await user.type(nameInput, "test");
    await user.type(variableInput, "error");
    await user.type(descriptionInput, "test");

    const typeField = getByText("Selecciona un tipo");
    await user.click(typeField);
    await user.click(getByText("Texto"));
    expect(getByText("option Texto, selected.")).toBeTruthy();

    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0));
    expect(renderMessageMock).toHaveBeenCalledWith(
      "Tuvimos un error al crear este input, por favor intente nuevamente resfrescando la página o comuníquese con un asesor",
      "error"
    );
  });
});

/** @type {InputTypes} */
const input = {
  id: 1,
  name: "test",
  displayName: "test",
  description: "test",
  type: "STRING",
  required: true,
  toolId: 1,
  state: true,
  createdAt: "2021-08-10T15:00:00.000Z",
  updatedAt: "2021-08-10T15:00:00.000Z",
  deletedAt: null,
};

describe("update input", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("input update is successful", async () => {
    const onClose = jest.fn();
    const { getByText } = render(<UpdateInput isOpenUpdateInput inputToUpdate={input} onClose={onClose} />, { wrapper });

    const createButton = getByText("Actualizar");
    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(renderMessageMock).toHaveBeenCalledWith("Input actualizado correctamente", "success");
  });

  it("input update fails", async () => {
    const onClose = jest.fn();

    const inputFails = { ...input, name: "error" };
    const { getByText } = render(<UpdateInput isOpenUpdateInput inputToUpdate={inputFails} onClose={onClose} />, { wrapper });

    const createButton = getByText("Actualizar");
    await user.click(createButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0));
    expect(renderMessageMock).toHaveBeenCalledWith(
      "Error al actualizar este input, por favor intente nuevamente o comuníquese con un asesor",
      "error"
    );
  });
});

describe("delete input", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("input delete is successful", async () => {
    const onClose = jest.fn();

    const { getByText } = render(<DeleteInput inputToDelete={input} isOpenUpdateInput onClose={onClose} />, { wrapper });

    expect(getByText("¿Deseas hacerlo?")).toBeTruthy();

    const deleteButton = getByText("Si, deseo eliminar");
    await user.click(deleteButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(renderMessageMock).toHaveBeenCalledWith("Input eliminado correctamente", "success");
  });

  it("input delete fails", async () => {
    const onClose = jest.fn();

    const inputFails = { ...input, id: 0 };
    const { getByText } = render(<DeleteInput inputToDelete={inputFails} isOpenUpdateInput onClose={onClose} />, { wrapper });

    expect(getByText("¿Deseas hacerlo?")).toBeTruthy();

    const deleteButton = getByText("Si, deseo eliminar");
    await user.click(deleteButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0));
    expect(renderMessageMock).toHaveBeenCalledWith("Error al eliminar este input, por favor intente nuevamente o comuniquese con un asesor", "error");
  });
});

describe("inputs tools", () => {
  beforeEach(() => {
    cleanup();
    mockReactFlow();
  });

  it("renders the input data correctly", async () => {
    const showInput = {
      ...input,
      displayName: "Test Input",
    };

    const handleOpenDeleteInputModal = jest.fn();
    const handleOpenUpdateInputModal = jest.fn();

    const { getByText } = render(
      <Input input={showInput} handleOpenDeleteInputModal={handleOpenDeleteInputModal} handleOpenUpdateInputModal={handleOpenUpdateInputModal} />
    );

    expect(getByText("Test Input")).toBeTruthy();
    expect(getByText("Variable:")).toBeTruthy();

    const munuBtn = getByText("menuHeadlessBtn");
    expect(munuBtn).toBeTruthy();

    await user.click(munuBtn);

    expect(getByText("Editar")).toBeTruthy();
    expect(getByText("Eliminar")).toBeTruthy();

    await user.click(getByText("Editar"));
    expect(handleOpenUpdateInputModal).toHaveBeenCalledTimes(1);
    expect(handleOpenUpdateInputModal).toHaveBeenCalledWith(showInput);

    await user.click(munuBtn);
    await user.click(getByText("Eliminar"));
    expect(handleOpenDeleteInputModal).toHaveBeenCalledTimes(1);
    expect(handleOpenDeleteInputModal).toHaveBeenCalledWith(showInput);
  });
});
