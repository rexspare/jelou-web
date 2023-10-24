import { render } from "@testing-library/react";
import PmaTimelineChat from "./pma-timeline-chat";
describe("PmaTimelineChat", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaTimelineChat />);
        expect(baseElement).toBeTruthy();
    });
});
