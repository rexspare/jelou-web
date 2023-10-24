import { render } from "@testing-library/react";
import SupportTicketsMenu from "./support-tickets-menu";
describe("SupportTicketsMenu", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SupportTicketsMenu />);
        expect(baseElement).toBeTruthy();
    });
});
