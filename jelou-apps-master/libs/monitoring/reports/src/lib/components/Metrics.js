import { useEffect, useState } from "react";
import { Stats } from "@apps/shared/common";
import isEmpty from "lodash/isEmpty";
import { ssToHMS } from "@apps/shared/utils";
import { withTranslation } from "react-i18next";

const Metrics = (props) => {
    const { hasDifMetrics, totalsByTeams, loading, t } = props;
    const [totalConversations, setTotalConversations] = useState("-");
    const [attendedConversation, setAttendedConversation] = useState("-");
    const [transferedConversation, setTransferedConversation] = useState("-");
    const [notAttendedConversation, setNotAttendedConversation] = useState("-");
    const [averageReply, setAverageReply] = useState("-");
    const [avgOperatorReply, setAvgOperatorReply] = useState("-");
    const [avgConversationTime, setAvgConversationTime] = useState("-");

    useEffect(() => {
        if (!isEmpty(totalsByTeams)) {
            if (!hasDifMetrics) {
                let totalsActual = [];
                let totalsAttended = [];
                let totalsTransfered = [];
                let totalsNotAttended = [];
                let totalsAvgReplyTime = [];
                let totalsAvgOperatorResponseTime = [];
                let totalsAvgConversationTime = [];
                let totals, attendeds, transfereds, notAttendeds, avgReplyTimes, avgOperatorResponseTimes, avgConversationTimes;
                totalsByTeams.forEach((object) => {
                    let { total, attended, transfered, notAttended, avgReplyTime, avgOperatorResponseTime, avgConversationTime } = object;
                    totalsActual.push(total);
                    totalsAttended.push(attended);
                    totalsTransfered.push(transfered);
                    totalsNotAttended.push(notAttended);
                    totalsAvgReplyTime.push(avgReplyTime);
                    totalsAvgOperatorResponseTime.push(avgOperatorResponseTime);
                    totalsAvgConversationTime.push(avgConversationTime);
                    totals = totalsActual.reduce((a, b) => a + b, 0);
                    attendeds = totalsAttended.reduce((a, b) => a + b, 0);
                    transfereds = totalsTransfered.reduce((a, b) => a + b, 0);
                    notAttendeds = totalsNotAttended.reduce((a, b) => a + b, 0);
                    avgReplyTimes = totalsAvgReplyTime.reduce((a, b) => a + b, 0);
                    avgOperatorResponseTimes = totalsAvgOperatorResponseTime.reduce((a, b) => a + b, 0);
                    avgConversationTimes = totalsAvgConversationTime.reduce((a, b) => a + b, 0);
                });
                const avgReply = avgReplyTimes / totalsByTeams.length;
                const avgOpReply = avgOperatorResponseTimes / totalsByTeams.length;
                const opConversation = avgConversationTimes / totalsByTeams.length;
                setAverageReply(ssToHMS(avgReply));
                setAvgOperatorReply(ssToHMS(avgOpReply));
                setTotalConversations(totals);
                setAttendedConversation(attendeds);
                setTransferedConversation(transfereds);
                setNotAttendedConversation(notAttendeds);
                setAvgConversationTime(ssToHMS(opConversation));
            } else {
                let totalsTotals = [];
                let totalsAttended = [];
                let totalsTransfered = [];
                let totalsNotAttended = [];
                let totalsAvgReplyTime = [];
                let totalsAvgOperatorResponseTime = [];
                let totalsAvgConversationTime = [];
                let totals, attendeds, transfereds, notAttendeds, avgReplyTimes, avgOperatorResponseTimes, avgConversationTimes;

                totalsByTeams.forEach((object) => {
                    let {
                        realTotal,
                        attended,
                        actualReplied,
                        transfered,
                        notAttended,
                        actualNotReplied,
                        avgReplyTime,
                        avgOperatorResponseTime,
                        avgConversationTime,
                    } = object;
                    totalsTotals.push(realTotal);
                    totalsAttended.push(attended + actualReplied);
                    totalsTransfered.push(transfered);
                    totalsNotAttended.push(notAttended + actualNotReplied);
                    totalsAvgReplyTime.push(avgReplyTime);
                    totalsAvgOperatorResponseTime.push(avgOperatorResponseTime);
                    totalsAvgConversationTime.push(avgConversationTime);
                    totals = totalsTotals.reduce((a, b) => a + b, 0);
                    attendeds = totalsAttended.reduce((a, b) => a + b, 0);
                    transfereds = totalsTransfered.reduce((a, b) => a + b, 0);
                    notAttendeds = totalsNotAttended.reduce((a, b) => a + b, 0);
                    avgReplyTimes = totalsAvgReplyTime.reduce((a, b) => a + b, 0);
                    avgOperatorResponseTimes = totalsAvgOperatorResponseTime.reduce((a, b) => a + b, 0);
                    avgConversationTimes = totalsAvgConversationTime.reduce((a, b) => a + b, 0);
                });

                const avgReply = avgReplyTimes / totalsByTeams.length;
                const avgOpReply = avgOperatorResponseTimes / totalsByTeams.length;
                const opConversation = avgConversationTimes / totalsByTeams.length;
                setAverageReply(ssToHMS(avgReply));
                setAvgOperatorReply(ssToHMS(avgOpReply));
                setTotalConversations(totals);
                setAttendedConversation(attendeds);
                setTransferedConversation(transfereds);
                setNotAttendedConversation(notAttendeds);
                setAvgConversationTime(ssToHMS(opConversation));
            }
        } else {
            setTotalConversations(0);
            setAttendedConversation(0);
            setTransferedConversation(0);
            setNotAttendedConversation(0);
            setAverageReply("00m 00s");
            setAvgOperatorReply("00m 00s");
            setAvgConversationTime("00m 00s");
        }
    }, [totalsByTeams]);

    return (
        <div className="mb-4 flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Stats title={t("monitoring.Casos Totales")} number={totalConversations} loading={loading} color="bg-gray-27" />
            <Stats title={t("monitoring.Casos Atendidos")} number={attendedConversation} loading={loading} color="bg-gray-27" />
            <Stats title={t("monitoring.Casos Transferidos")} number={transferedConversation} loading={loading} color="bg-gray-27" />
            <Stats title={t("monitoring.Casos no Atendidos")} number={notAttendedConversation} loading={loading} color="bg-gray-27" />
            <Stats title={t("monitoring.Primera Respuesta")} number={averageReply} loading={loading} color="bg-gray-27" />
            <Stats title={t("monitoring.Prom. Respuesta")} number={avgOperatorReply} loading={loading} color="bg-gray-27" />
            <Stats title={t("monitoring.Prom. Duración")} number={avgConversationTime} loading={loading} color="bg-gray-27" />
        </div>
    );
};
export default withTranslation()(Metrics);
