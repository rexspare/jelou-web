import { render } from "@testing-library/react";
import SupportTicketsTable from "./support-tickets-table";
describe("SupportTicketsTable", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SupportTicketsTable />);
        expect(baseElement).toBeTruthy();
    });
});
