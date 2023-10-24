import { render } from "@testing-library/react";
import SettingsBots from "./settings-bots";
describe("SettingsBots", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SettingsBots />);
        expect(baseElement).toBeTruthy();
    });
});
