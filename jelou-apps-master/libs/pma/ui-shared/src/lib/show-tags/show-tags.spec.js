import { render } from "@testing-library/react";
import ShowTags from "./show-tags";
describe("ShowTags", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ShowTags />);
        expect(baseElement).toBeTruthy();
    });
});
