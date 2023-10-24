import { render } from "@testing-library/react";
import SearchRoom from "./search-room";
describe("SearchRoom", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SearchRoom />);
        expect(baseElement).toBeTruthy();
    });
});
