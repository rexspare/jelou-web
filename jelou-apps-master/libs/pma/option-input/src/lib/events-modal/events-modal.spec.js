import { render } from "@testing-library/react";
import EventsModal from "./events-modal";
describe("EventsModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<EventsModal />);
        expect(baseElement).toBeTruthy();
    });
});
