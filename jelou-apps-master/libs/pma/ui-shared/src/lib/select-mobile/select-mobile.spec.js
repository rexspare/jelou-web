import { render } from "@testing-library/react";
import SelectMobile from "./select-mobile";
describe("SelectMobile", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SelectMobile />);
        expect(baseElement).toBeTruthy();
    });
});
