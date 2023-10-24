import { render } from "@testing-library/react";
import PluginsOscusSidebar from "./plugins-oscus-sidebar";
describe("PluginsOscusSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PluginsOscusSidebar />);
        expect(baseElement).toBeTruthy();
    });
});
