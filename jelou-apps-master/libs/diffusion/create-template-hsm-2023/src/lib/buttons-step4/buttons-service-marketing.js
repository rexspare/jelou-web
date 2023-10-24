import { FormComboboxSelect, Input, Label } from "@apps/shared/common";
import { AlertCircleYellow, CloseIcon1, ErrorIcon, HelpIcon, PlusIcon3 } from "@apps/shared/icons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import PhoneInput from "react-phone-number-input";
import CircularProgress from "../circular-progress/circular-progress";

export function ButtonsServMark(props) {
    const {
        templateModalInputNames,
        t,
        ArrowSelect,
        buttonTypes,
        selectedType,
        handleButtonType,
        setButtonsHsm,
        buttonsHsm,
        errorWarning,
        classSelect,
        typeAction,
        setTypeAction,
        setScrollControl,
        setLockStep,
        typeUrl,
        setTypeUrl,
        MAX_CHAR_BUTTONS_FLOW,
        validationNameChar,
        MINIMUM_CHARACTERS,
    } = props;

    const [helpMsg, setHelpMsg] = React.useState(false);
    const buttonsExternal = "CALL_TO_ACTION";
    const buttonsFlow = "QUICK_REPLY";

    const handlePhone = (value, index) => {
        const listPhone = [...buttonsHsm];
        listPhone[index] = {
            phone_number: value,
            text: buttonsHsm[index].text,
            type: buttonsHsm[index].type,
        };
        setButtonsHsm(listPhone);
    };

    const buttonURL = [
        { id: "UrlStatic", name: t("hsm.createTemplateModal.staticUrl") },
        { id: "UrlDynamic", name: t("hsm.createTemplateModal.dinamicUrl") },
    ];
    const buttonsExtOpt = [
        { id: "URL", name: t("hsm.URL") },
        { id: "PHONE_NUMBER", name: t("hsm.createTemplateModal.contact") },
    ];

    const handleHelpMsg = () => {
        setHelpMsg(true);
        setTimeout(() => {
            setHelpMsg(false);
        }, 6000);
    };

    const isValidUrlStatic = (urlString) => {
        const urlDinamic = urlString.search(/{{[1-9]}}/) > 0;
        try {
            if (urlDinamic === false) {
                if (!urlString.includes("http://") && !!urlDinamic) new URL(urlString, "http://");
                else new URL(urlString);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    const isValidPhone = (phoneString) => {
        // var phonePattern = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g);
        var phonePattern = new RegExp(/^\+\d+$/);
        return phonePattern.test(phoneString);
    };

    const handleTypeAction = (event, index) => {
        const { name, id } = event;
        const listAction = [...typeAction];
        listAction[index] = { name: name, id: id, index: index };
        const listType = [...buttonsHsm];
        listType[index]["type"] = id;
        setButtonsHsm(listType);
        setTypeAction(listAction);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const listInput = [...buttonsHsm];
        listInput[index][name] = value;
        setButtonsHsm(listInput);
    };
    const handleInputFlowChange = (e, index) => {
        const { value } = e.target;
        const listInput = [...buttonsHsm];
        listInput[index] = { text: value, type: "QUICK_REPLY" };
        setButtonsHsm(listInput);
    };

    const handleInputExternalButtons = (e, index) => {
        const { value, name } = e.target;
        const listUrl = [...buttonsHsm];
        const listPhone = [...buttonsHsm];
        let allList = [...buttonsHsm];

        if (name === "urlStatic" || name === "UrlDynamic") {
            listUrl[index] = {
                url: value,
                example: name === "urlStatic" ? [value] : [],
                isDynamicUrl: name === "UrlDynamic",
                text: buttonsHsm[index].text,
                type: buttonsHsm[index].type,
            };
        }

        if (name === "UrlDynamicExample") {
            listUrl[index] = {
                url: buttonsHsm[index].url,
                example: [value],
                isDynamicUrl: name === "UrlDynamicExample",
                text: buttonsHsm[index].text,
                type: buttonsHsm[index].type,
            };
        }

        if (name === "phoneNumber") {
            listPhone[index] = {
                phone_number: value,
                text: buttonsHsm[index].text,
                type: buttonsHsm[index].type,
            };
        }
        if (name === "urlStatic" || name === "UrlDynamic" || name === "UrlDynamicExample") {
            allList = [...listUrl];
        } else if (name === "phoneNumber") {
            allList = [...listPhone];
        }

        setButtonsHsm(allList);
    };
    const handleTypeUrl = (e, index) => {
        const { name, id } = e;
        const type = [];
        type[index] = { name: name, id: id, index: index };
        setTypeUrl(e);
        const listUrl = [...buttonsHsm];
        listUrl[index] = {
            url: "",
            example: [],
            isDynamicUrl: buttonsHsm[index].isDynamicUrl,
            text: buttonsHsm[index].text,
            type: buttonsHsm[index].type,
        };
        setButtonsHsm(listUrl);
    };

    const buttonAdd = (handleAddClick, isDisable) => {
        return (
            <div className="pb-2">
                <button className="flex items-center justify-center pl-6" onClick={handleAddClick} disabled={isDisable}>
                    <PlusIcon3 stroke={`${isDisable ? "#B7BDCB" : "#00B3C7"}`} />
                    <h6 className={` pl-2 text-15 font-bold ${isDisable ? "text-gray-325" : "text-primary-200"} `}>{t("hsm.createTemplateModal.addNewButton")}</h6>
                </button>
            </div>
        );
    };

    const handleRemoveClick = (index) => {
        const list = [...buttonsHsm];
        const listTipeAction = typeAction.filter((type) => type.index !== index);
        list.splice(index, 1);

        setTypeAction(listTipeAction);
        setButtonsHsm(list);
    };

    const handleAddClick = () => {
        setButtonsHsm([...buttonsHsm, { text: "", type: "" }]);
    };
    React.useEffect(() => {
        setScrollControl(buttonsHsm.length > 1 || !isEmpty(typeUrl));
    }, [buttonsHsm, typeUrl]);

    const incompleteButtonsExtarnal = ({ buttonsHsm, UrlParam, validateUrlStatic, allNameButtonCompleted, existUrl, validateUrlDynamic, validatePhoneNum, phoneParam, existPhoneNum }) => {
        const isSingleButton = buttonsHsm.length === 1;
        const isTwoButton = buttonsHsm.length === 2;
        const validateUrl = validateUrlStatic || validateUrlDynamic;

        if (isSingleButton) {
            if (validateUrl) {
                return !!(UrlParam && allNameButtonCompleted && existUrl);
            } else if (validatePhoneNum) {
                return !!(phoneParam && allNameButtonCompleted && existPhoneNum);
            }
        } else if (!!isTwoButton && !!validateUrl && !!validatePhoneNum) {
            return !!(UrlParam && allNameButtonCompleted && existUrl && phoneParam && existPhoneNum);
        }

        return false;
    };
    React.useEffect(() => {
        const allNameButtonCompleted = !isEmpty(buttonsHsm) ? buttonsHsm.every((param) => !isEmpty(param.text) && validationNameChar(param.text) && !errorWarning(param.text)) : false;
        const UrlParam = !isEmpty(buttonsHsm) ? buttonsHsm.some((param) => !isEmpty(param.type) && param.type === "URL") : false;
        const phoneParam = !isEmpty(buttonsHsm) ? buttonsHsm.some((param) => !isEmpty(param.type) && param.type === "PHONE_NUMBER") : false;
        const existUrl = !isEmpty(buttonsHsm) ? buttonsHsm.some((param) => !isEmpty(param.url)) : false;

        const existPhoneNum = !isEmpty(buttonsHsm) ? buttonsHsm.some((param) => !isEmpty(param.phone_number)) : false;
        const phoneNumber = !isEmpty(buttonsHsm) ? buttonsHsm.find((param) => param.phone_number) : "";
        const isValidPhoneNum = !isEmpty(phoneNumber) ? isValidPhone(phoneNumber.phone_number) : false;

        const url = !isEmpty(buttonsHsm) ? buttonsHsm.find((param) => param.url) : "";
        const example = !isEmpty(buttonsHsm) ? buttonsHsm.find((param) => param.example) : "";
        const validUrlStat = !isEmpty(url) && url.isDynamicUrl === false ? isValidUrlStatic(url.url) : false;
        const validUrlDyn =
            !isEmpty(url) && !isEmpty(example) && url.isDynamicUrl === true ? isValidUrlStatic(url.url) && isValidUrlStatic(example.example[0] !== undefined ? example.example[0] : "") : false;

        if (selectedType.id === "NONE") {
            setLockStep(false);
            return;
        }

        if (selectedType.id === buttonsFlow) {
            setLockStep(!allNameButtonCompleted);
            return;
        }

        if (
            selectedType.id === buttonsExternal &&
            incompleteButtonsExtarnal({
                buttonsHsm,
                UrlParam,
                validateUrlStatic: validUrlStat,
                allNameButtonCompleted,
                existUrl,
                validateUrlDynamic: validUrlDyn,
                validatePhoneNum: isValidPhoneNum,
                phoneParam,
                existPhoneNum,
            })
        ) {
            setLockStep(false);
        } else {
            setLockStep(true);
        }
    }, [selectedType, buttonsHsm, typeAction, typeUrl]);

    const isDisableExternalAdd = selectedType.id === buttonsExternal && buttonsHsm.length > 1;
    const isDisableFlowAdd = selectedType.id === buttonsFlow && buttonsHsm.length > 2;

    return (
        <React.Fragment>
            <div className="pb-2">
                <Label name={templateModalInputNames.buttonsType} textColor="text-black" />
                {selectedType.id === "NONE" && <p className="py-2 text-15">{t("hsm.createTemplateModal.typeButtonDefault")}</p>}
                {selectedType.id === buttonsExternal && (
                    <div className="my-3 flex justify-center rounded-1 bg-yellow-21 p-3">
                        <AlertCircleYellow className="h-full pt-1 md:w-[28%] base:w-[23%]" />
                        <p className="flex text-left text-13 text-yellow-1031">{t("hsm.createTemplateModal.typeButtonExternal")}</p>
                    </div>
                )}
                {selectedType.id === buttonsFlow && (
                    <div className="my-3 flex justify-center rounded-1 bg-yellow-21 p-3">
                        <AlertCircleYellow className="h-full pt-1 md:w-[28%] base:w-[23%]" />
                        <p className="flex text-left text-13 text-yellow-1031">{t("hsm.createTemplateModal.typeButtonFlows")}</p>
                    </div>
                )}
                <div className="relative">
                    <div className="absolute top-[40%] right-[5%]">
                        <ArrowSelect />
                    </div>
                    <div className="[&_button]:[&_div]:[&_div]:[&_div]:!hidden">
                        <FormComboboxSelect
                            options={buttonTypes}
                            value={selectedType || ""}
                            handleChange={handleButtonType}
                            name={"type"}
                            className={classSelect}
                            background={"#fff"}
                            hasCleanFilter={false}
                        />
                    </div>
                </div>
            </div>
            <div className="pb-2">
                {selectedType.id === buttonsExternal &&
                    buttonsHsm.map(({ text, type, url, phone_number, example }, index) => {
                        const typeActValue = !isEmpty(typeAction) ? typeAction[index] : "";
                        const actionTypeList = buttonsExtOpt.map((item) => {
                            const isSelected = typeAction.find((type) => {
                                return type.index !== index && type.id === item.id;
                            });
                            if (isSelected) return { ...item, isdisabled: true };
                            return { ...item };
                        });

                        return (
                            <div key={index} className="relative my-3 rounded-10 border-1 border-gray-36 px-[1.3rem] pt-7 pb-6">
                                <div className="absolute right-0 top-0 pt-3 pr-3">
                                    <button onClick={() => handleRemoveClick(index)}>
                                        <CloseIcon1 className="cursor-pointer fill-current text-xl text-gray-600 " width="14" height="14" />
                                    </button>
                                </div>
                                <div>
                                    <Label name={t("hsm.actionType")} textColor="text-black" />
                                    <div className="relative">
                                        <div className="absolute top-[40%] right-[5%]">
                                            <ArrowSelect />
                                        </div>
                                        <div className="[&_button]:[&_div]:[&_div]:[&_div]:!hidden">
                                            <FormComboboxSelect
                                                options={actionTypeList}
                                                value={typeActValue !== undefined && !isEmpty(typeActValue) ? typeActValue : ""}
                                                handleChange={(e) => handleTypeAction(e, index)}
                                                name={"type"}
                                                className={classSelect}
                                                background={"#fff"}
                                                hasCleanFilter={false}
                                                placeholder={t("hsm.createTemplateModal.placeholderTypeAction")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {typeActValue !== undefined && !isEmpty(typeActValue) && typeAction[index].id === "PHONE_NUMBER" && (
                                    <div className="pt-2">
                                        <Label name={t("hsm.createTemplateModal.numeric")} textColor="text-black" />
                                        <div className="rounded-[0.8125rem] border-1 border-gray-34 p-[0.4rem] focus:border-gray-39">
                                            <PhoneInput
                                                defaultCountry="EC"
                                                placeholder={t("pma.Ingresa el número del destinatario")}
                                                onChange={(e) => handlePhone(e, index)}
                                                value={phone_number}
                                                name="phoneNumber"
                                                className={` " w-full  [&_input]:!bg-white [&_input]:!text-15 [&_input]:!text-black `}
                                            />
                                        </div>
                                        {!isEmpty(phone_number) && !isValidPhone(phone_number) && (
                                            <div className="flex items-center gap-2 pt-1 font-medium">
                                                <ErrorIcon />
                                                <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningUrlPhone")}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {typeActValue !== undefined && !isEmpty(typeActValue) && typeAction[index].id === "URL" && (
                                    <div className="pt-2">
                                        <Label name={t("hsm.createTemplateModal.typeUrl")} textColor="text-black" />
                                        <div className="relative">
                                            <div className="absolute top-[40%] right-[5%]">
                                                <ArrowSelect />
                                            </div>
                                            <div className="[&_button]:[&_div]:[&_div]:[&_div]:!hidden">
                                                <FormComboboxSelect
                                                    options={buttonURL}
                                                    value={typeUrl || ""}
                                                    handleChange={(e) => handleTypeUrl(e, index)}
                                                    name={"typeUrl"}
                                                    className={classSelect}
                                                    background={"#fff"}
                                                    hasCleanFilter={false}
                                                    placeholder={t("hsm.createTemplateModal.typeUrlPlaceHolder")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!isEmpty(typeUrl) && get(typeUrl, "id") === "UrlStatic" && typeActValue !== undefined && !isEmpty(typeActValue) && typeAction[index].id === "URL" && (
                                    <div className="pt-2">
                                        <Label name={t("hsm.createTemplateModal.staticUrl")} textColor="text-black" />
                                        <Input
                                            type="text"
                                            required={true}
                                            name="urlStatic"
                                            className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                                                !isEmpty(url) && !isValidUrlStatic(url) ? "!border-red-950 bg-red-1010 bg-opacity-10" : "border-gray-34 bg-white focus:border-gray-39"
                                            }`}
                                            onChange={(e) => handleInputExternalButtons(e, index)}
                                            value={url || ""}
                                            placeholder={"https://apps.jelou.ai/bots"}
                                        />
                                        {!isEmpty(url) && !isValidUrlStatic(url) && (
                                            <div className="flex items-center gap-2 pt-1 font-medium">
                                                <ErrorIcon />
                                                <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningUrlStatic")}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {!isEmpty(typeUrl) && get(typeUrl, "id") === "UrlDynamic" && typeActValue !== undefined && !isEmpty(typeActValue) && typeAction[index].id === "URL" && (
                                    <div className="relative pt-2">
                                        <div>
                                            <div className="flex items-center justify-start">
                                                <Label name={t("hsm.createTemplateModal.dinamicUrl")} textColor="text-black" />
                                                <button className="pl-2" onMouseOver={handleHelpMsg}>
                                                    <HelpIcon />
                                                </button>
                                            </div>
                                            {helpMsg && (
                                                <div className="absolute top-[-22%] left-[65%] w-full -translate-x-[50%] -translate-y-[50%]">
                                                    <p className="animate-fadeIn rounded-20 bg-primary-700 p-3 text-sm text-primary-200">{t("hsm.createTemplateModal.helpUrl")}</p>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Input
                                                    type="text"
                                                    required={true}
                                                    name="UrlDynamic"
                                                    className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                                                        !isEmpty(url) && !isValidUrlStatic(url) ? "!border-red-950 bg-red-1010 bg-opacity-10" : "border-gray-34 bg-white focus:border-gray-39"
                                                    }`}
                                                    onChange={(e) => handleInputExternalButtons(e, index)}
                                                    value={url || ""}
                                                    placeholder={"https://apps.jelou.ai/"}
                                                />
                                                <div className="ml-2 flex h-10 w-12 border-spacing-[0.98rem]  items-center justify-center rounded-10 border-1 border-gray-36 bg-transparent">
                                                    <span className="text-15 text-gray-350 ">{`{{1}}`}</span>
                                                </div>
                                            </div>
                                            {!isEmpty(url) && !isValidUrlStatic(url) && (
                                                <div className="flex items-center gap-2 pt-1 font-medium">
                                                    <ErrorIcon />
                                                    <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningUrlStatic")}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex items-center">
                                                <span className={`pl-2 font-bold text-red-950 `}>*</span>
                                                <h3 className="text-sm font-semibold text-primary-200">{t("hsm.createTemplateModal.addUrlExp")}</h3>
                                            </div>
                                            <p className="py-1 text-15">{t("hsm.createTemplateModal.addUrlExpText")}</p>
                                            <Input
                                                type="text"
                                                required={true}
                                                name="UrlDynamicExample"
                                                className={` mt-1 w-full rounded-[0.8125rem] text-15 text-black  ${
                                                    !isEmpty(example) && !isValidUrlStatic(example[0]) ? "!border-red-950 bg-red-1010 bg-opacity-10" : "border-gray-34 bg-white focus:border-gray-39"
                                                }`}
                                                onChange={(e) => handleInputExternalButtons(e, index)}
                                                value={example !== undefined && !isEmpty(example) ? example[0] : ""}
                                                placeholder={"https://apps.jelou.ai/example"}
                                            />
                                            {!isEmpty(example) && !isValidUrlStatic(example[0]) && (
                                                <div className="flex items-center gap-2 pt-1 font-medium">
                                                    <ErrorIcon />
                                                    <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningUrlStatic")}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-1 pt-2">
                                    <Label name={t("hsm.createTemplateModal.nameButton")} textColor="text-black" />

                                    <Input
                                        type="text"
                                        required={true}
                                        name="text"
                                        className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                                            errorWarning(text) || (!isEmpty(text) && !validationNameChar(text))
                                                ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                                : "border-gray-34 bg-white focus:border-gray-39"
                                        }`}
                                        onChange={(e) => handleInputChange(e, index)}
                                        value={text}
                                        placeholder={t("hsm.createTemplateModal.palceHolderNameButton")}
                                        maxLength={MAX_CHAR_BUTTONS_FLOW}
                                    />
                                    <div className="pt-1">
                                        <CircularProgress MINIMUM_CHARACTERS={MINIMUM_CHARACTERS} MAXIMUM_CHARACTERS={MAX_CHAR_BUTTONS_FLOW} countFieldLength={!isEmpty(text) ? text.length : 0} />
                                    </div>
                                    {errorWarning(text) && (
                                        <div className="flex items-center gap-2 pt-1 font-medium">
                                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.limitTwoCharacter")}</span>
                                        </div>
                                    )}
                                    {!isEmpty(text) && !validationNameChar(text) && (
                                        <div className="flex items-center gap-2 pt-1 font-medium">
                                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningNameButton")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="pb-2">
                {selectedType.id === buttonsFlow &&
                    buttonsHsm.map(({ text, type }, index) => {
                        return (
                            <div key={index} className="relative my-3 rounded-10 border-1 border-gray-36 px-[1.3rem] pt-7 pb-6">
                                <div className="absolute right-0 top-0 pt-3 pr-3">
                                    <button onClick={() => handleRemoveClick(index)}>
                                        <CloseIcon1 className="cursor-pointer fill-current text-xl text-gray-600 " width="14" height="14" />
                                    </button>
                                </div>
                                <Label name={t("hsm.createTemplateModal.nameButton")} textColor="text-black" />
                                <Input
                                    type="text"
                                    required={true}
                                    name="text"
                                    className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                                        errorWarning(text) || (!isEmpty(text) && !validationNameChar(text))
                                            ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                            : "border-gray-34 bg-white focus:border-gray-39"
                                    }`}
                                    onChange={(e) => handleInputFlowChange(e, index)}
                                    value={text || ""}
                                    placeholder={t("hsm.createTemplateModal.palceHolderNameButton")}
                                    maxLength={MAX_CHAR_BUTTONS_FLOW}
                                />
                                <div className="pt-1">
                                    <CircularProgress MINIMUM_CHARACTERS={MINIMUM_CHARACTERS} MAXIMUM_CHARACTERS={MAX_CHAR_BUTTONS_FLOW} countFieldLength={!isEmpty(text) ? text.length : 0} />
                                </div>
                                {errorWarning(text) && (
                                    <div className="flex items-center gap-2 pt-1 font-medium">
                                        <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.limitTwoCharacter")}</span>
                                    </div>
                                )}
                                {!isEmpty(text) && !validationNameChar(text) && (
                                    <div className="flex items-center gap-2 pt-1 font-medium">
                                        <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningNameButton")}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
            {selectedType.id !== "NONE" && selectedType.id === buttonsExternal && buttonAdd(handleAddClick, isDisableExternalAdd)}
            {selectedType.id !== "NONE" && selectedType.id === buttonsFlow && buttonAdd(handleAddClick, isDisableFlowAdd)}
        </React.Fragment>
    );
}
export default ButtonsServMark;
