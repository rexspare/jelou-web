import React from "react";
import { Stats } from "@apps/shared/common";
import { withTranslation } from "react-i18next";

const DailyInteraction = (props) => {
    const { operatorNotFound, operatorNotSchedule, loading, t } = props;

    return (
        <div className="mb-4 flex w-full space-x-4">
            <Stats title={t("monitoring.Dentro de Horario")} number={operatorNotFound} loading={loading} color="bg-gray-27" width="w-72" />
            <Stats title={t("monitoring.Fuera de Horario")} number={operatorNotSchedule} loading={loading} color="bg-gray-27" width="w-72" />
        </div>
    );
};
export default withTranslation()(DailyInteraction);
