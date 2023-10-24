import React, { useState, Fragment, useEffect, useRef } from "react";
import FormModal from "../form-modal/form-modal";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import SelectDropdown from "../select-dropdown/select-dropdown";
import SelectMobile from "../select-mobile/select-mobile";
import { RadioGroup } from "@headlessui/react";
import { Menu, Transition } from "@headlessui/react";

import { LeaveIcon, OtherMotiveIcon, DownIcon } from "@apps/shared/icons";

const LeaveRoom = (props) => {
    const { closeLeaveModal, names, leaveRoom, leaving, flows, bot, type } = props;
    const { t } = useTranslation();
    const [otherMotive, setOtherMotive] = useState("Otros Motivos");
    const motivesStatus = useSelector((state) => state.motives);
    const allMotives = motivesStatus.filter((motive) => motive.type === type);
    const motives = allMotives.filter((motive) => motive.visualizationType === "buttons");
    const otherMotives = allMotives.filter((motive) => motive.visualizationType === "dropdown");
    const selectedMotive = allMotives.find((motive) => motive.isSelected === true);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const company = useSelector((state) => state.company);

    const [flowId, setFlowId] = useState(null);

    const [selected, setSelected] = useState(selectedMotive);
    const hasSetFlowOnLeave = get(bot, "properties.setFlowOnLeave", false);
    const disableCloseConversation = get(company, "properties.disableCloseConversation", false);
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        if (selected && selected.visualizationType !== "dropdown") {
            setOtherMotive("Otros Motivos");
            if (disableCloseConversation) setCanClose(true);
        }
    }, [selected]);

    let name = get(props, "names", "este usuario");

    if (isEmpty(name)) {
        name = get(props, "name", "este usuario").split("-")[0];
    }

    const selectFlow = (data) => {
        setSelected(null);
        setFlowId(data);
    };

    const selectFlowMobile = ({ target }) => {
        const { value } = target;
        setFlowId(value);
    };

    const handleSelectOption = (value) => {
        const name = get(value, "name", "");
        setOtherMotive(get(value, `translations.${lang}`, name));
        setSelected(value);
    };
    const ref = useRef();

    return (
        <FormModal canOverflow={true} themeColor="primary-200" onClose={closeLeaveModal} ref={ref}>
            <div className={`flex w-full flex-col ${isEmpty(allMotives) ? "pb-8" : "pb-4"}`}>
                <div className="justify-left flex flex-col md:flex-row">
                    <div className="mr-0 hidden w-1/2 flex-col justify-center md:mr-10 md:flex">
                        <LeaveIcon className="mx-auto" width="18.875rem" height="19.875rem" fill="none" />
                    </div>
                    <div className={`flex flex-col ${!hasSetFlowOnLeave && "justify-center"} space-y-3 text-left md:w-1/2 md:pr-8`}>
                        <span className="md:max-w-132 pr-3 text-xl font-bold leading-8 text-primary-200 sm:text-2xl">{`${t(`Estás a punto de salir de la conversación con `)} ${names}`}</span>
                        <div className="text-sm font-light text-gray-450 sm:text-base">{t("pma.Si abandonas este chat, es posible que no puedas contactar a este usuario nuevamente.")}</div>
                        <div className="pt-3">
                            {hasSetFlowOnLeave ? (
                                <span className="text-base font-bold text-gray-400">{t("pma.Motivo de Salida")}</span>
                            ) : (
                                <span className="text-base font-bold text-gray-400">{t("pma.¿Te gustaría continuar?")}</span>
                            )}

                            <div className="w-full pt-2 sm:pr-10">
                                <div className="mx-auto w-full">
                                    {!isEmpty(allMotives) && (
                                        <>
                                            <RadioGroup value={selected} onChange={setSelected}>
                                                <div className="space-y-2">
                                                    {motives.map((motive) => (
                                                        <RadioGroup.Option
                                                            key={motive.name}
                                                            value={motive}
                                                            className={({ active, checked }) =>
                                                                `${active ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300 " : ""} ${
                                                                    checked ? "bg-primary-200 text-white" : "bg-white text-gray-400"
                                                                } relative flex cursor-pointer rounded-lg border-2 border-primary-200 px-5 py-2 font-normal shadow-md hover:bg-primary-200/65 hover:font-semibold hover:text-white focus:outline-none`
                                                            }
                                                        >
                                                            {({ active }) => (
                                                                <div className="flex w-full items-center justify-between">
                                                                    <div className="flex">
                                                                        <div className="flex flex-row items-center text-sm">
                                                                            {motive.icon && (
                                                                                <div className="absolute left-0 ml-2 w-8">
                                                                                    <img src={get(motive, "icon", "")} alt="icono"></img>
                                                                                </div>
                                                                            )}
                                                                            <RadioGroup.Label as="p" className={`${motive.icon ? "pl-6" : ""} max-w-md  truncate`}>
                                                                                {get(motive, `translations.${lang}`, get(motive, "name", ""))}
                                                                            </RadioGroup.Label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </RadioGroup.Option>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                            {!isEmpty(otherMotives) && (
                                                <Menu as="div" className="relative mt-2 block text-left">
                                                    <div>
                                                        <Menu.Button
                                                            className={`focus-visible:ring-2 border-primary flex w-full items-center justify-between rounded-lg border-2 px-5 py-2 text-sm font-normal hover:bg-primary-200/65 hover:font-semibold hover:text-white focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75 ${
                                                                selected.visualizationType === "dropdown" ? "bg-primary-200 text-white" : "bg-white text-gray-400"
                                                            }`}
                                                        >
                                                            <div className="flex">
                                                                <div className="absolute left-0 top-0 ml-5 h-full pt-3">
                                                                    <OtherMotiveIcon width="0.75rem" height="1.125rem" />
                                                                </div>
                                                                <span className="ml-6">{otherMotive}</span>
                                                            </div>
                                                            <DownIcon className="text-primary h-6 fill-current" />
                                                        </Menu.Button>
                                                    </div>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="divide-y ring-1 ring-opacity-5 menu-drop-top absolute right-0 mt-2 w-full origin-top-right divide-gray-400/75 rounded-lg bg-white shadow-lg ring-black focus:outline-none">
                                                            <div className="px-1 py-1 ">
                                                                {otherMotives.map((otherMotive) => (
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                onClick={() => handleSelectOption(otherMotive)}
                                                                                className={`${
                                                                                    active ? "bg-primary-200/65 text-white" : "text-gray-400"
                                                                                } group flex w-full items-center rounded-lg px-5 py-3 text-sm`}
                                                                            >
                                                                                {get(otherMotive, `translations.${lang}`, get(otherMotive, "name", ""))}
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                ))}
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            )}
                                        </>
                                    )}
                                    {hasSetFlowOnLeave && isEmpty(allMotives) && (
                                        <div className="mt-2 w-full">
                                            <SelectDropdown
                                                className="hidden w-full sm:block"
                                                value={flowId}
                                                options={orderBy(flows, ["title"], ["asc"])}
                                                onChange={selectFlow}
                                                placeholder={t("pma.Seleccionar flujo")}
                                            ></SelectDropdown>
                                            <SelectMobile onChange={selectFlowMobile} name="flows" options={flows} placeholder={t("pma.Seleccionar flujo")} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-modal-footer mt-0 flex w-full items-center justify-center rounded-b-lg pt-2 pr-10 font-bold md:justify-end xxl:pt-8">
                    <button className="mr-4 flex w-32 justify-center rounded-3xl border-transparent bg-gray-10 py-3 px-5 font-bold text-gray-400 focus:outline-none" onClick={closeLeaveModal}>
                        {t("pma.No")}
                    </button>
                    {leaving ? (
                        <button className="flex w-32 justify-center rounded-3xl border-transparent bg-primary-200 py-3 px-5 font-bold text-white focus:outline-none">
                            <BeatLoader size={"0.625rem"} color="#ffff" />
                        </button>
                    ) : (
                        <button
                            className="disabled:hover:bg-primay-200/50 flex w-32 justify-center rounded-3xl border-transparent bg-primary-200 py-3 px-5 font-bold text-white hover:bg-primary-200/65 focus:outline-none disabled:cursor-not-allowed disabled:bg-primary-200/50"
                            disabled={!canClose && disableCloseConversation}
                            onClick={() => leaveRoom(closeLeaveModal, flowId, selected)}
                        >
                            {t("pma.Si")}
                        </button>
                    )}
                </div>
            </div>
        </FormModal>
    );
};
export default LeaveRoom;
