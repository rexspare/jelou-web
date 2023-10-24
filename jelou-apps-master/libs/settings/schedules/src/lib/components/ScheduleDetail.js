import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { useTranslation } from "react-i18next";
import first from "lodash/first";
import get from "lodash/get";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { v4 as uuid } from "uuid";

import { DashboardServer } from "@apps/shared/modules";
import ActionsModal from "../Common/ActionsModal";
import { Modal } from "@apps/shared/common";
import WeekDetails from "./WeekDetails";
import "react-toastify/dist/ReactToastify.css";

import { updateSchedule, deleteScheduleFromList } from "@apps/redux/store";

import { useDispatch } from "react-redux";

const ScheduleDetail = (props) => {
    const {
        canViewSchedule,
        canDeleteSchedule,
        canUpdateSchedule,
        canCreateSchedule,
        type,
        setType,
        setFirstScheduleSet,
        firstScheduleSet,
        schedulesList,
        // setPageNumber,
        scrollToUp,
        setShowScheduleSettings,
        editMode,
        loadSchedules,
        teams,
        bots,
        operators,
        currentSchedule,
        setCurrentSchedule,
        getSettedDays,
        scheduleBody,
        editModeOption,
        setSubTypeValue,
        subTypeValue,
        hiddenScroll,
        setEditMode,
        setEditModeOption,
        setSearchValue,
        timeZoneList,
    } = props;

    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [disabledDays, setDisableDays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [disableAddSchedule, setDisableAddSchedule] = useState(false);
    const [openDeleteLastModal, setOpenDeleteLastModal] = useState(false);
    const [diffHoursModal, setDiffHoursModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isEmpty(currentSchedule)) {
            setType(get(currentSchedule, "schedulerable", ""));
        }
    }, [currentSchedule]);

    function getDisabledDays(schedules) {
        const disabledDays = [];

        function hasDay(day, obj) {
            return obj[day] && !disabledDays.find((i) => i === day);
        }

        schedules.forEach((obj) => {
            if (hasDay("monday", obj)) {
                disabledDays.push("monday");
            }

            if (hasDay("tuesday", obj)) {
                disabledDays.push("tuesday");
            }

            if (hasDay("wednesday", obj)) {
                disabledDays.push("wednesday");
            }
            if (hasDay("thursday", obj)) {
                disabledDays.push("thursday");
            }
            if (hasDay("friday", obj)) {
                disabledDays.push("friday");
            }
            if (hasDay("saturday", obj)) {
                disabledDays.push("saturday");
            }

            if (hasDay("sunday", obj)) {
                disabledDays.push("sunday");
            }
        });

        return disabledDays;
    }

    useEffect(() => {
        const schedules = get(currentSchedule, "details", []);
        setDisableDays(getDisabledDays(schedules));
    }, [currentSchedule]);

    useEffect(() => {
        setSubTypeValue(get(currentSchedule, "schedulerableId", ""));
    }, []);

    const handleCancel = () => {
        setOpenCancelModal(true);
    };

    const cancelSchedule = () => {
        setShowScheduleSettings(false);
        setCurrentSchedule({ ...scheduleBody });
    };

    const handleSelectType = (type) => {
        setCurrentSchedule({ ...currentSchedule, schedulerable: type });
        setType(type);
        setSubTypeValue("");
    };

    const handleSubmitSchedule = async () => {
        const details = get(currentSchedule, "details", "");

        const result = checkHours(details);

        setIsLoading(true);
        // setPageNumber(1);
        const body = { ...currentSchedule };
        const scheduleId = get(currentSchedule, "id", "");
        if (!result) {
            if (!editMode) {
                try {
                    setIsLoading(true);
                    await DashboardServer.post(`/schedulers`, body);
                    loadSchedules();
                    setFirstScheduleSet(true);
                    setEditMode(true);
                    notify(t("notifyMessages.scheduleCreated"));
                    scrollToUp.current.scrollTo(0, 0);
                    hiddenScroll.current.scrollTo(0, 0);
                } catch (error) {
                    setIsLoading(false);
                    console.log(error);
                }
            } else {
                try {
                    await DashboardServer.put(`/schedulers/${scheduleId}`, body);
                    setFirstScheduleSet(false);
                    dispatch(updateSchedule(body));
                    notify(t("notifyMessages.savedChanges"));
                } catch (error) {
                    setIsLoading(false);
                    console.log(error);
                }
            }
        } else {
            notifyError("La hora inicial debe ser menor a la hora final");
        }
        setSearchValue("");
        setIsLoading(false);
    };

    useEffect(() => {
        const schedule = first(schedulesList);

        const detailsCleaned = get(schedule, "details", []).map((detail) => {
            const detailFinal = { ...detail };

            detailFinal["initHour"] = get(detail, "initHour", "").replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");
            detailFinal["endHour"] = get(detail, "endHour", "").replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");
            detailFinal.rowId = uuid();
            return pick(detailFinal, [
                "id",
                "timezone",
                "rowId",
                "initHour",
                "endHour",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ]);
        });
        if (firstScheduleSet) {
            setCurrentSchedule({
                ...scheduleBody,
                id: get(schedule, "id", ""),
                name: get(schedule, "name", ""),
                schedulerableId: get(schedule, "schedulerableId", ""),
                schedulerable: get(schedule, "schedulerable", ""),
                details: detailsCleaned,
            });
            setEditModeOption([
                {
                    id: get(schedule, "schedulerableId", ""),
                    value: get(schedule, "schedulerableId", ""),
                    name: get(schedule, "name", ""),
                },
            ]);
        }
    }, [schedulesList]);

    useEffect(() => {
        const details = get(currentSchedule, "details", []);
        const daysState = details !== [] ? details.map((schedule) => Object.values(schedule).find((element) => element === true)) : undefined;

        const someIsEmpty = daysState.some((element) => element === undefined);

        const initIsEmpty = details.some((schedule) => schedule.initHour === "");

        const endIsEmpty = details.some((schedule) => schedule.endHour === "");

        const disable = get(currentSchedule, "name", "") === "" || initIsEmpty || endIsEmpty || someIsEmpty;
        setDisableSubmit(disable);
    }, [currentSchedule]);

    const handleSelectSubType = (id) => {
        if (type === "bot") {
            const subType = first(bots.filter((bot) => bot.id === id));
            setCurrentSchedule({
                ...currentSchedule,
                name: subType.name,
                schedulerableId: id,
            });
            setSubTypeValue(id);
        }

        if (type === "team") {
            const subType = first(teams.filter((team) => team.id === id));
            setCurrentSchedule({
                ...currentSchedule,
                name: subType.name,
                schedulerableId: id,
            });
            setSubTypeValue(id);
        }
        if (type === "operator") {
            const subType = first(operators.filter((operator) => operator.id === id));
            setCurrentSchedule({
                ...currentSchedule,
                name: subType.name,
                schedulerableId: id,
            });
            setSubTypeValue(id);
        }
    };

    useEffect(() => {
        const details = get(currentSchedule, "details", "");
        const result = checkHours(details);
        if (result) {
            setDisableSubmit(true);
            setDiffHoursModal(true);
        } else {
            setDiffHoursModal(false);
        }
    }, [currentSchedule]);

    const checkHours = (details) => {
        const negativeDifference = details.some((schedule) => {
            const initHourFormatted = parseInt(get(schedule, "initHour", "").replace(":", ""));
            const endHourFormatted = parseInt(get(schedule, "endHour", "").replace(":", ""));

            return initHourFormatted > endHourFormatted;
        });
        return negativeDifference;
    };

    const handleSelect = (selectName, index, value) => {
        const { details } = currentSchedule;

        let detail = details[index];
        detail[selectName] = value;
        setCurrentSchedule({ ...currentSchedule, details: [...details] });
    };

    const typeOptions = [
        { id: "team", value: "team", name: t("schedule.team") },
        { id: "bot", value: "bot", name: "Bot" },
        { id: "operator", value: "operator", name: t("schedule.operator") },
    ];

    const activateDay = (day, index, state) => {
        let { details } = currentSchedule;
        details = [...details];
        let detail = details[index];
        detail[day] = state;
        setCurrentSchedule({ ...currentSchedule, details: [...details] });
    };

    const handleAddSchedule = () => {
        const { details } = currentSchedule;

        const newScheduleBody = first(scheduleBody.details);
        details.push({ ...newScheduleBody });

        setCurrentSchedule({ ...currentSchedule, details: [...details] });
    };

    useEffect(() => {
        const details = get(currentSchedule, "details", "");
        if (details.length === 0) {
            setDisableSubmit(true);
        }
    }, [currentSchedule]);

    const deleteLastDetail = async () => {
        const scheduleId = get(currentSchedule, "id", "");
        try {
            setIsLoading(true);
            if (editMode) {
                await DashboardServer.delete(`/schedulers/${scheduleId}`);
            }
            notify(t("schedule.deletedMessage"));
            dispatch(deleteScheduleFromList(scheduleId));
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
        setCurrentSchedule({ ...scheduleBody });
        setShowScheduleSettings(false);
        setIsLoading(false);
    };

    const handleDeleteDetail = (rowId) => {
        const newSchedulelist = get(currentSchedule, "details", []).filter((detail) => detail.rowId !== rowId);
        if (newSchedulelist.length === 0) {
            setOpenDeleteLastModal(true);
        } else {
            setCurrentSchedule({ ...currentSchedule, details: newSchedulelist });
        }
    };

    useEffect(() => {
        if (disabledDays.length > 6) {
            setDisableAddSchedule(true);
        } else {
            setDisableAddSchedule(false);
        }
    }, [disabledDays]);

    // const notify = (msg) => {
    //   toast.success(
    //     <div className="relative flex items-center justify-between">
    //       <div className="flex">
    //         <svg
    //           className="ml-2 mr-2 -mt-px"
    //           width="25"
    //           height="25"
    //           viewBox="0 0 25 25"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
    //             fill="#0CA010"
    //           />
    //         </svg>
    //         <div className="text-15">{msg}</div>
    //       </div>

    //       <div className="flex pl-10">
    //         <svg
    //           width="18"
    //           height="18"
    //           viewBox="0 0 18 18"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             d="M10.6491 9.00013L17.6579 1.99094C18.114 1.53502 18.114 0.797859 17.6579 0.341939C17.202 -0.11398 16.4649 -0.11398 16.0089 0.341939L8.99989 7.35114L1.99106 0.341939C1.53493 -0.11398 0.798002 -0.11398 0.342092 0.341939C-0.114031 0.797859 -0.114031 1.53502 0.342092 1.99094L7.35093 9.00013L0.342092 16.0093C-0.114031 16.4653 -0.114031 17.2024 0.342092 17.6583C0.5693 17.8858 0.868044 18 1.16657 18C1.4651 18 1.76363 17.8858 1.99106 17.6583L8.99989 10.6491L16.0089 17.6583C16.2364 17.8858 16.5349 18 16.8334 18C17.132 18 17.4305 17.8858 17.6579 17.6583C18.114 17.2024 18.114 16.4653 17.6579 16.0093L10.6491 9.00013Z"
    //             fill="#596859"
    //           />
    //         </svg>
    //       </div>
    //     </div>,
    //     {
    //       position: toast.POSITION.BOTTOM_RIGHT,
    //     }
    //   );
    // };
    const notify = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const notifyError = (error) => {
        toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    return (
        <div className={"flex flex-col items-center"}>
            <div>
                <div className="flex space-x-4 pb-3">
                    <label htmlFor="roles" className="w-[7rem]">
                        <div className="mb-1 flex h-full items-center justify-end text-sm font-bold text-gray-400 text-opacity-75">
                            <p>{t("schedule.setting")}</p>
                        </div>
                    </label>
                    <div className="relative flex flex-1">
                        <SelectSearch
                            options={typeOptions}
                            className="moduleSelect schedules w-64 text-sm"
                            filterOptions={fuzzySearch}
                            value={type}
                            name={"type"}
                            disabled={!isEmpty(editModeOption)}
                            search
                            placeholder={t("schedule.select")}
                            onChange={(value) => handleSelectType(value)}
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <label htmlFor="roles" className="w-[7rem]">
                        <div className="mb-1 flex h-full items-center justify-end text-sm font-bold text-gray-400 text-opacity-75">
                            {t(`schedule.${type}`)}
                        </div>
                    </label>
                    <div className="relative flex">
                        <SelectSearch
                            options={!isEmpty(editModeOption) ? editModeOption : type === "team" ? teams : type === "bot" ? bots : operators}
                            className="moduleSelect schedules w-64 text-sm"
                            filterOptions={fuzzySearch}
                            value={subTypeValue}
                            disabled={!isEmpty(editModeOption)}
                            search
                            name={"name"}
                            placeholder={t("schedule.select")}
                            onChange={(value) => handleSelectSubType(value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-7 pb-2 pt-4">
                {get(currentSchedule, "details", []).map((weekDetail, index) => {
                    return (
                        <div className="relative" key={index}>
                            <WeekDetails
                                editMode={editMode}
                                canViewSchedule={canViewSchedule}
                                canCreateSchedule={canCreateSchedule}
                                canUpdateSchedule={canUpdateSchedule}
                                canDeleteSchedule={canDeleteSchedule}
                                checkHours={checkHours}
                                setDiffHoursModal={setDiffHoursModal}
                                diffHoursModal={diffHoursModal}
                                disabledDays={disabledDays}
                                t={t}
                                handleSelect={handleSelect}
                                index={index}
                                setCurrentSchedule={setCurrentSchedule}
                                getSettedDays={getSettedDays}
                                weekDetail={weekDetail}
                                activateDay={activateDay}
                                currentSchedule={currentSchedule}
                                handleDeleteDetail={handleDeleteDetail}
                                timeZoneList={timeZoneList}
                            />
                        </div>
                    );
                })}
            </div>
            {openDeleteLastModal && (
                <Modal>
                    <ActionsModal
                        setOpen={setOpenDeleteLastModal}
                        onConfirm={deleteLastDetail}
                        action={"deleteLastDetail"}
                        label={"delete"}
                        isLoading={isLoading}
                    />
                </Modal>
            )}

            {openCancelModal && (
                <Modal>
                    <ActionsModal setOpen={setOpenCancelModal} onConfirm={cancelSchedule} action={"cancel"} label={"cancel"} />
                </Modal>
            )}

            {((canCreateSchedule && !editMode) || (canUpdateSchedule && editMode)) && (
                <div className="mt-2 flex w-full justify-between pb-28 pt-4">
                    <button
                        className={`ml-4 mr-10 block font-semibold disabled:cursor-not-allowed ${
                            disableAddSchedule ? "cursor-auto text-[#727C94] text-opacity-25" : "text-[#00B3C7] text-opacity-100"
                        }`}
                        disabled={disableAddSchedule}
                        type="button"
                        onClick={handleAddSchedule}>
                        {`+ ${t("schedule.addRow")}`}
                    </button>

                    <div className="mr-2 flex justify-end">
                        <button
                            type="submit"
                            className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                            onClick={handleCancel}>
                            {t("rolesDelete.cancel")}
                        </button>
                        <button type="button" onClick={handleSubmitSchedule} className="button-primary ml-4 w-32" disabled={disableSubmit}>
                            {isLoading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("schedule.save")}`}
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ScheduleDetail;
