import { Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { updateDatastore } from "@apps/redux/store";
import { LeftArrow, QuestionCircleIcon, SettingsIcon } from "@apps/shared/icons";
import { AvancedSettingsTester } from "../../Modal/AvancedSettingsTester/Avanced.settings.tester";
import { ListBoxHeadless } from "../../Modal/listBox";
import { COMPONENT_NAME, MODEL_OPTIONS, TESTER_DEFAULT_MODEL_OPTIONS, TESTER_SCORE_OPTIONS, TESTER_TEMPERATURE_BULLETS } from "../../constants";
import { updateDatastoreSettings } from "../../services/brainAPI";
import RangeSlider from "./chatSettings/rangeSlider";

export default function ChatSettings({ chatSettings, setChatSettings, showSettings, setShowSettings }) {
    const [showAvancedSettings, setShowAvancedSettings] = useState(false);
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [model, setModel] = useState({});
    const [score, setScore] = useState({});
    const [disableButton, setDisableButton] = useState(false);

    const datastore = useSelector((state) => state.datastore);

    useEffect(() => {
        const savedSettings = get(datastore, "settings", {});
        if (!chatSettings || !chatSettings.minimum_score || !chatSettings.model || !chatSettings.temperature) {
            const defaultSettings = {
                minimum_score: "0.5",
                model: "gpt-3.5-turbo",
                temperature: "0",
            };
            setChatSettings(defaultSettings);
        }
        setDisableButton(isEqual(chatSettings, savedSettings));
    }, [chatSettings]);

    useEffect(() => {
        if (!isEmpty(chatSettings)) {
            const { model, minimum_score } = chatSettings;
            const selectedModel = MODEL_OPTIONS.find((option) => option.id === model);
            const selectedScore = TESTER_SCORE_OPTIONS.find((option) => option.id === minimum_score);
            setModel(selectedModel);
            setScore(selectedScore);
        }
    }, [chatSettings]);

    const handleUpdateChatSettings = (e) => {
        const { name, value } = e.target;

        setChatSettings((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleUpdateModel = (model) => {
        const { id } = model;
        setChatSettings((prevValues) => ({
            ...prevValues,
            model: id,
        }));
    };

    const handleUpdateScore = (model) => {
        const { id } = model;
        setChatSettings((prevValues) => ({
            ...prevValues,
            minimum_score: id,
        }));
    };

    const handleCancelSettings = async () => {
        const { settings, id: datastoreId } = datastore;
        if (isEmpty(settings)) {
            try {
                await updateDatastoreSettings({ datastoreId, settings: { settings: TESTER_DEFAULT_MODEL_OPTIONS } });
                setChatSettings(TESTER_DEFAULT_MODEL_OPTIONS);
                dispatch(updateDatastore({ settings: TESTER_DEFAULT_MODEL_OPTIONS }));
            } catch (err) {
                console.log("err", err);
            }
        } else {
            setChatSettings(settings);
        }
        setShowSettings(false);
    };

    const handleSaveSettings = async () => {
        const { id: datastoreId, settings } = datastore;
        await updateDatastoreSettings({ datastoreId, settings: { settings: chatSettings } })
            .then((data) => {
                const { settings } = data;
                dispatch(updateDatastore({ settings }));
                successNotification();
            })
            .catch((err) => {
                console.log("Error updating datastore settings", err);
                setChatSettings(settings);
                errorNotification();
            });

        setShowSettings(false);
    };

    return (
        <>
            <Transition.Root appear show={showSettings} as={Fragment}>
                <div className="relative z-10">
                    <div onClick={handleCancelSettings} className="fixed inset-0 rounded-xl bg-black bg-opacity-25 backdrop-blur-[2px]" />
                    <Transition.Child
                        as={Fragment}
                        enter="transition-all ease-in duration-300"
                        enterFrom="translate-y-full"
                        enterTo="h-full"
                        leave="transition-all ease-out duration-300"
                        leaveFrom="translate-y-0"
                        leaveTo="translate-y-full"
                    >
                        <div className="fixed bottom-0 flex h-[80%] w-full flex-1 transform flex-col rounded-xl bg-white text-left align-middle transition-all">
                            <header className="flex h-14 w-full items-center justify-between rounded-t-xl bg-primary-350 px-8 text-lg font-semibold text-primary-200">
                                <span className="flex items-center text-lg font-semibold text-primary-200">
                                    <SettingsIcon className="mr-2" />
                                    {t("common.settings")}
                                </span>
                            </header>
                            <section className="flex w-full flex-1 flex-col space-y-4 overflow-y-scroll p-6 pb-1">
                                <div className="space-y-7 font-bold text-gray-400">
                                    <div>
                                        <span className="flex w-auto flex-row items-center space-x-2 text-sm">{t("common.model")}</span>
                                        <ListBoxHeadless value={model} setValue={handleUpdateModel} list={MODEL_OPTIONS} name={COMPONENT_NAME.MODEL} />
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center space-x-2 text-sm">
                                            <span className="w-auto">{t("common.temperature")}</span>
                                            <Tippy
                                                theme="light"
                                                placement="left"
                                                touch={false}
                                                trigger="mouseenter"
                                                content={<span className="font-light text-gray-610">{t("brain.temperatureInstruction")}</span>}
                                            >
                                                <div>
                                                    <QuestionCircleIcon />
                                                </div>
                                            </Tippy>
                                        </div>
                                        <div className="mx-2 mt-4 mb-2">
                                            <RangeSlider
                                                bulletCount={TESTER_TEMPERATURE_BULLETS}
                                                onChange={handleUpdateChatSettings}
                                                name={COMPONENT_NAME.TEMPERATURE}
                                                temperature={chatSettings?.temperature || 0}
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>{t("common.precise")}</span>
                                            <span>{t("common.neutral")}</span>
                                            <span>{t("common.creative")}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm">{t("common.scoreThreshold")}</div>
                                        <div className="text-13 font-normal leading-5 text-gray-610">{t("brain.scoreInstruction")}</div>
                                        <div className="mt-4">
                                            <ListBoxHeadless value={score} setValue={handleUpdateScore} list={TESTER_SCORE_OPTIONS} />
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAvancedSettings(true)} className="flex items-center gap-2 text-13 text-primary-200 underline">
                                        {t("common.advancedSettings")}
                                        <LeftArrow />
                                    </button>
                                </div>
                            </section>
                            <footer className="h-max-10 flex h-auto w-full items-center justify-between gap-x-3 border-t-1 border-neutral-200 p-2">
                                <button className="w-1/2 rounded-xl border-1 border-neutral-200 bg-neutral-100 p-2 font-bold text-gray-400" onClick={handleCancelSettings}>
                                    {t("common.cancel")}
                                </button>
                                <button className="button-primary w-1/2" disabled={disableButton} onClick={handleSaveSettings}>
                                    {t("common.save")}
                                </button>
                            </footer>
                        </div>
                    </Transition.Child>
                </div>
            </Transition.Root>
            <AvancedSettingsTester isOpen={showAvancedSettings} onClose={() => setShowAvancedSettings(false)} />
        </>
    );
}

const successNotification = () => {
    toast.success(
        <div className="relative flex items-center justify-between">
            <div className="flex">
                <div className="text-15">Ajustes del tester guardados exitosamente</div>
            </div>
        </div>,
        {
            position: toast.POSITION.BOTTOM_RIGHT,
        }
    );
};

const errorNotification = () => {
    toast.error(
        <div className="relative flex items-center justify-between">
            <div className="flex">
                <div className="text-15">No se pudo guardar ajustes del tester</div>
            </div>
        </div>,
        {
            position: toast.POSITION.BOTTOM_RIGHT,
        }
    );
};
