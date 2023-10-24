import { render } from "@testing-library/react";
import SendOptions from "./send-options";
describe("SendOptions", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SendOptions />);
        expect(baseElement).toBeTruthy();
    });
});
