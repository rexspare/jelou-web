import { render } from "@testing-library/react";
import Context from "./context";
describe("Context", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<Context />);
        expect(baseElement).toBeTruthy();
    });
});
