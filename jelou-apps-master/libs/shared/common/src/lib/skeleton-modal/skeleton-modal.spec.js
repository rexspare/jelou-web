import { render } from "@testing-library/react";
import SkeletonModal from "./skeleton-modal";
describe("SkeletonModal", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SkeletonModal />);
        expect(baseElement).toBeTruthy();
    });
});
