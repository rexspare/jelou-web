import { render } from "@testing-library/react";
import PluginsDatafastSidebar from "./plugins-datafast-sidebar";
describe("PluginsDatafastSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PluginsDatafastSidebar />);
        expect(baseElement).toBeTruthy();
    });
});
