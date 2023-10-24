import { render } from "@testing-library/react";
import RenderMessage from "./render-message";
describe("RenderMessage", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<RenderMessage />);
        expect(baseElement).toBeTruthy();
    });
});
