import { render } from "@testing-library/react";
import PmaBubbles from "./pma-bubbles";
describe("PmaBubbles", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaBubbles />);
        expect(baseElement).toBeTruthy();
    });
});
