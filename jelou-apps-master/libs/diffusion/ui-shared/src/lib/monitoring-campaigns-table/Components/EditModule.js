import { Popover, Transition } from "@headlessui/react";
import { KebabIcon, CancelIcon, CalendarIcon, CloseIcon } from "@apps/shared/icons";
import { useState, Fragment } from "react";
import { DateTimeInput, Modal } from "./DateTime";
import { JelouApiV1 } from "@apps/shared/modules";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";

export function EditModule({ original, handleUpdate }) {
    const { _id: id, scheduledAt = "", status = "" } = original;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cancelErrorMsg, setCancelErrorMsg] = useState("");
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingReschedule, setLoadingReschedule] = useState(false);
    const [newSchedule, setNewSchedule] = useState(scheduledAt);
    const [showModal, setShowModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const openCancelModal = () => {
        setShowCancelModal(true);
    };
    const { t } = useTranslation();
    const validStatus = status === "SCHEDULED" || status === "CANCELLED";
    const optionList = [
        { name: t("hsm.monitoring.reschedule"), icon: <CalendarIcon fill={"#727C94"} width={18} height={18} /> },
        { name: t("hsm.cancel"), icon: <CancelIcon className={"h-5 w-5"} width={18} height={18} /> },
    ].filter((opt) => {
        if (status === "CANCELLED") {
            return opt.name !== t("hsm.cancel");
        }
        return true;
    });

    const closeConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    const reScheduled = () => {
        // SCHEDULED
        try {
            let formdata = new FormData();
            // formdata.append("name", "prueba cambio de nombre");
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
            // console.log(schedule);
            setLoadingReschedule(true);
            // setTimeout(() => {
            //     handleUpdate(id,"scheduledAt", schedule);
            //     setLoadingReschedule(false);
            //     closeConfirmationModal();
            // }, [10000]);
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

    const cancelCampaign = () => {
        // SCHEDULED
        try {
            let formdata = new FormData();
            // formdata.append("name", "prueba cambio de nombre");
            formdata.append("status", "CANCELLED");
            const header = {
                headers: { "content-type": "multipart/form-data" },
            };
            setLoadingCancel(true);
            JelouApiV1.put(`/campaigns/${id}`, formdata, header)
                .then((result) => {
                    handleUpdate(id, ["status"], ["CANCELLED"]);
                    setLoadingCancel(false);
                    closeCancelModal();
                    if (cancelErrorMsg.length !== 0) setCancelErrorMsg("");
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    setCancelErrorMsg(t("hsm.monitoring.errorMsg"));
                    setLoadingCancel(false);
                });
        } catch (error) {
            console.log(error);
            setLoadingCancel(false);
        }
    };

    const changeSchedule = ({ value }) => {
        setNewSchedule(value);
    };

    return (
        <>
            <Popover className={`relative`}>
                <Popover.Button className={`flex h-4 w-4 items-center justify-center ${validStatus ? "" : "cursor-not-allowed"}`}>
                    <KebabIcon width="1.25rem" height="1.25rem" stroke={validStatus ? "#727C94" : "#A6B4D0"} />
                </Popover.Button>
                {validStatus && (
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 top-0 z-20 mt-6 w-fit px-2 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-outline-modal">
                                <div className="flex flex-col bg-white">
                                    {optionList.map((item, index) => (
                                        <button
                                            onClick={() => {
                                                switch (index) {
                                                    case 0: // reschedule
                                                        openModal();
                                                        break;
                                                    default: // cancel
                                                        openCancelModal();
                                                }
                                            }}
                                            key={index}
                                            className="flex w-full items-center border-b-1 border-gray-50 bg-white px-3 py-2 transition duration-150 ease-in-out hover:bg-gray-50"
                                        >
                                            {item.icon}
                                            <div className="ml-1">
                                                <p className="text-sm font-bold text-gray-400">{item.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                )}
            </Popover>
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
            <Modal closeModal={closeCancelModal} isShow={showCancelModal} widthModal={"w-80"}>
                <div className="h-full w-full rounded-20 bg-white">
                    <div className="flex w-full flex-row justify-between rounded-t-20 bg-red-15 px-8 py-4">
                        <div className="flex flex-row items-center">
                            <CancelIcon stroke={"currentColor"} className={"h-6 w-6 text-red-1050"} width={24} height={24} />
                            <p className="ml-4 text-xl font-bold text-red-1050">{t("hsm.monitoring.cancelTitle")}</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="flex items-center justify-center" onClick={closeCancelModal}>
                                <CloseIcon width={14} height={14} fill={"currentColor"} className={"text-gray-100"} />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col py-4 pl-8 pr-6 text-left">
                        <p className="flex items-center pb-2 text-lg text-red-1050">{t("hsm.monitoring.cancelNote1")}</p>
                        <p className="flex items-center pb-2 text-15 text-gray-400">{t("hsm.monitoring.cancelNote2")}</p>
                        <p className="flex items-center text-base font-bold text-gray-490">{t("hsm.monitoring.confirmationNote3")}</p>
                    </div>
                    {cancelErrorMsg.length > 0 && (
                        <p className="mb-2 flex flex-row-reverse px-8 text-right text-red-1050">
                            {"*"}
                            {t("hsm.monitoring.errorMsg")}
                        </p>
                    )}
                    <footer className="flex w-full justify-end rounded-b-20 bg-white px-6 pb-4">
                        <button
                            type="button"
                            onClick={() => {
                                closeCancelModal();
                            }}
                            className="mr-4 h-9 rounded-3xl border-transparent bg-gray-10 px-5 text-base font-bold text-gray-400 outline-none"
                        >
                            {t("hsm.no")}
                        </button>
                        <button
                            type="button"
                            className={`border flex items-center justify-center rounded-full border-transparent bg-red-15 px-4 py-1 text-base font-bold text-red-1050 focus:outline-none disabled:opacity-60`}
                            onClick={() => {
                                cancelCampaign();
                            }}
                        >
                            {loadingCancel ? (
                                <div className="h-[16px]">
                                    <BeatLoader color={"#727C94"} size={10} />
                                </div>
                            ) : (
                                <>{t("hsm.monitoring.cancelBtn")}</>
                            )}
                        </button>
                    </footer>
                </div>
            </Modal>
        </>
    );
}
