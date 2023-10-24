import { render } from "@testing-library/react";
import Attachments from "./attachments";
describe("Attachments", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<Attachments />);
        expect(baseElement).toBeTruthy();
    });
});
