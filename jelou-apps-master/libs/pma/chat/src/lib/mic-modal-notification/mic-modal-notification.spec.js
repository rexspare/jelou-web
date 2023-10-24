import { render } from "@testing-library/react";
import MicModalNotification from "./mic-modal-notification";
describe("MicModalNotification", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<MicModalNotification />);
        expect(baseElement).toBeTruthy();
    });
});
