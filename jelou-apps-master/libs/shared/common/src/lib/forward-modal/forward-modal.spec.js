import { render } from "@testing-library/react";
import ForwardModal from "./forward-modal";
describe("ForwardModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ForwardModal />);
        expect(baseElement).toBeTruthy();
    });
});
