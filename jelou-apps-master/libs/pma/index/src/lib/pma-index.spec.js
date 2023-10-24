import { render } from "@testing-library/react";
import PmaIndex from "./pma-index";
describe("PmaIndex", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaIndex />);
        expect(baseElement).toBeTruthy();
    });
});
