import { render } from "@testing-library/react";
import MetricsDashboardCards from "./metrics-dashboard-cards";
describe("MetricsDashboardCards", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<MetricsDashboardCards />);
        expect(baseElement).toBeTruthy();
    });
});
