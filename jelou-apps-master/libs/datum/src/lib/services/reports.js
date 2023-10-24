import { useSelector, useDispatch } from "react-redux";

import { DashboardServer } from "@apps/shared/modules";
import { setReports } from "@apps/redux/store";
import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export function useReports() {
    const companyId = useSelector((state) => state.company.id);
    const userSession = useSelector((state) => state.userSession);
    
    const dispatch = useDispatch();

    const { id: userId } = userSession;
    
    async function getReports() {
        if (!companyId) return [];
        try {
            const { data } = await DashboardServer.get(`/companies/${companyId}/reports`);
            const { reports, avoidReports } = data;
            const reportIdsToAvoid = Array.from(avoidReports)
                .filter((avoidReport) => avoidReport.userId === userId)
                .flatMap((report) => report.reportId);
            const filteredReports = reports.filter((report) => !reportIdsToAvoid.includes(report.reportId));
            dispatch(setReports(filteredReports));
        } catch (error) {
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
            dispatch(setReports([]));
            console.error(error);
        }
    }

    return { getReports };
}
