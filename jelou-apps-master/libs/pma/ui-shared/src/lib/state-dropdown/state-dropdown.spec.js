import { render } from "@testing-library/react";
import StateDropdown from "./state-dropdown";
describe("StateDropdown", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<StateDropdown />);
        expect(baseElement).toBeTruthy();
    });
});
