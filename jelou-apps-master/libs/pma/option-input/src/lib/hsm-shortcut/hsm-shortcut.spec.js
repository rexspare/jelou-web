import { render } from "@testing-library/react";
import HsmShortcut from "./hsm-shortcut";
describe("HsmShortcut", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<HsmShortcut />);
        expect(baseElement).toBeTruthy();
    });
});
