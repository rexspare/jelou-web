import { render } from "@testing-library/react";
import OnlineToast from "./online-toast";
describe("OnlineToast", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<OnlineToast />);
        expect(baseElement).toBeTruthy();
    });
});
