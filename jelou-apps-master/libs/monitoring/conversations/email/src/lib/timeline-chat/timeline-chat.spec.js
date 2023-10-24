import { render } from "@testing-library/react";
import TimelineChat from "./timeline-chat";
describe("TimelineChat", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<TimelineChat />);
        expect(baseElement).toBeTruthy();
    });
});
