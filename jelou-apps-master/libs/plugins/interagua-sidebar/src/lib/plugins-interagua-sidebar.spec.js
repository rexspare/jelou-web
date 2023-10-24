import { render } from "@testing-library/react";
import PluginsInteraguaSidebar from "./plugins-interagua-sidebar";
describe("PluginsInteraguaSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PluginsInteraguaSidebar />);
        expect(baseElement).toBeTruthy();
    });
});
