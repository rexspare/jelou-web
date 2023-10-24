import { render } from "@testing-library/react";
import PostAvatar from "./post-avatar";
describe("PostAvatar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PostAvatar />);
        expect(baseElement).toBeTruthy();
    });
});
