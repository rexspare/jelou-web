import { act, renderHook } from "@testing-library/react-hooks";
import useParamsForFilters from "./useParamsForFilters";
describe("useParamsForFilters", () => {
    it("should render successfully", () => {
        const { result } = renderHook(() => useParamsForFilters());
        expect(result.current.count).toBe(0);
        act(() => {
            result.current.increment();
        });
        expect(result.current.count).toBe(1);
    });
});
