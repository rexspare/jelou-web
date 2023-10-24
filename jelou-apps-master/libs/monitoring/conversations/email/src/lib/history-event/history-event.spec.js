import { render } from "@testing-library/react";
import HistoryEvent from "./history-event";
describe("HistoryEvent", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<HistoryEvent />);
        expect(baseElement).toBeTruthy();
    });
});
