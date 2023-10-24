import { render } from "@testing-library/react";
import FormModal from "./form-modal";
describe("FormModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<FormModal />);
        expect(baseElement).toBeTruthy();
    });
});
