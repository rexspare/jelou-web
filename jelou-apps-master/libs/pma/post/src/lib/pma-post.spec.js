import { render } from "@testing-library/react";
import PmaPost from "./pma-post";
describe("PmaPost", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaPost />);
        expect(baseElement).toBeTruthy();
    });
});
