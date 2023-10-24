import { render } from "@testing-library/react";
import LogsTable from "./logs-table";
describe("LogsTable", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<LogsTable />);
        expect(baseElement).toBeTruthy();
    });
});
