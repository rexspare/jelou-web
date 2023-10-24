import { render } from "@testing-library/react";
import Forward from "./forward";
describe("Forward", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<Forward />);
        expect(baseElement).toBeTruthy();
    });
});
