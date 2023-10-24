import { render } from "@testing-library/react";
import UpdateTempalte from "./update-tempalte";
describe("UpdateTempalte", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<UpdateTempalte />);
        expect(baseElement).toBeTruthy();
    });
});
