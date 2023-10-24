import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { contactMock, nodesMock } from "@mocks/data";

import { ContactBlockPanel } from "@nodes/Message/configPanel/Contact";
import { FieldView } from "@nodes/Message/configPanel/Contact/views/Field";

const mediaBlockProps = {
  bubbleId: 1,
  dataNode: { id: "1", data: nodesMock.data[1] },
  contacts: contactMock,
};

const fieldViewProps = {
  handleReturnView: vi.fn(),
  contact: contactMock[0],
  type: "emails",
  handleSaveContactBlock: vi.fn(),
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

describe("MediaBlockModal", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should change to email view when clicking the email menu", async () => {
    // @ts-ignore
    render(<ContactBlockPanel {...mediaBlockProps} />, { wrapper });
    const mailBtn = screen.getByText("Correo electrónico");
    fireEvent.click(mailBtn);
    expect(screen.getByText("Solo puedes agregar hasta 2 correos electrónicos")).toBeTruthy();
  });

  it("should change to phone view when clicking the phone menu", async () => {
    // @ts-ignore
    render(<ContactBlockPanel {...mediaBlockProps} />, { wrapper });
    const phoneBtn = screen.getByText("Teléfono");
    fireEvent.click(phoneBtn);
    expect(screen.getByText("Solo puedes agregar hasta 3 teléfonos")).toBeTruthy();
  });

  it("should change to address view when clicking the address menu", async () => {
    // @ts-ignore
    render(<ContactBlockPanel {...mediaBlockProps} />, { wrapper });
    const addressBtn = screen.getByText("Dirección");
    fireEvent.click(addressBtn);
    expect(screen.getByText("Solo puedes agregar hasta 2 direcciones")).toBeTruthy();
  });

  it("should change to social media view when clicking the social menu", async () => {
    // @ts-ignore
    render(<ContactBlockPanel {...mediaBlockProps} />, { wrapper });
    const socialBtn = screen.getByText("Sitios Web");
    fireEvent.click(socialBtn);
    expect(screen.getByText("Solo puedes agregar hasta 2 sitios web")).toBeTruthy();
  });

  it("should render the fields on the main contact form", () => {
    // @ts-ignore
    render(<ContactBlockPanel {...mediaBlockProps} />, { wrapper });
    expect(screen.getByText("Correo electrónico")).toBeTruthy();
    expect(screen.getByText("davidperjac@hotmail.com")).toBeTruthy();
  });
});

describe("Field Views saves", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should appear the add fields button if the max havent been reach", () => {
    render(<FieldView {...fieldViewProps} />, { wrapper });
    expect(screen.getByText("+ Agrega nuevo correo electrónico")).toBeTruthy();
  });

  it("should not appear the add fields if the max have been reach", () => {
    fieldViewProps.contact.emails = [
      { id: "1", email: "", type: "" },
      { id: "2", email: "", type: "" },
    ];
    render(<FieldView {...fieldViewProps} />, { wrapper });
    expect(screen.queryByText("+ Agrega nuevo correo electrónico")).toBeFalsy();
    fieldViewProps.contact.emails = [{ id: "1", email: "", type: "" }];
  });

  it("should save when completing the fields on a contact field", async () => {
    render(<FieldView {...fieldViewProps} />, { wrapper });

    const input = screen.getByLabelText("Correo electrónico");
    fireEvent.change(input, { target: { value: "david@jelou.ai" } });

    const type = screen.getByText("Selecciona una opción");
    fireEvent.keyDown(type, { key: "ArrowDown", code: 40 });
    // eslint-disable-next-line no-unused-expressions
    await waitFor(() => {
      () => screen.getByText("Trabajo");
    });
    fireEvent.click(screen.getByText("Trabajo"));

    await waitFor(() => {
      expect(fieldViewProps.handleSaveContactBlock).toHaveBeenCalled();
    });
  });
});

describe("Field Views errors", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should show an error if the email is not valid", async () => {
    render(<FieldView {...fieldViewProps} />, { wrapper });

    const input = screen.getByLabelText("Correo electrónico");
    fireEvent.change(input, { target: { value: "david" } });

    const type = screen.getByText("Selecciona una opción");
    fireEvent.keyDown(type, { key: "ArrowDown", code: 40 });
    // eslint-disable-next-line no-unused-expressions
    await waitFor(() => {
      () => screen.getByText("Trabajo");
    });
    fireEvent.click(screen.getByText("Trabajo"));

    await waitFor(() => {
      expect(screen.getByText("Este email no es válido")).toBeTruthy();
    });
  });

  it("should show an error if the phone is not valid", async () => {
    fieldViewProps.type = "phones";
    render(<FieldView {...fieldViewProps} />, { wrapper });

    const input = screen.getByLabelText("Número de teléfono");
    fireEvent.change(input, { target: { value: "123" } });

    const type = screen.getByText("Selecciona una opción");
    fireEvent.keyDown(type, { key: "ArrowDown", code: 40 });
    // eslint-disable-next-line no-unused-expressions
    await waitFor(() => {
      () => screen.getByText("Trabajo");
    });
    fireEvent.click(screen.getByText("Trabajo"));

    await waitFor(() => {
      expect(screen.getByText("Este número no es válido")).toBeTruthy();
    });
  });

  it("should show an error if the address is not valid", async () => {
    fieldViewProps.type = "addresses";
    render(<FieldView {...fieldViewProps} />, { wrapper });

    const input = screen.getByLabelText("Dirección");
    fireEvent.change(input, {
      target: {
        value:
          "Utility classes help you work within the constraints of a system instead of littering your stylesheets with arbitrary values. They make it easy to be consistent with color choices, spacing, typography, shadows, and everything else that makes up a well-engineered design system.",
      },
    });

    const type = screen.getByText("Selecciona una opción");
    fireEvent.keyDown(type, { key: "ArrowDown", code: 40 });
    // eslint-disable-next-line no-unused-expressions
    await waitFor(() => {
      () => screen.getByText("Trabajo");
    });
    fireEvent.click(screen.getByText("Trabajo"));

    await waitFor(() => {
      expect(screen.getByText("Esta dirección no es válida")).toBeTruthy();
    });
  });

  it("should show an error if the URLS is not valid", async () => {
    fieldViewProps.type = "urls";
    render(<FieldView {...fieldViewProps} />, { wrapper });

    const input = screen.getByLabelText("Sitio web");
    fireEvent.change(input, { target: { value: "david" } });

    const type = screen.getByText("Selecciona una opción");
    fireEvent.keyDown(type, { key: "ArrowDown", code: 40 });
    // eslint-disable-next-line no-unused-expressions
    await waitFor(() => {
      () => screen.getByText("Trabajo");
    });
    fireEvent.click(screen.getByText("Trabajo"));

    await waitFor(() => {
      expect(screen.getByText("Esta URL no es válida")).toBeTruthy();
    });
  });
});
