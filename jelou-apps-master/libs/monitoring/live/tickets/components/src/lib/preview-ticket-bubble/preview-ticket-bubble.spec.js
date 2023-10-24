import { render } from "@testing-library/react";
import PreviewTicketBubble from "./preview-ticket-bubble";
describe("PreviewTicketBubble", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PreviewTicketBubble />);
        expect(baseElement).toBeTruthy();
    });
});
