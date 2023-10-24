import { render } from "@testing-library/react";
import ReconnectModal from "./reconnect-modal";
describe("ReconnectModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ReconnectModal />);
        expect(baseElement).toBeTruthy();
    });
});
