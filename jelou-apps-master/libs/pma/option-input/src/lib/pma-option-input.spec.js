import { render } from "@testing-library/react";
import PmaOptionInput from "./pma-option-input";
describe("PmaOptionInput", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaOptionInput />);
        expect(baseElement).toBeTruthy();
    });
});
