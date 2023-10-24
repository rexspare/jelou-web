import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DurationPicker = (props) => {
    const { handleDuration, ttlValue } = props;
    const { t } = useTranslation();
    const arrayDuration = [
        { id: 0, name: t("DurationPicker.minutes"), value: "Minutos" },
        { id: 1, name: t("DurationPicker.hours"), value: "Horas" },
        { id: 2, name: t("DurationPicker.days"), value: "Dias" },
    ];

    const [duration, setDuration] = useState();

    useEffect(() => {
        if (ttlValue) {
            const duration = arrayDuration.find((duration) => duration.value === ttlValue.unit);
            setDuration(duration);
        }
    }, [ttlValue]);

    return (
        <div className="max-w-md flex-col items-center rounded-md pt-8 pb-4">
            <div className="my-2 text-xl font-bold text-gray-400">{t("DurationPicker.duration")}</div>
            <div className="grid grid-cols-2 items-center space-x-4 rounded-md pb-4">
                <input
                    name="number"
                    type="number"
                    value={ttlValue.number}
                    className="input relative max-w-sm !font-semibold !text-primary-200"
                    onChange={handleDuration}
                />
                <select
                    id="duration"
                    name="duration"
                    value={ttlValue.unit || "DurationPicker.hours"}
                    className="input relative max-w-sm !font-semibold !text-primary-200"
                    onChange={handleDuration}>
                    <option value="Minutos">{t("DurationPicker.minutes")}</option>
                    <option value="Horas">{t("DurationPicker.hours")}</option>
                    <option value="Dias">{t("DurationPicker.days")}</option>
                </select>
            </div>
        </div>
    );
};

export default DurationPicker;
