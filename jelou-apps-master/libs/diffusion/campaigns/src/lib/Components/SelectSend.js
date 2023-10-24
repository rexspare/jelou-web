import { DatesPicker } from "@apps/shared/common";
import { RadioGroup } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectSearch, { fuzzySearch } from "react-select-search";
import ConfirmationModal from "./ConfirmationModal";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const SelectSend = (props) => {
    const {
        nextStep,
        setCampaignDate,
        selected,
        setSelected,
        sendHSM,
        settings,
        setOpen,
        open,
        selectedHsm,
        fileSize,
        setCampaignTime,
        campaignName,
        setStepBack4,
    } = props;

    const { t } = useTranslation();
    let { campaignDate } = props;
    const [disable, setDisable] = useState(true);
    const [hourOptions, setHourOptions] = useState([]);
    const [time, setTime] = useState("");
    const [isToday, setIsToday] = useState(true);
    const currentDate = new Date();

    const gotPrevious = () => {
        setStepBack4(true);
        nextStep(3);
    };

    const onChangeDate = (date) => {
        setCampaignDate(date);
    };

    const updateTime = (time) => {
        setDisable(false);
        setCampaignTime(time);
        setTime(time);
    };

    /* const filterHours = () => {
        const currentDate = new Date();
        //const filter = hourOptions.filter((hour) => hour.value > `${currentDate.getHours()} : ${currentDate.getMinutes()}`);

        // if hour is the same then filter minutes
        if(currentDate.getHours() === )
        const filter = hourOptions.filter(
            (hour) => currentDate.getMinutes() < hour.value.split(":")[1]
        );

        console.log("fil", filter);
        return filter;
    };*/

    function displayOptions(startHour = 0, startMinute = 0) {
        let timeList = [];
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < 24) {
            if (currentMinute < 60) {
                let option = `
                   ${currentHour.toString().length === 1 ? "0" : ""}${currentHour}:${
                    currentMinute.toString().length === 1 ? "0" : ""
                }${currentMinute}`.trim();
                timeList.push({ value: option, name: option });
                currentMinute++;
            } else {
                currentHour++;
                currentMinute = 0;
            }
        }

        setHourOptions(timeList);
    }

    useEffect(() => {
        campaignDate.getMonth() === currentDate.getMonth() && campaignDate.getDate() === currentDate.getDate() ? setIsToday(true) : setIsToday(false);
    }, [campaignDate]);

    useEffect(() => {
        isToday ? displayOptions(currentDate.getHours(), currentDate.getMinutes()) : displayOptions();
    }, [isToday]);

    return (
        <div className="flex w-full flex-row">
            <div className="ml-14 flex w-full flex-col justify-center">
                <RadioGroup value={selected} onChange={setSelected}>
                    <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
                    <div className="border-options -space-y-px rounded-md bg-white">
                        {settings.map((setting, settingIdx) => (
                            <RadioGroup.Option
                                key={setting.name}
                                value={setting}
                                className={({ checked }) =>
                                    classNames(
                                        settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                                        settingIdx === settings.length - 1 ? "rounded-bl-md rounded-br-md" : "",
                                        checked ? "z-10 border-indigo-200 bg-indigo-50" : "border-gray-200",
                                        "relative flex cursor-pointer border-1 p-4 focus:outline-none"
                                    )
                                }>
                                {({ active, checked }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                checked ? "border-transparent bg-primary-200" : "border-gray-300 bg-white",
                                                active ? "ring-2 bg-primary-200 ring-offset-2" : "",
                                                "mt-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-1"
                                            )}
                                            aria-hidden="true">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                        </span>
                                        <div className="ml-3 flex flex-col">
                                            <RadioGroup.Label
                                                as="span"
                                                className={classNames(checked ? "text-primary-200" : "text-gray-400", "block text-sm font-medium")}>
                                                {t(setting.name)}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description as="span" className={classNames("block text-sm text-gray-textsecondary")}>
                                                {t(setting.description)}
                                            </RadioGroup.Description>
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>

                {selected.opcion === 1 ? (
                    <div className="flex w-full justify-end">
                        <button className="mt-6 h-12 w-40 rounded-full text-sm font-bold text-gray-450 focus:outline-none" onClick={gotPrevious}>
                            {t("buttons.back")}
                        </button>
                        <button
                            className="button-primary mt-6 h-12 w-40 !rounded-full bg-primary-200 text-sm text-white focus:outline-none"
                            onClick={() => setOpen(true)}>
                            {t("SelectSend.sendCampaign")}
                        </button>
                    </div>
                ) : selected.opcion === 2 ? (
                    <div>
                        <div className="justify-right mt-4 flex w-full">
                            <div className="flex flex-col">
                                <div className="mb-2 ml-4 text-sm font-medium leading-5 text-gray-400 text-opacity-75 xxl:text-15">
                                    {t("SelectSend.date")}
                                </div>
                                <div className="flex items-center">
                                    {/* <span className="text-end mr-1 block font-light text-gray-700">{t("SelectSend.on")}</span>
                                    <input
                                        type="text"
                                        name="date"
                                        className="input-date flatpicker outline-none ml-1 rounded-md border-1 border-gray-200 py-3 px-5"
                                        id="flatpicker"
                                        placeholder={t("Seleccionar fecha")}
                                        // onChange={updateDate}
                                    ></input> */}
                                    <DatesPicker onChangeDate={onChangeDate} dateValue={campaignDate} />
                                </div>
                            </div>
                            <div className="flex items-center justify-center pt-5">
                                <span className="px-4 font-light text-gray-400">{t("SelectSend.at")}</span>
                            </div>

                            <div className="mx-2 flex flex-col">
                                <div className="mb-2 ml-2 text-sm font-medium leading-5 text-gray-400 text-opacity-75 xxl:text-15">
                                    {t("SelectSend.hour")}
                                </div>

                                <div className="relative flex items-center">
                                    {/* <input
                                        type="time"
                                        name="hour"
                                        className="outline-none"
                                        min=""
                                        value={time}
                                        onChange={(ev) => updateTime(ev.target.value)}
                                placeholder={t("SelectSend.selectHour")}></input>*/}
                                    <SelectSearch
                                        options={hourOptions}
                                        className="hsmSelect timeSelect border-input text-opacity-7 flex w-32 flex-1 space-x-3 rounded-input border-1 border-gray-100 border-opacity-50  text-sm text-gray-400"
                                        disabled={false}
                                        filterOptions={fuzzySearch}
                                        value={time}
                                        name={"initialHour"}
                                        search
                                        placeholder={t("schedule.select")}
                                        onChange={(value) => updateTime(value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full justify-end">
                            <button
                                className="mt-6 h-12 w-40 rounded-full text-sm font-bold text-gray-450 focus:outline-none focus:ring-4"
                                onClick={gotPrevious}>
                                {t("buttons.back")}
                            </button>
                            <button
                                className={`button-primary mt-6 h-12 w-40 !rounded-full bg-primary-200 text-sm font-bold text-white focus:outline-none focus:ring-4 ${
                                    disable ? "cursor-not-allowed bg-gray-60" : "bg-primary-200"
                                }`}
                                onClick={() => setOpen(true)}
                                disabled={disable}>
                                {t("SelectSend.sendCampaign")}
                            </button>
                        </div>
                    </div>
                ) : null}
                <ConfirmationModal
                    open={open}
                    setOpen={setOpen}
                    sendHSM={sendHSM}
                    selectedHsm={selectedHsm}
                    fileSize={fileSize}
                    time={selected.opcion}
                    campaignDate={campaignDate}
                    campaignTime={time}
                    campaign={campaignName}
                />
            </div>
        </div>
    );
};

export default SelectSend;
