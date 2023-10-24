import { render } from "@testing-library/react";
import HistoryTickets from "./history-tickets";
describe("HistoryTickets", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<HistoryTickets />);
        expect(baseElement).toBeTruthy();
    });
});
