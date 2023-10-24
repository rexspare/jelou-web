import { render } from "@testing-library/react";
import EmailView from "./email-view";
describe("EmailView", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<EmailView />);
        expect(baseElement).toBeTruthy();
    });
});
