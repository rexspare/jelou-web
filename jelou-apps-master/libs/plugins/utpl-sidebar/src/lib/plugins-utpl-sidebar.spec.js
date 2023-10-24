import { render } from "@testing-library/react";
import PluginsUtplSidebar from "./plugins-utpl-sidebar";
describe("PluginsUtplSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PluginsUtplSidebar />);
        expect(baseElement).toBeTruthy();
    });
});
