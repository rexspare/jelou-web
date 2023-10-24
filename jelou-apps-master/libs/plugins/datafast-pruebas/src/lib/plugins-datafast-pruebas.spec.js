import { render } from "@testing-library/react";
import PluginsDatafastPruebas from "./plugins-datafast-pruebas";
describe("PluginsDatafastPruebas", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PluginsDatafastPruebas />);
        expect(baseElement).toBeTruthy();
    });
});
