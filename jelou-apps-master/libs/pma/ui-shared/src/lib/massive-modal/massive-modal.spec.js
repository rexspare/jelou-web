import { render } from "@testing-library/react";
import MassiveModal from "./massive-modal";
describe("MassiveModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<MassiveModal />);
        expect(baseElement).toBeTruthy();
    });
});
