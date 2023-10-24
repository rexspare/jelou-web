import { render } from "@testing-library/react";
import DropZoneFiles from "./DropZoneFiles";
describe("DropZoneFiles", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<DropZoneFiles />);
        expect(baseElement).toBeTruthy();
    });
});
