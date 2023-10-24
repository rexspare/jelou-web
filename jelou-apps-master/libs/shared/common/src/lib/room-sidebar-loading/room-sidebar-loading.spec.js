import { render } from "@testing-library/react";
import RoomSidebarLoading from "./room-sidebar-loading";
describe("RoomSidebarLoading", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<RoomSidebarLoading />);
        expect(baseElement).toBeTruthy();
    });
});
