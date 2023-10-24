import { render } from "@testing-library/react";
import QuickReplyModal from "./quick-reply-modal";
describe("QuickReplyModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<QuickReplyModal />);
        expect(baseElement).toBeTruthy();
    });
});
