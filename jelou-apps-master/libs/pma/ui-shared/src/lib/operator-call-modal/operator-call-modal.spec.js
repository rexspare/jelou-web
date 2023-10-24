import { render } from "@testing-library/react";
import OperatorCallModal from "./operator-call-modal";
describe("OperatorCallModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<OperatorCallModal />);
        expect(baseElement).toBeTruthy();
    });
});
