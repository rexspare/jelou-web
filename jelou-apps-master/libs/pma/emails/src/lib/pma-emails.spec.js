import { render } from "@testing-library/react";
import PmaEmails from "./pma-emails";
describe("PmaEmails", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaEmails />);
        expect(baseElement).toBeTruthy();
    });
});
