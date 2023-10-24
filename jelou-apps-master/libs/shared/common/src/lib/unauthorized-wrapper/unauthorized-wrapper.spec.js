import { render } from "@testing-library/react";
import UnauthorizedWrapper from "./unauthorized-wrapper";
describe("UnauthorizedWrapper", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<UnauthorizedWrapper />);
        expect(baseElement).toBeTruthy();
    });
});
