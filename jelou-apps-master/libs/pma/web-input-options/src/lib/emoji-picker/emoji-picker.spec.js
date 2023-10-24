import { render } from "@testing-library/react";
import EmojiPicker from "./emoji-picker";
describe("EmojiPicker", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<EmojiPicker />);
        expect(baseElement).toBeTruthy();
    });
});
