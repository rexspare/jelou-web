import React, { useState, useEffect } from "react";
import ButtonDay from "./ButtonDay";
import SelectSearch, { fuzzySearch } from "react-select-search";
import get from "lodash/get";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";
import { Switch } from "@headlessui/react";
import Notify from "./Notify";
import Tippy from "@tippyjs/react";
import { Select } from "@apps/shared/common";

import { CloseIcon } from "@apps/shared/icons";
const WeekDetails = (props) => {
    const {
        editMode,
        t,
        canViewSchedule,
        canDeleteSchedule,
        canUpdateSchedule,
        canCreateSchedule,
        weekDetail,
        activateDay,
        index,
        currentSchedule,
        handleDeleteDetail,
        setDiffHoursModal,
        handleSelect,
        disabledDays,
        diffHoursModal,
        checkHours,
        timeZoneList,
    } = props;
    const [enabledAllDay, setEnabledAllDay] = useState(false);
    const [hourOptions, setHourOptions] = useState([]);
    const [disableHours, setDisableHours] = useState(false);
    const [warningIndex, setWarningIndex] = useState(null);

    const [initialHour, setInitialHour] = useState("");
    const [endHour, setEndHour] = useState("");
    const [timeZoneOpt, setTimeZoneOpt] = useState("America/Guayaquil");

    const disableClick =
        (canViewSchedule && !canCreateSchedule && !canUpdateSchedule) ||
        (canCreateSchedule && editMode && !canUpdateSchedule) ||
        (canDeleteSchedule && !canCreateSchedule && !canUpdateSchedule);

    const handleToggle = (evt) => {
        setEnabledAllDay(!enabledAllDay);
        if (evt) {
            setDisableHours(true);
            handleSelect("initHour", index, "00:00");
            handleSelect("endHour", index, "23:59");
            // handleSelect("timezone", index, "America/Guayaquil");
        } else {
            setDisableHours(false);
        }
    };

    useEffect(() => {
        const initHour = get(weekDetail, "initHour", "");
        const finalHour = get(weekDetail, "endHour", "");
        const currentTimeZone = get(weekDetail, "timezone", "");

        if (!isEmpty(currentTimeZone)) {
            setTimeZoneOpt(currentTimeZone);
        }
        if (initHour === "00:00" && finalHour === "23:59") {
            setInitialHour("00:00");
            setEndHour("23:59");
            setDisableHours(true);
            setEnabledAllDay(true);
        } else {
            setInitialHour(get(weekDetail, "initHour", ""));
            setEndHour(get(weekDetail, "endHour", ""));
            setDisableHours(false);
            setEnabledAllDay(false);
        }
    }, [currentSchedule, weekDetail, endHour]);

    const allDAyOption = [{ value: "23:59", name: "23:59" }];

    const defaultWeekDays = [
        { id: "monday", value: "lunes", label: "monday", active: false },
        { id: "tuesday", value: "martes", label: "tuesday", active: false },
        { id: "wednesday", value: "miercoles", label: "wednesday", active: false },
        { id: "thursday", value: "jueves", label: "thursday", active: false },
        { id: "friday", value: "viernes", label: "friday", active: false },
        { id: "saturday", value: "sabado", label: "saturday", active: false },
        { id: "sunday", value: "domingo", label: "sunday", active: false },
    ];

    const [weekDays, setWeekDays] = useState(defaultWeekDays);

    const getStateDays = () => {
        const stateDaysClean = pick(weekDetail, ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
        let daysArray = [];

        for (const [key, value] of Object.entries(stateDaysClean)) {
            const dayObj = {
                value: key,
                id: key,
                label: key,
                active: value,
            };
            daysArray.push(dayObj);
        }
        setWeekDays(daysArray);
    };

    useEffect(() => {
        const result = checkHours([{ ...weekDetail }]);
        if (result) {
            setWarningIndex(index);
            setDiffHoursModal(true);
        } else {
            setWarningIndex(null);
            setDiffHoursModal(false);
        }
    }, [currentSchedule]);

    useEffect(() => {
        getStateDays();
    }, [currentSchedule]);

    useEffect(() => {
        let hours = [];
        let m = 0;
        for (let i = 0; i < 24; i++) {
            m = 0;
            for (let c = 0; c < 4; c++) {
                const option = `${i.toString().length === 1 ? `0${i}` : i}:${m.toString().length === 1 ? `0${m}` : m}`;
                hours.push({ value: option, name: option });
                m = m + 15;
            }
        }
        hours.push({ value: "23:59", name: "23:59" });
        setHourOptions(hours);
    }, []);
    return (
        <>
            {warningIndex === index && diffHoursModal && <Notify msg={t("scheduleModalLabel.differenceHours")} />}
            <div className="relative mt-3 flex items-center justify-center rounded-[1.3rem] border-2 border-gray-300 border-opacity-40 py-6 align-middle">
                <div className=" mx-10 flex flex-col space-y-9">
                    <label htmlFor="workingDays">
                        <div className="flex space-x-4">
                            {weekDays.map((day, key) => (
                                <ButtonDay
                                    disableClick={disableClick}
                                    disabledDays={disabledDays}
                                    key={key}
                                    day={day}
                                    dayId={day.id}
                                    index={index}
                                    t={t}
                                    activateDay={activateDay}
                                />
                            ))}
                        </div>
                    </label>
                    <div className="flex flex-row space-x-4 ">
                        <Switch
                            disabled={disableClick}
                            checked={enabledAllDay}
                            onChange={(evt) => handleToggle(evt)}
                            className={`${
                                enabledAllDay ? " bg-[#00B3C7]" : "bg-gray-200"
                            } relative inline-flex h-6 w-11 items-center rounded-full disabled:cursor-not-allowed`}>
                            <span className="sr-only">Enable all day schedule</span>
                            <span
                                className={`${
                                    enabledAllDay ? "translate-x-6" : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white`}
                            />
                        </Switch>
                        <p className="font-semibold text-[#727C94]">{t("schedule.configAllDay")}</p>
                    </div>
                    <div className="flex w-full">
                        <div className="flex space-x-8 ">
                            <label htmlFor="initialHour">
                                <span className=" mb-1 block text-sm font-bold text-gray-400">{t("teamsForm.startHour")}</span>
                                <div className="relative flex flex-1">
                                    <SelectSearch
                                        options={hourOptions}
                                        className="moduleSelect timeSelect w-32 text-sm"
                                        disabled={disableHours || disableClick}
                                        filterOptions={fuzzySearch}
                                        value={initialHour}
                                        name={"initialHour"}
                                        search
                                        placeholder={t("schedule.select")}
                                        onChange={(value) => handleSelect("initHour", index, value)}
                                    />
                                </div>
                            </label>
                            <label htmlFor="finalHour">
                                <span className="mb-1 block text-sm font-bold text-gray-400">{t("teamsForm.endHour")}</span>
                                <div className="relative flex flex-1">
                                    <SelectSearch
                                        disabled={disableHours || disableClick}
                                        options={disableHours ? allDAyOption : hourOptions}
                                        className="moduleSelect timeSelect w-32 text-sm"
                                        filterOptions={fuzzySearch}
                                        value={endHour}
                                        name={"endHour"}
                                        search
                                        placeholder={t("schedule.select")}
                                        onChange={(value) => handleSelect("endHour", index, value)}
                                    />
                                </div>
                            </label>
                            {/* <label htmlFor="timeZone">
                                <span className=" mb-1 block text-sm font-bold text-gray-400">{t("schedule.timezone")}</span>
                                <div className="relative flex w-[190px] flex-1">
                                    <SelectSearch
                                        options={timeZoneList}
                                        disabled={false}
                                        className="moduleSelect timeSelect w-full text-sm"
                                        filterOptions={fuzzySearch}
                                        // defaultValue={"America/Guayaquil"}
                                        name="timeZone"
                                        value={timeZoneOpt}
                                        search
                                        placeholder={t("schedule.select")}
                                        onChange={(value) => {
                                            handleSelect("timezone", index, value);
                                        }}
                                    />
                                </div>
                            </label> */}
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="flex space-x-8 ">
                            <label htmlFor="timeZone">
                                <span className=" mb-1 block text-sm font-bold text-gray-400">{t("schedule.timezone")}</span>
                                <div className="relative flex w-[260px] flex-1">
                                    <SelectSearch
                                        options={timeZoneList}
                                        disabled={false}
                                        className="moduleSelect timeSelect w-full text-sm"
                                        filterOptions={fuzzySearch}
                                        defaultValue={"America/Guayaquil"}
                                        name="timeZone"
                                        value={timeZoneOpt}
                                        search
                                        placeholder={t("schedule.select")}
                                        onChange={(value) => {
                                            handleSelect("timezone", index, value);
                                        }}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                    <Tippy content={t("schedule.delete")} theme="jelou" arrow={false} placement={"bottom"} touch={false}>
                        <button
                            onClick={() => handleDeleteDetail(weekDetail.rowId)}
                            disabled={disableClick && !canDeleteSchedule}
                            className={`absolute right-[-20px] top-[-30px]  text-base text-gray-400 text-opacity-50 `}>
                            <CloseIcon
                                className={` ${
                                    disableClick && !canDeleteSchedule && "cursor-not-allowed"
                                } cursor-pointer fill-current text-[#727C94] opacity-50 `}
                                width="12"
                                height="12"
                            />
                        </button>
                    </Tippy>
                </div>
            </div>
        </>
    );
};

export default WeekDetails;
