import pick from "lodash/pick";
import get from "lodash/get";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";

import DropDownMenu from "./DropDownMenu";

const ScheduleItem = (props) => {
    const {
        canDeleteSchedule,
        canCreateSchedule,
        canUpdateSchedule,
        schedule,
        scheduleBody,
        setCurrentSchedule,
        setEditModeOption,
        getSettedDays,
        currentSchedule,
        setShowScheduleSettings,
        setSubTypeValue,
        setEditMode,
        setScheduleToDelete,
        setOpenDeleteModal,
        setOpenInfoModal,
        loadBots,
        loadTeams,
        loadOperators,
    } = props;

    const { t } = useTranslation();

    const details = get(schedule, "details");

    const editSchedule = () => {
        setEditMode(true);
        setCurrentSchedule(scheduleBody);

        const optionReference = [{ id: "", value: "", name: "" }];
        setSubTypeValue(get(schedule, "schedulerableId", ""));
        const detailsCleaned = get(schedule, "details", []).map((detail) => {
            const detailFinal = { ...detail };
            detailFinal["initHour"] = get(detail, "initHour", "").replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");
            detailFinal["endHour"] = get(detail, "endHour", "").replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");
            detailFinal.rowId = uuid();
            return pick(detailFinal, [
                "id",
                "rowId",
                "timezone",
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

        setShowScheduleSettings(true);
        setCurrentSchedule({
            ...currentSchedule,
            createdAt: get(schedule, "createdAt", ""),
            id: get(schedule, "id", ""),
            name: get(schedule, "name"),
            schedulerableId: get(schedule, "schedulerableId"),
            schedulerable: get(schedule, "schedulerable"),
            details: detailsCleaned,
        });
        setEditModeOption([
            {
                ...optionReference,
                id: get(schedule, "schedulerableId", ""),
                value: get(schedule, "schedulerableId", ""),
                name: get(schedule, "name", ""),
            },
        ]);
    };

    const duplicateSchedule = () => {
        loadBots();
        loadTeams();
        loadOperators();
        const detailsCleaned = get(schedule, "details", []).map((detail) => {
            const detailFinal = { ...detail };
            detailFinal["initHour"] = get(detail, "initHour", "").replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");
            detailFinal["endHour"] = get(detail, "endHour", "").replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");
            detailFinal.rowId = uuid();
            return pick(detailFinal, [
                "id",
                "rowId",
                "timezone",
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
        setEditMode(false);

        setOpenInfoModal(true);
        setTimeout(() => {
            setOpenInfoModal(false);
        }, 4500);

        setEditModeOption([]);
        setSubTypeValue("");
        setCurrentSchedule({
            ...scheduleBody,
            schedulerable: get(schedule, "schedulerable", ""),
            details: detailsCleaned,
        });
        setShowScheduleSettings(true);
    };

    return (
        <div className="relative w-full overscroll-x-none">
            <button
                className={`relative w-full cursor-pointer border-t-0.5 border-gray-26 px-8 pt-2 pb-4 text-left outline-none hover:bg-primary-200 hover:bg-opacity-10
            ${schedule.id === get(currentSchedule, "id", "") && "cursor-auto bg-primary-200 bg-opacity-10"}`}
                onClick={() => {
                    editSchedule();
                }}>
                <p className="py-2 font-semibold capitalize text-gray-400">
                    {t(`schedule.${schedule["schedulerable"]}`)}: {schedule["name"]}
                </p>
                <div className="relative text-sm capitalize text-gray-400">
                    <div>
                        {details.map((detail, index) => (
                            <div className="mb-2" key={index}>
                                <p>{getSettedDays(detail)}</p>

                                <p>
                                    {detail["initHour"].replace(/(\d{1,2}:\d{2}):\d{2}/, "$1")}-
                                    {detail["endHour"].replace(/(\d{1,2}:\d{2}):\d{2}/, "$1")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </button>
            {(canDeleteSchedule || canCreateSchedule) && (
                <DropDownMenu
                    canDeleteSchedule={canDeleteSchedule}
                    canUpdateSchedule={canUpdateSchedule}
                    canCreateSchedule={canCreateSchedule}
                    width="3"
                    height="17"
                    schedule={schedule}
                    duplicateSchedule={duplicateSchedule}
                    setOpenDeleteModal={setOpenDeleteModal}
                    setScheduleToDelete={setScheduleToDelete}
                />
            )}
        </div>
    );
};

export default ScheduleItem;
