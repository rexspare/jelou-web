import { render } from "@testing-library/react";
import FormComboboxSelect from "./form-combobox-select";
describe("FormComboboxSelect", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<FormComboboxSelect />);
        expect(baseElement).toBeTruthy();
    });
});
