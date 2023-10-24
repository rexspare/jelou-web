import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { unitInMB } from "@apps/shared/constants";

const DatabaseParams = (props) => {
    const { databaseRecords, databaseSize, databaseLastUpdate, databaseDataIncrease } = props;
    const { t } = useTranslation();

    return (
        <div className="pt-2">
            <div className="text-sm font-bold text-gray-400 text-opacity-60 group-hover:text-opacity-90">
            {databaseRecords} {t("dataReport.records")}
            </div>
            <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
            {t("dataReport.weight")}: {parseInt(databaseSize / unitInMB)} MB
            </div>
            <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
            {t("dataReport.update")}: {dayjs(databaseLastUpdate).format("DD/MM/YYYY")}
            </div>
            <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
            {t("datum.dataIncrement")} : {Number(databaseDataIncrease).toFixed(2)}%
            </div>
        </div>
    );
};

export default DatabaseParams;