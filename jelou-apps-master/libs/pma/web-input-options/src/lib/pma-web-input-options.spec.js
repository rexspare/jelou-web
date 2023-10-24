import { render } from "@testing-library/react";
import PmaWebInputOptions from "./pma-web-input-options";
describe("PmaWebInputOptions", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaWebInputOptions />);
        expect(baseElement).toBeTruthy();
    });
});
