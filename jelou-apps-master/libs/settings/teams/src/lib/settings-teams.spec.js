import { render } from "@testing-library/react";
import SettingsTeams from "./settings-teams";
describe("SettingsTeams", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SettingsTeams />);
        expect(baseElement).toBeTruthy();
    });
});
