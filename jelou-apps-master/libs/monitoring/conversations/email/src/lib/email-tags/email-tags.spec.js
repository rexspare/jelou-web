import { render } from "@testing-library/react";
import EmailTags from "./email-tags";
describe("EmailTags", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<EmailTags />);
        expect(baseElement).toBeTruthy();
    });
});
