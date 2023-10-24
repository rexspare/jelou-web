import { FormComboboxSelect, Input, Label } from "@apps/shared/common";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import * as React from "react";
import CircularProgress from "../circular-progress/circular-progress";

const MAXIMUM_CHARACTERS = 179;
export function GenConfigSetp1(props) {
    const {
        t,
        templateModalInputNames,
        teamOptions,
        botArray,
        handleChange,
        values,
        handleCombobox,
        languageOptions,
        ArrowSelect,
        isChecked,
        InfoIcon,
        setLockStep,
        setstateVisible,
        MINIMUM_CHARACTERS,
        ErrorIcon,
        classSelect,
        validateElement,
        setScrollControl,
        isInputValuesDontComply,
        shouldAssign,
        setShouldAssign,
        setValues,
        setHelpShouldAss,
        inputCheckboxClassName,
        setFinallySteps,
        finallySteps,
        lockStep,
        stateVisible,
    } = props;

    const warningInfoMsg = (setState) => {
        setState(true);
        setTimeout(() => {
            setState(false);
        }, 4000);
    };

    const handleCheckShouldAssign = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const { name } = e.target;
        if (e.target.type === "checkbox") {
            if (value) {
                setShouldAssign(true);
            } else {
                setShouldAssign(false);
            }
        }
        setValues({ ...values, [name]: value });
    };
    const validaionSecondCheck = get(values, "isVisible", false);
    const errorNameMinChar = !isEmpty(values.displayName) && values.displayName.length < MINIMUM_CHARACTERS;
    const errorDisplayNameMinChar = !isEmpty(values.elementName) && values.elementName.length < MINIMUM_CHARACTERS;
    const errorTypeCharDisplayName = !isEmpty(values.elementName) && !!validateElement;

    React.useEffect(() => {
        if (
            isInputValuesDontComply(values.displayName) ||
            isInputValuesDontComply(values.elementName) ||
            isEmpty(values.language) ||
            isEmpty(values.botId) ||
            isEmpty(values.teamId) ||
            !!validateElement
        ) {
            setLockStep(true);
        } else {
            setLockStep(false);
        }
    }, [values, validateElement]);

    React.useEffect(() => {
        setScrollControl(true);
    }, []);
    React.useEffect(() => {
        if (!validaionSecondCheck) {
            setValues({ ...values, shouldAssign: false });
            setShouldAssign(false);
        }
    }, [validaionSecondCheck]);

    React.useEffect(() => {
        const newfinally = { ...finallySteps, step1: !lockStep };
        setFinallySteps(newfinally);
    }, [lockStep]);

    return (
        <React.Fragment>
            <div className=" relative px-12 pt-12 pb-4">
                <h1 className="pb-6 text-base font-bold  text-gray-400 ">{t("hsm.createTemplateModal.stepsTitle.one")}</h1>
                <div className="pb-3 ">
                    <div className="flex items-center">
                        <span className={`font-bold text-red-950 ${isInputValuesDontComply(values.displayName) ? " opacity-1 pl-2" : " opacity-0"}`}>*</span>
                        <Label className="pl-1" name={templateModalInputNames.name} textColor="text-black" />
                    </div>
                    <Input
                        type="text"
                        value={values.displayName || ""}
                        onChange={handleChange}
                        placeholder={templateModalInputNames.placeholderDisplayName}
                        name="displayName"
                        maxLength={MAXIMUM_CHARACTERS}
                        required={true}
                        className={` w-[21.1rem] rounded-[0.8125rem] text-15 text-black ${
                            !isEmpty(values.displayName) && values.displayName.length < MINIMUM_CHARACTERS
                                ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                : "border-gray-34 bg-white focus:border-gray-39"
                        }`}
                    />
                    <div className="pt-1">
                        <CircularProgress
                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                            MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS}
                            countFieldLength={!isEmpty(values.displayName) ? values.displayName.length : 0}
                        />
                    </div>
                    {errorNameMinChar && (
                        <div className="flex items-center gap-2 pt-1 font-medium">
                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                        </div>
                    )}
                </div>
                <div className="pb-3">
                    <div className="flex items-center">
                        <span className={`font-bold text-red-950 ${isInputValuesDontComply(values.elementName) ? " opacity-1 pl-2" : "opacity-0"}`}>*</span>
                        <Label className="pl-1" name={templateModalInputNames.template} textColor="text-black" />
                    </div>
                    <Input
                        type="text"
                        onChange={handleChange}
                        placeholder={templateModalInputNames.placeholderElementName}
                        name="elementName"
                        required={true}
                        maxLength={MAXIMUM_CHARACTERS}
                        className={` w-[21.1rem] rounded-[0.8125rem] text-15 text-black ${
                            (!isEmpty(values.elementName) && values.elementName.length < MINIMUM_CHARACTERS) || !!validateElement
                                ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                : "border-gray-34 bg-white focus:border-gray-39"
                        }`}
                        value={values.elementName || ""}
                    />
                    <div className="pt-1">
                        <CircularProgress
                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                            MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS}
                            countFieldLength={!isEmpty(values.elementName) ? values.elementName.length : 0}
                        />
                    </div>
                    {errorDisplayNameMinChar && (
                        <div className="flex items-center gap-2 pt-1 font-medium">
                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                        </div>
                    )}
                    {errorTypeCharDisplayName && (
                        <div className="flex items-center gap-2 pt-1 font-medium">
                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.elementNameVal")}</span>
                        </div>
                    )}
                </div>
                <div className="relative pb-3">
                    <div className="flex items-center">
                        <span className={`${isEmpty(values.language) ? "opacity-1 pl-2" : "opacity-0"} font-bold text-red-950`}>*</span>
                        <Label className="pl-1" name={templateModalInputNames.language} textColor="text-black" />
                    </div>
                    <div className="absolute top-1/2 right-[5%]">
                        <ArrowSelect />
                    </div>
                    <div className="[&_button]:[&_div]:[&_div]:[&_div]:!hidden">
                        <FormComboboxSelect
                            options={languageOptions}
                            value={values.language || ""}
                            handleChange={(e) => handleCombobox(e, "language")}
                            name={"language"}
                            className={classSelect}
                            background={"#fff"}
                            hasCleanFilter={false}
                            placeholder={templateModalInputNames.placeholderLanguage}
                        />
                    </div>
                </div>
            </div>
            <hr className="bg-gray-12 h-[1px] border-none" />
            <div className="px-12 py-4">
                <h1 className="pb-2 text-sm font-bold  text-gray-400">{t("hsm.createTemplateModal.createIn")}</h1>
                <div className="relative pb-3">
                    <div className="flex items-center">
                        <span className={`${isEmpty(values.botId) ? "opacity-1 pl-2" : "opacity-0"} font-bold text-red-950`}>*</span>
                        <Label className="pl-1" name={"Bot"} textColor="text-black" />
                    </div>
                    <div className="absolute top-1/2 right-[5%]">
                        <ArrowSelect />
                    </div>
                    <div className={`[&_button]:[&_div]:[&_div]:[&_div]:!hidden ${botArray.length > 5 ? "[&_ul]:[&_div]:[&_div]:!h-[12rem]" : ""} `}>
                        <FormComboboxSelect
                            options={orderBy(botArray, ["name"], ["asc"])}
                            value={values.botId || ""}
                            handleChange={(e) => handleCombobox(e, "botId")}
                            name={"botId"}
                            background={"#fff"}
                            hasCleanFilter={false}
                            className={classSelect}
                            placeholder={templateModalInputNames.placeholderDisplayBot}
                        />
                    </div>
                </div>
                <div className="relative pb-3">
                    <div className="flex items-center">
                        <span className={`${isEmpty(values.teamId) ? "opacity-1 pl-2" : "opacity-0"} font-bold text-red-950`}>*</span>
                        <Label className="pl-1" name={templateModalInputNames.team} textColor="text-black" />
                    </div>
                    <div className="absolute top-1/2 right-[5%]">
                        <ArrowSelect />
                    </div>
                    <div className={`[&_button]:[&_div]:[&_div]:[&_div]:!hidden ${teamOptions.length > 4 ? "[&_ul]:[&_div]:[&_div]:!h-[7rem]" : ""} `}>
                        <FormComboboxSelect
                            options={teamOptions}
                            value={values.teamId || ""}
                            handleChange={(e) => handleCombobox(e, "teamId")}
                            name={"teamId"}
                            background={"#fff"}
                            hasCleanFilter={false}
                            className={classSelect}
                            placeholder={templateModalInputNames.placeholderTeam}
                        />
                    </div>
                </div>

                <div className="flex items-center pt-3 pl-3">
                    <input checked={isChecked} onChange={handleChange} name="isVisible" type="checkbox" className={inputCheckboxClassName} value={values.isVisible} />
                    <Label className="pl-3" name={templateModalInputNames.visible} />
                    <button className="pl-3" onMouseOver={() => warningInfoMsg(setstateVisible)}>
                        <InfoIcon />
                    </button>
                </div>
                {stateVisible && (
                    <div className="absolute top-[70%] left-[48%] w-74 -translate-x-[50%] -translate-y-[50%] ">
                        <p className="animate-fadeIn rounded-20 bg-primary-700 p-3 text-sm text-primary-200">{t("hsm.createTemplateModal.buttonInfo")}</p>
                    </div>
                )}

                <div className="flex items-center pt-3 pl-3">
                    <input
                        checked={!validaionSecondCheck ? false : shouldAssign}
                        onChange={handleCheckShouldAssign}
                        name="shouldAssign"
                        type="checkbox"
                        className={inputCheckboxClassName}
                        value={values.shouldAssign}
                        disabled={!validaionSecondCheck}
                    />
                    <Label className="w-47 pl-3" textColor={` ${!validaionSecondCheck ? "text-gray-325" : "text-gray-400"}`} name={t("hsm.createTemplateModal.checkShouldAssign")} />
                    <button className="pl-3" onMouseOver={() => warningInfoMsg(setHelpShouldAss)}>
                        <InfoIcon />
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}
export default GenConfigSetp1;
