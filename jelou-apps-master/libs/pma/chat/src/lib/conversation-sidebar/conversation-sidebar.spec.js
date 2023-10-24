import { render } from "@testing-library/react";
import ConversationSidebar from "./conversation-sidebar";
describe("ConversationSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ConversationSidebar />);
        expect(baseElement).toBeTruthy();
    });
});
