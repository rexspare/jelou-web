import { render } from "@testing-library/react";
import EmailPreviewModal from "./email-preview-modal";
describe("EmailPreviewModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<EmailPreviewModal />);
        expect(baseElement).toBeTruthy();
    });
});
