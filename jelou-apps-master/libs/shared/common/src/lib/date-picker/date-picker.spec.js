import { render } from "@testing-library/react";
import DatePicker from "./single-date-picker";
describe("SingleDatePicker", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<DatePicker />);
        expect(baseElement).toBeTruthy();
    });
});
