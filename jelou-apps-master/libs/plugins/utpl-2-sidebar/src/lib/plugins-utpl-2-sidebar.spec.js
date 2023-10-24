import { render } from "@testing-library/react";
import PluginsUtpl2Sidebar from "./plugins-utpl-2-sidebar";
describe("PluginsUtpl2Sidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PluginsUtpl2Sidebar />);
        expect(baseElement).toBeTruthy();
    });
});
