import { render } from "@testing-library/react";
import ShowFiles from "./show-files";
describe("ShowFiles", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ShowFiles />);
        expect(baseElement).toBeTruthy();
    });
});
