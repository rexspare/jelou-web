import { render } from "@testing-library/react";
import PmaInbox from "./pma-inbox";
describe("PmaInbox", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaInbox />);
        expect(baseElement).toBeTruthy();
    });
});
