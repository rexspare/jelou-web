import { render } from "@testing-library/react";
import EmailBubble from "./email-bubble";
describe("EmailBubble", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<EmailBubble />);
        expect(baseElement).toBeTruthy();
    });
});
