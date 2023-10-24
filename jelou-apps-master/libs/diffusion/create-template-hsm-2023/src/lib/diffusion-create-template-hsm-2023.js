import { ModalHeadlessSimple, ModalWarning, Stepper } from "@apps/shared/common";
import { ArrowSelect, CloseIcon1, ErrorIcon, InfoIcon } from "@apps/shared/icons";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonsStep4 from "./buttons-step4/buttons-step4";
import Confirm from "./confirm/confirm";

import GenConfigSetp1 from "./gen-config-setp1/gen-config-setp1";
import MsgCategoryStep2 from "./msg-category-step2/msg-category-step2";
import MsgContentStep3 from "./msg-content-step3/msg-content-step3";
import Preview from "./preview/preview";

export function DiffusionCreateTemplateHsm2023(props) {
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        templateModalInputNames,
        handleChange,
        botArray,
        values,
        handleCombobox,
        languageOptions,
        teamOptions,
        isChecked,
        setHsmCategory,
        hsmCategoryOptions,
        hsmCategory,
        templateTypeOptions,
        fileType,
        setFileType,
        loadingMedia,
        handleDocFile,
        clickFilePicker,
        mediaUrlMessage,
        removeDocFile,
        isFileUploaded,
        mediaFileName,
        validateElement,
        getValidFileTypes,
        validateExtension,
        getExtension,
        weightFile,
        onBlur,
        handleChangeParams,
        paramsNew,
        handleEditParams,
        addParamToContent,
        setValues,
        setParamsNew,
        setButtonInputsArray,
        setOpcAuth,
        opcAuth,
        buttonTypes,
        selectedType,
        setSelectedType,
        setButtonsHsm,
        buttonsHsm,
        setIsChecked,
        setValidateElement,
        setWeightFile,
        company,
        setSubmitted,
        currentBotId,
        ParamsFormat,
        validateFileUploaded,
        validateParams,
        checked,
        setLoadingCreate,
        JelouApiV1,
        setConfirmTestHsm,
        setErrorMessage,
        renderToastMessage,
        lang,
        MESSAGE_TYPES,
    } = props;
    const MINIMUM_CHARACTERS = 4;
    const auth = "AUTHENTICATION";
    const { t } = useTranslation();
    const [lockStep, setLockStep] = useState(false);
    const [openModWarn, setopenModWarn] = useState(false);
    const [stateVisible, setstateVisible] = useState(false);
    const [helpShouldAss, setHelpShouldAss] = useState(false);
    const [scrollControl, setScrollControl] = useState(false);
    const [shouldAssign, setShouldAssign] = useState(false);
    const [allowChangeCat, setAllowChangeCat] = useState(false);
    const [minutesExp, setMinutesExp] = React.useState(0);
    const array = isEmpty(paramsNew) ? [] : paramsNew;
    const [foundOpcScurity, setFoundOpcScurity] = React.useState(false);
    const [foundOpcCodeExp, setFoundOpcCodeExp] = React.useState(false);
    const [typeAction, setTypeAction] = React.useState([]);
    const [exampleAuth, setExampleAuth] = React.useState("");
    const [typeUrl, setTypeUrl] = React.useState([]);

    const [finallySteps, setFinallySteps] = React.useState({ step1: false, step2: false, step3: false, step4: false, step5: false });

    const regexLettersNumb = /^([a-zA-Z0-9-ZÀ-ÿ\u00C0-\u017F.:,()%¿?¡!"'\-_\s*]+$)/;

    const closeModalWarning = () => setopenModWarn(false);
    const openWarning = () => {
        setopenModWarn(true);
    };

    const onCloseTmpl = () => {
        if (mediaFileName) {
            removeDocFile();
        }
        setIsCreateModalOpen(false);
        setLockStep(false);
        setShouldAssign(false);
        setAllowChangeCat(false);
        setstateVisible(false);
        setScrollControl(false);
        setMinutesExp("");
        setFoundOpcScurity(false);
        setFoundOpcCodeExp(false);
        setTypeAction([]);
        setExampleAuth("");
        setTypeUrl([]);
        setValues({
            teamId: {
                id: "noTeam",
                name: t("hsm.noTeam"),
            },
        });
        setIsChecked(false);
        setHsmCategory("UTILITY");
        setFileType("HSM");
        setValidateElement(false);
        setWeightFile(null);
        setParamsNew([]);
        setButtonInputsArray([1]);
        setOpcAuth([]);
        setSelectedType({ id: "NONE", name: t("hsm.none") });
        setButtonsHsm([{ text: "", type: "" }]);
    };
    const createHsmTemplate = async () => {
        for (let i = 0; i < buttonsHsm.length; i++) {
            if (buttonsHsm[i].isDynamicUrl) {
                const dynamicPart = "{{1}}";
                buttonsHsm[i].url = buttonsHsm[i].url + dynamicPart;
            }
        }
        try {
            const companyId = get(company, "id");
            setSubmitted(true);
            let type = get(values, "type.id", "HSM");
            let botId = get(values, "botId.id", currentBotId);
            let paramsNumber = get(values, "paramsNumber");
            const { displayName, elementName, language, template, teamId, mediaUrl, header, footer, extraSettings, shouldAssign } = values;
            if (isEmpty(paramsNumber)) {
                paramsNumber = "0";
            }
            const templateExample = ParamsFormat(template);

            validateFileUploaded();
            validateParams(paramsNew, true);
            if (
                !isEmpty(displayName) &&
                !isEmpty(elementName) &&
                !isEmpty(template) &&
                !isEmpty(templateExample) &&
                template.length <= 1024 &&
                displayName.length <= 256 &&
                paramsNumber <= 9 &&
                !isEmpty(type) &&
                !isEmpty(botId) &&
                validateFileUploaded() &&
                validateParams(paramsNew, true) &&
                elementName.toLowerCase() === elementName &&
                !elementName.includes(" ")
            ) {
                const obj = {
                    displayName: displayName,
                    template: template,
                    example: parseInt(`${paramsNumber}`) > 0 ? templateExample : template,
                    elementName: elementName,
                    params: paramsNew,
                    paramsNumber: paramsNumber,
                    isVisible: checked,
                    shouldAssign: shouldAssign,
                    type: type,
                    ...(language ? { language: language.id } : { language: "es" }),
                    botId: botId,
                    companyId,
                    header: header,
                    exampleHeader: header,
                    footer: footer,
                    category: hsmCategory, // "ALERT_UPDATE",
                    ...(mediaUrl ? { mediaUrl } : {}),
                    ...(teamId && get(teamId, "id", "noTeam") !== "noTeam" && `${get(teamId, "id", "-1")}` !== "-1" ? { teamId: teamId.id } : {}),
                    ...(selectedType.id !== "NONE" ? { buttons: buttonsHsm } : {}),
                    extraSettings: extraSettings,
                    interactiveAction: selectedType.id,
                };
                setLoadingCreate(true);

                JelouApiV1.post(`/bots/${botId}/templates`, obj, { params: { sendToAprove: true } })
                    .then((rpta) => {
                        setLoadingCreate(false);
                        setIsCreateModalOpen(false);
                        setConfirmTestHsm(false);
                        if (rpta.status === 200) {
                            onCloseTmpl();
                            renderToastMessage(t("hsm.createTemplateModal.sendSucces"), MESSAGE_TYPES.SUCCESS);
                        }
                    })
                    .catch((error) => {
                        setLoadingCreate(false);
                        const data = error.response.data;
                        const { status } = error.response;
                        const newElementName = {
                            en: "template name",
                            es: "nombre de la plantilla",
                            pt: "nome do modelo",
                        };

                        const elementNameChange = ({ completeMessage, lang }) => {
                            return completeMessage.replace("elementName", newElementName[lang]);
                        };

                        if (`${status}`.startsWith("5")) {
                            const clientMessage = data.error.clientMessages;
                            setErrorMessage(clientMessage[lang]);
                            renderToastMessage(clientMessage[lang], MESSAGE_TYPES.ERROR);
                        } else if (`${status}`.startsWith("4")) {
                            const clientMessage = data.validationError.elementName;
                            const clientMessage2 = data.message[0];
                            let completeMessage = "";
                            if (!isEmpty(completeMessage) || completeMessage !== undefined) {
                                clientMessage !== undefined
                                    ? clientMessage.forEach((message) => {
                                          completeMessage += message[lang] + "\n";
                                      })
                                    : (completeMessage = clientMessage2);
                                setErrorMessage(completeMessage);
                                renderToastMessage(elementNameChange({ completeMessage, lang }), MESSAGE_TYPES.ERROR);
                            }
                        }
                    });
            }
        } catch (error) {
            setLoadingCreate(false);
        }
    };

    const isInputValuesDontComply = (fieldValue) => {
        return isEmpty(fieldValue) || fieldValue.length < MINIMUM_CHARACTERS;
    };
    const validationNameChar = (value) => {
        return regexLettersNumb.test(value) || isEmpty(value);
    };
    const inputCheckboxClassName = "form-checkbox h-4 w-4 rounded-[0.2em] border-gray-34 text-primary-200 transition duration-150 ease-in-out";
    const classSelect = "border text-15 border-gray-36 focus:!border-blue-200  focus:shadow focus:!shadow-blue-200  w-full border-spacing-[0.98rem] rounded-[0.8125rem] bg-transparent text-black ";
    const stepsObj = [
        {
            step: 1,
            title: t("hsm.createTemplateModal.stepsTitle.one"),
        },
        {
            step: 2,
            title: t("hsm.createTemplateModal.stepsTitle.two"),
        },
        {
            step: 3,
            title: t("hsm.createTemplateModal.stepsTitle.three"),
        },
        {
            step: 4,
            title: t("hsm.createTemplateModal.stepsTitle.four"),
        },
        {
            step: 5,
            title: t("hsm.createTemplateModal.stepsTitle.five"),
        },
    ];

    return (
        <ModalHeadlessSimple className="h-[44rem] w-[68rem] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]" isShow={isCreateModalOpen} overflow="overflow-visible">
            <button onClick={openWarning} className="absolute top-0 right-0 z-50 pr-8 pt-8">
                <CloseIcon1 className="cursor-pointer fill-current text-xl text-black " width="16" height="16" />
            </button>
            <div className="">
                <Stepper stepsObj={stepsObj}>
                    {({ next, previous, getCurrentState, StepsThread }) => {
                        const stateCurrent = getCurrentState();
                        return (
                            <div className="flex h-[44rem] w-full justify-center  text-left">
                                <div className="flex w-[25%] flex-col items-center bg-primary-350 pt-12">
                                    <h2 className="mr-4 w-44 text-xl font-bold text-primary-200">{t("hsm.createTemplate")}</h2>
                                    <div className="pt-5">{StepsThread()}</div>
                                </div>
                                <div className={` w-[40%] ${scrollControl ? "h-[40rem] overflow-y-scroll" : ""} `}>
                                    {stateCurrent === "step-1" && (
                                        <GenConfigSetp1
                                            t={t}
                                            templateModalInputNames={templateModalInputNames}
                                            handleChange={handleChange}
                                            values={values}
                                            handleCombobox={handleCombobox}
                                            languageOptions={languageOptions}
                                            ArrowSelect={ArrowSelect}
                                            botArray={botArray}
                                            teamOptions={teamOptions}
                                            isChecked={isChecked}
                                            InfoIcon={InfoIcon}
                                            setstateVisible={setstateVisible}
                                            setLockStep={setLockStep}
                                            lockStep={lockStep}
                                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                                            ErrorIcon={ErrorIcon}
                                            classSelect={classSelect}
                                            validateElement={validateElement}
                                            setScrollControl={setScrollControl}
                                            isInputValuesDontComply={isInputValuesDontComply}
                                            setShouldAssign={setShouldAssign}
                                            shouldAssign={shouldAssign}
                                            setValues={setValues}
                                            setHelpShouldAss={setHelpShouldAss}
                                            inputCheckboxClassName={inputCheckboxClassName}
                                            setFinallySteps={setFinallySteps}
                                            finallySteps={finallySteps}
                                            stateVisible={stateVisible}
                                        />
                                    )}
                                    {stateCurrent === "step-2" && (
                                        <MsgCategoryStep2
                                            hsmCategoryOptions={hsmCategoryOptions}
                                            setHsmCategory={setHsmCategory}
                                            templateModalInputNames={templateModalInputNames}
                                            hsmCategory={hsmCategory}
                                            setLockStep={setLockStep}
                                            setSelectedType={setSelectedType}
                                            setButtonsHsm={setButtonsHsm}
                                            t={t}
                                            allowChangeCat={allowChangeCat}
                                            setAllowChangeCat={setAllowChangeCat}
                                            inputCheckboxClassName={inputCheckboxClassName}
                                            values={values}
                                            setValues={setValues}
                                            setFinallySteps={setFinallySteps}
                                            finallySteps={finallySteps}
                                            setParamsNew={setParamsNew}
                                        />
                                    )}
                                    {stateCurrent === "step-3" && (
                                        <MsgContentStep3
                                            templateModalInputNames={templateModalInputNames}
                                            hsmCategory={hsmCategory}
                                            templateTypeOptions={templateTypeOptions}
                                            handleCombobox={handleCombobox}
                                            values={values}
                                            ArrowSelect={ArrowSelect}
                                            classSelect={classSelect}
                                            t={t}
                                            fileType={fileType}
                                            setFileType={setFileType}
                                            loadingMedia={loadingMedia}
                                            handleDocFile={handleDocFile}
                                            clickFilePicker={clickFilePicker}
                                            mediaUrlMessage={mediaUrlMessage}
                                            removeDocFile={removeDocFile}
                                            isFileUploaded={isFileUploaded}
                                            mediaFileName={mediaFileName}
                                            isInputValuesDontComply={isInputValuesDontComply}
                                            handleChange={handleChange}
                                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                                            ErrorIcon={ErrorIcon}
                                            getValidFileTypes={getValidFileTypes}
                                            validateExtension={validateExtension}
                                            getExtension={getExtension}
                                            weightFile={weightFile}
                                            onBlur={onBlur}
                                            handleChangeParams={handleChangeParams}
                                            setLockStep={setLockStep}
                                            setScrollControl={setScrollControl}
                                            paramsNew={paramsNew}
                                            handleEditParams={handleEditParams}
                                            addParamToContent={addParamToContent}
                                            array={array}
                                            setValues={setValues}
                                            languageOptions={languageOptions}
                                            setParamsNew={setParamsNew}
                                            setButtonInputsArray={setButtonInputsArray}
                                            setSelectedType={setSelectedType}
                                            setOpcAuth={setOpcAuth}
                                            opcAuth={opcAuth}
                                            setMinutesExp={setMinutesExp}
                                            minutesExp={minutesExp}
                                            setFoundOpcScurity={setFoundOpcScurity}
                                            setFoundOpcCodeExp={setFoundOpcCodeExp}
                                            foundOpcScurity={foundOpcScurity}
                                            foundOpcCodeExp={foundOpcCodeExp}
                                            auth={auth}
                                            setExampleAuth={setExampleAuth}
                                            exampleAuth={exampleAuth}
                                            allowChangeCat={allowChangeCat}
                                            validationNameChar={validationNameChar}
                                        />
                                    )}
                                    {stateCurrent === "step-4" && (
                                        <ButtonsStep4
                                            auth={auth}
                                            t={t}
                                            hsmCategory={hsmCategory}
                                            templateModalInputNames={templateModalInputNames}
                                            ArrowSelect={ArrowSelect}
                                            buttonTypes={buttonTypes}
                                            selectedType={selectedType}
                                            setSelectedType={setSelectedType}
                                            classSelect={classSelect}
                                            setButtonsHsm={setButtonsHsm}
                                            buttonsHsm={buttonsHsm}
                                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                                            typeAction={typeAction}
                                            setTypeAction={setTypeAction}
                                            setScrollControl={setScrollControl}
                                            typeUrl={typeUrl}
                                            setTypeUrl={setTypeUrl}
                                            setLockStep={setLockStep}
                                            validationNameChar={validationNameChar}
                                        />
                                    )}
                                    {stateCurrent === "step-5" && <Confirm t={t} />}
                                </div>
                                <div className="relative  w-[35%] bg-gray-14">
                                    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                                        <Preview
                                            t={t}
                                            values={values}
                                            array={array}
                                            mediaUrlMessage={mediaUrlMessage}
                                            fileType={fileType}
                                            mediaFileName={mediaFileName}
                                            buttonsHsm={buttonsHsm}
                                            selectedType={selectedType}
                                        />
                                    </div>
                                </div>
                                {helpShouldAss && (
                                    <div className="absolute top-[85%] left-[70%] -translate-x-[50%] -translate-y-[50%] ">
                                        <p className="animate-fadeIn rounded-20 bg-primary-700 p-3 text-sm text-primary-200">{t("hsm.createTemplateModal.helpShouldAssign")}</p>
                                    </div>
                                )}

                                <footer className="">
                                    <div className="absolute bottom-0 right-[40%]  mb-4 flex justify-end gap-4 pt-4">
                                        <button type="button" onClick={previous} className="rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none">
                                            {stateCurrent === "step-5" ? t("hsm.createTemplateModal.backToEdit") : t("buttons.back")}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={lockStep}
                                            className={` ${
                                                lockStep ? "h-[2.5rem] rounded-20 bg-gray-35 px-2 text-gray-325" : "button-gradient-xl"
                                            }  !min-w-[8rem] disabled:cursor-not-allowed disabled:bg-opacity-60`}
                                            onClick={(evt) => {
                                                evt.preventDefault();
                                                if (stateCurrent === "step-5") {
                                                    createHsmTemplate();
                                                } else {
                                                    next();
                                                }
                                            }}
                                        >
                                            {stateCurrent === "step-5" ? t("hsm.createTemplateModal.confirmCreate") : t("buttons.next")}
                                        </button>
                                    </div>
                                </footer>
                            </div>
                        );
                    }}
                </Stepper>
                {openModWarn && <ModalWarning showModal={openModWarn} closeModal={closeModalWarning} closeAndClear={onCloseTmpl} />}
            </div>
        </ModalHeadlessSimple>
    );
}
export default DiffusionCreateTemplateHsm2023;
