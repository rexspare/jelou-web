import { render } from "@testing-library/react";
import MonitoringReports from "./monitoring-reports";
describe("MonitoringReports", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<MonitoringReports />);
        expect(baseElement).toBeTruthy();
    });
});
