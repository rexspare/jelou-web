import { render } from "@testing-library/react";
import PmaSidebar from "./pma-sidebar";
describe("PmaSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PmaSidebar />);
        expect(baseElement).toBeTruthy();
    });
});
