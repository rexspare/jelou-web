import { render } from "@testing-library/react";
import SkeletonEmail from "./skeleton-email";
describe("SkeletonEmail", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SkeletonEmail />);
        expect(baseElement).toBeTruthy();
    });
});
