import { render } from "@testing-library/react";
import ViewTemplate from "./view-template";
describe("ViewTemplate", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ViewTemplate />);
        expect(baseElement).toBeTruthy();
    });
});
