import dayjs from "dayjs";
import "dayjs/locale/es";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import toUpper from "lodash/toUpper";

import { DateTimeInput } from "./DateTime";
import { JelouApiV1 } from "@apps/shared/modules";
import { CalendarIcon, ScheduleIconTab } from "@apps/shared/icons";

export function ReSchedule({ original, handleUpdate }) {
    const { _id: id, scheduledAt = "", status = "" } = original;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [loadingReschedule, setLoadingReschedule] = useState(false);
    const [newSchedule, setNewSchedule] = useState(scheduledAt);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    const closeModal = () => {
        setShowModal(false);
    };

    const closeConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    const reScheduled = () => {
        // SCHEDULED
        try {
            let formdata = new FormData();
            const localSchedule = newSchedule.split(" ");
            const schDate = localSchedule[0];
            const schTime = localSchedule[1].split(":");
            const scheduleDate = schDate.concat("T");
            const scheduleTime = schTime[0].concat(":").concat(schTime[1]).concat(":00-05:00");
            const schedule = scheduleDate.concat(scheduleTime);

            formdata.append("scheduledAt", schedule);
            if (status === "CANCELLED") {
                formdata.append("status", "SCHEDULED");
            }
            const header = {
                headers: { "content-type": "multipart/form-data" },
            };
            setLoadingReschedule(true);
            JelouApiV1.put(`/campaigns/${id}`, formdata, header)
                .then((result) => {
                    if (status === "CANCELLED") {
                        handleUpdate(id, ["scheduledAt", "status"], [schedule, "SCHEDULED"]);
                    } else {
                        handleUpdate(id, ["scheduledAt"], [schedule]);
                    }
                    setLoadingReschedule(false);
                    closeConfirmationModal();
                })
                .catch((error) => {
                    setLoadingReschedule(false);
                    console.log("Error: ", error);
                });
        } catch (error) {
            setLoadingReschedule(false);
            console.log(error);
        }
    };

    const changeSchedule = ({ value }) => {
        setNewSchedule(value);
    };

    return (
        <>
            {toUpper(original.status) === "SCHEDULED" ? (
                <button className="flex items-center" onClick={() => setShowModal(true)}>
                    <ScheduleIconTab className="fill-none mr-2" height="1.25rem" width="1.25rem" />{" "}
                    <p className="text-[#00B3C7] hover:underline">{dayjs(original.scheduledAt).format("YYYY-MM-DD HH:mm")}</p>
                </button>
            ) : original.status === "CANCELLED" ? (
                <button className="group flex items-center group-hover:underline" onClick={() => setShowModal(true)}>
                    <CalendarIcon className="mr-2 fill-current text-[#E0AE24] group-hover:underline" height="1.25rem" width="1.25rem" />
                    <p className="text-[#E0AE24] group-hover:underline">{t("hsm.monitoring.Reprogramar")}</p>
                </button>
            ) : (
                <p> {dayjs(original.createdAt).format("YYYY-MM-DD HH:mm")}</p>
            )}
            <DateTimeInput
                showModal={showModal}
                setShowModal={setShowModal}
                closeModal={closeModal}
                defaultValue={scheduledAt}
                onChange={changeSchedule}
                setShowConfirmationModal={setShowConfirmationModal}
                showConfirmationModal={showConfirmationModal}
                closeConfirmationModal={closeConfirmationModal}
                reScheduled={reScheduled}
                loadingReschedule={loadingReschedule}
            />
        </>
    );
}
