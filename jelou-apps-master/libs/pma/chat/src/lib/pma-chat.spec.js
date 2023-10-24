import { render } from "@testing-library/react";
import PmaChat from "./pma-chat";
describe("PmaChat", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaChat />);
        expect(baseElement).toBeTruthy();
    });
});
