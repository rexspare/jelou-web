import { render } from "@testing-library/react";
import UnauthorizedView from "./unauthorized-view";
describe("UnauthorizedView", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<UnauthorizedView />);
        expect(baseElement).toBeTruthy();
    });
});
