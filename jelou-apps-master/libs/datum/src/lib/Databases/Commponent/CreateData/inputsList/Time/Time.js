import { useState } from "react";
import { HOURS, MINUTES } from "../../../../../constants";
import { SelectTime } from "./TimeSelect";

const paseDefaulTime = (defaultValue) => {
    const [hour, minute] = defaultValue.split(":");
    const defatulHour = HOURS.find((h) => h.value === hour) || { label: hour, value: hour };
    const defatulMinute = MINUTES.find((min) => min.value === minute) || { label: minute, value: minute };
    return [defatulHour, defatulMinute];
};

export function TimeInput({ onChange: onChangeForm = () => null, type = "time", name = null, defaultValue = undefined, isDisable } = {}) {
    const [defaultHour, defaultMinute] = defaultValue ? paseDefaulTime(defaultValue) : [null, null];
    const [hour, setHour] = useState(defaultHour ?? HOURS[0]);
    const [minute, setMinute] = useState(defaultMinute ?? MINUTES[0]);

    const handleChangeHours = (hourSelect) => {
        setHour(hourSelect);
        const timeSelect = `${hourSelect.value}:${minute.value}`;
        onChangeForm({ value: timeSelect, name, type });
    };

    const handleChangeMinute = (minuteSelect) => {
        setMinute(minuteSelect);
        const timeSelect = `${hour.value}:${minuteSelect.value}`;
        onChangeForm({ value: timeSelect, name, type });
    };

    return (
        <div className="flex items-center justify-start w-full gap-4">
            <div className="w-20">
                <SelectTime isDisable={isDisable} onChangeOption={handleChangeHours} defaultValue={defaultHour} options={HOURS} isSearchable={true} />
            </div>
            <span>:</span>
            <div className="w-20">
                <SelectTime
                    isDisable={isDisable}
                    onChangeOption={handleChangeMinute}
                    defaultValue={defaultMinute}
                    options={MINUTES}
                    isSearchable={true}
                />
            </div>
        </div>
    );
}
