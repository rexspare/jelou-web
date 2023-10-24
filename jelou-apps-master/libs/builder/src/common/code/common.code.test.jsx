import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Prism from "prismjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PreviewCode } from "./Preview.code";

const user = userEvent.setup();

describe("PreviewCode", () => {
  beforeEach(cleanup);
  // Tests that the component renders correctly with content and without highlight.
  it("test_renders_component_with_content_and_without_highlight", () => {
    // Arrange
    const content = "const greeting = 'Hello World';";
    const highlight = false;

    // Act
    const { getByText } = render(<PreviewCode content={content} highlight={highlight} />);

    // Assert
    expect(getByText(content)).toBeTruthy();
  });

  // Tests that the component renders correctly without content.
  it("test_renders_component_without_content", () => {
    // Arrange
    const highlight = false;

    // Act
    const { getByRole } = render(<PreviewCode content={null} highlight={highlight} />);

    // Assert
    const codeTag = getByRole("code");
    expect(codeTag).toBeTruthy();
    expect(codeTag.textContent).toBe("");
  });

  // Tests that Prism.highlightElement is called when highlight is true.
  it("test_calls_prism_highlight_element_when_highlight_is_true", () => {
    // Arrange
    const content = "const greeting = 'Hello World';";
    const highlight = true;
    Prism.highlightElement = vi.fn();

    // Act
    render(<PreviewCode content={content} highlight={highlight} />);

    // Assert
    expect(Prism.highlightElement).toHaveBeenCalled();
  });

  // Tests that the ResponseOutput component copies output value to clipboard successfully.
  it("test_response_output_copies_to_clipboard", async () => {
    const clipboard = vi.spyOn(navigator, "clipboard", "get");
    clipboard.mockReturnValue({
      writeText: vi.fn().mockResolvedValueOnce(),
      read: function () {
        throw new Error("Function not implemented.");
      },
      readText: function () {
        throw new Error("Function not implemented.");
      },
      write: function (data) {
        throw new Error("Function not implemented.");
      },
      addEventListener: function (type, callback, options) {
        throw new Error("Function not implemented.");
      },
      dispatchEvent: function (event) {
        throw new Error("Function not implemented.");
      },
      removeEventListener: function (type, callback, options) {
        throw new Error("Function not implemented.");
      },
    });

    const { getByText } = render(<PreviewCode content="Test message" />);
    await user.click(getByText("copy to clicboard"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Test message");
  });
});
