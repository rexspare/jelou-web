import { render } from "@testing-library/react";
import PostRoom from "./post-room";
describe("PostRoom", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PostRoom />);
        expect(baseElement).toBeTruthy();
    });
});
