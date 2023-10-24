import { render } from "@testing-library/react";
import PeriodPicker from "./period-picker";
describe("PeriodPicker", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<PeriodPicker />);
        expect(baseElement).toBeTruthy();
    });
});
