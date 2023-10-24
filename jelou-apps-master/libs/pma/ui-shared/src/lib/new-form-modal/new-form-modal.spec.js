import { render } from "@testing-library/react";
import NewFormModal from "./new-form-modal";
describe("NewFormModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<NewFormModal />);
        expect(baseElement).toBeTruthy();
    });
});
