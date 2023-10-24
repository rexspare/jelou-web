import { Input, Label } from "@apps/shared/common";
import { AlertCircleYellow, ErrorIcon } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { v4 as uuid } from "uuid";
export function ContentAuth(props) {
    const {
        t,
        templateModalInputNames,
        values,
        setValues,
        inputParamClassName,
        ArrowSelect,
        classSelect,
        setParamsNew,
        setButtonInputsArray,
        setSelectedType,
        hsmCategory,
        setFileType,
        array,
        setScrollControl,
        paramsNew,
        setLockStep,
        setOpcAuth,
        opcAuth,
        setMinutesExp,
        minutesExp,
        setFoundOpcScurity,
        setFoundOpcCodeExp,
        foundOpcScurity,
        foundOpcCodeExp,
        setExampleAuth,
        exampleAuth,
        allowChangeCat,
    } = props;

    const [codeExpiration, setCodeExpiration] = React.useState(false);

    const contentAuthLang =
        !isEmpty(values) && values.language.id === "es"
            ? "Tu código de verificación es {{1}}. "
            : values.language.id === "en"
            ? "{{1}} is your verification code. "
            : values.language.id === "pt_BR"
            ? "Seu código de verificação é {{1}}. "
            : "";

    const contentAddSecurity =
        !isEmpty(values) && values.language.id === "es"
            ? "Por tu seguridad, no lo compartas."
            : values.language.id === "en"
            ? "For your security, do not share this code."
            : values.language.id === "pt_BR"
            ? "Para sua segurança, não o compartilhe."
            : "";
    const contentCodeExp =
        !isEmpty(values) && values.language.id === "es"
            ? "Este código caduca en N minutos."
            : values.language.id === "en"
            ? "This code expires in N minutes."
            : values.language.id === "pt_BR"
            ? "Este código expira em N minutos."
            : "";
    const checkAuthOptions = [
        { id: "addSecurityRecommendation", opc: t("hsm.createTemplateModal.checkAuth1") },
        { id: "codeExpirationMinutes", opc: t("hsm.createTemplateModal.checkAuth2") },
    ];
    const handleCheckAuth = (event, name) => {
        const selectedIndex = opcAuth.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(opcAuth, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(opcAuth.slice(1));
        } else if (selectedIndex === opcAuth.length - 1) {
            newSelected = newSelected.concat(opcAuth.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(opcAuth.slice(0, selectedIndex), opcAuth.slice(selectedIndex + 1));
        }

        setOpcAuth(newSelected);
    };

    const handleParamsExp = (e) => {
        const value = e.target.value;
        setExampleAuth(value);
    };
    const isSelected = (name) => opcAuth.indexOf(name) !== -1;
    const inputCheckboxClassName =
        "mt-2 mr-2 h-4 w-4 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200 cursor-pointer";

    React.useEffect(() => {
        setFoundOpcScurity(!isEmpty(opcAuth) && opcAuth.some((opc) => opc === "addSecurityRecommendation"));
        setFoundOpcCodeExp(!isEmpty(opcAuth) && opcAuth.some((opc) => opc === "codeExpirationMinutes"));
    }, [opcAuth]);
    React.useEffect(() => {
        setScrollControl(true);
    }, []);

    React.useEffect(() => {
        const newValues =
            hsmCategory === "AUTHENTICATION"
                ? {
                      ...values,
                      addButton: hsmCategory === "AUTHENTICATION",
                      type: { id: "HSM", name: "Texto" },
                      paramsNumber: "1",
                      buttonContent1: "",
                      template: foundOpcScurity ? contentAuthLang + contentAddSecurity : contentAuthLang,
                      templateExample: foundOpcScurity ? contentAuthLang + contentAddSecurity : contentAuthLang,
                      header: "",
                      footer: foundOpcCodeExp ? contentCodeExp : "",
                      extraSettings: {
                          addSecurityRecommendation: foundOpcScurity,
                          ...(foundOpcCodeExp && !isEmpty(minutesExp) ? { codeExpirationMinutes: parseInt(minutesExp) } : {}),
                          allowChangeCategory: allowChangeCat,
                      },
                  }
                : {
                      ...values,
                      addButton: hsmCategory === "AUTHENTICATION",
                      paramsNumber: "0",
                      template: "",
                      templateExample: "",
                  };
        setValues(newValues);

        const newParams = hsmCategory === "AUTHENTICATION" ? [{ id: uuid(), otp: hsmCategory === "AUTHENTICATION", param: "1", label: "OTP", example: exampleAuth }] : [];
        setParamsNew(newParams);
        if (hsmCategory === "AUTHENTICATION") setFileType("HSM");

        setButtonInputsArray([1]);
        setSelectedType(hsmCategory === "AUTHENTICATION" ? { id: "OTP", name: t("hsm.BUTTON_OTP") } : {});

        setCodeExpiration(foundOpcCodeExp);
    }, [hsmCategory, foundOpcScurity, foundOpcCodeExp, minutesExp, exampleAuth]);

    React.useEffect(() => {
        const allExampleFilled = !isEmpty(paramsNew) ? paramsNew.every((param) => !isEmpty(param.example)) : "";
        const numMinutesExp = !isEmpty(minutesExp) && !!foundOpcCodeExp && parseInt(minutesExp) <= 90;

        if (!allExampleFilled || (!!foundOpcCodeExp && !numMinutesExp)) {
            setLockStep(true);
        } else {
            setLockStep(false);
        }
    }, [paramsNew, minutesExp, foundOpcCodeExp]);

    return (
        <React.Fragment>
            <div className="flex justify-center rounded-1 bg-yellow-21 p-3">
                <AlertCircleYellow className="h-full pt-1 md:w-[28%] base:w-[23%]" />
                <p className="flex text-left text-15 text-yellow-1031">{t("hsm.createTemplateModal.warningAuth")}</p>
            </div>
            <div className="pb-3 pt-3">
                <Label name={templateModalInputNames.type} textColor="text-black" />
                <div className="relative">
                    <div className="absolute top-[40%] right-[5%]">
                        <ArrowSelect />
                    </div>
                    <div className="[&_button]:[&_div]:[&_div]:[&_div]:!hidden">
                        <Input type="text" value={values?.type?.name || ""} className={classSelect + "!text-gray-36"} disabled={true} />
                    </div>
                </div>
            </div>
            <div className="pb-3">
                <Label name={templateModalInputNames.content} textColor="text-black" />
                <div className="relative">
                    <Input type="text" value={values?.template || ""} className={classSelect + "!text-gray-36"} disabled={true} />
                </div>
            </div>
            <div className="pb-3">
                <Label name={templateModalInputNames.paramsNumber} textColor="text-black" />
                <div className="relative">
                    <Input type="text" value={values?.paramsNumber || ""} className={classSelect + "!text-gray-36"} disabled={true} />
                </div>
            </div>
            <div className="pb-3">
                <div className="mb-1 flex justify-between">
                    <div className="mr-2 flex h-[2.6rem] w-12 border-spacing-[0.98rem]  items-center justify-center rounded-10 border-1 border-gray-36 bg-transparent">
                        <span className="text-15 text-gray-36 ">{`{{1}}`}</span>
                    </div>
                    <Input type="text" id={1} value={array[0]?.label || ""} className={classSelect + "!text-gray-36"} disabled={true} />
                </div>
            </div>
            <div className="pb-3">
                <div className="flex items-center">
                    <span className={`font-bold text-red-950`}>*</span>
                    <h4 className="pl-1 text-sm font-bold text-primary-200">{t("hsm.createTemplateModal.exampleParams")}</h4>
                </div>
                <p className="py-3 text-13 text-gray-400">{t("hsm.createTemplateModal.exampleParamsText")}</p>
                <div className="flex flex-1 flex-col sm:col-span-2 ">
                    {array.map((param, index) => {
                        return (
                            <div className="mb-1 flex justify-between" key={index}>
                                <div className="mr-2 flex h-34 w-12 border-spacing-[0.98rem]  items-center justify-center rounded-10 border-1 border-gray-36 bg-transparent">
                                    <span className="text-15 text-gray-350 ">{`{{${index + 1}}}`}</span>
                                </div>
                                <Input
                                    type="text"
                                    id={index + 1}
                                    value={exampleAuth || ""}
                                    onChange={handleParamsExp}
                                    placeholder={t("hsm.createTemplateModal.exampleParamsLabel") + ` ${index + 1}`}
                                    name={`replace-${param.label}`}
                                    className={inputParamClassName}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="pb-3">
                    <Label name={templateModalInputNames.content} textColor="text-black" />
                    <p className="pt-2 pb-2 text-13">{t("hsm.createTemplateModal.textAuthContent")}</p>
                    {checkAuthOptions.map(({ id, opc }) => {
                        const isItemChecked = isSelected(id);
                        return (
                            <div className={"mb-1 flex flex-1"} key={id}>
                                <input
                                    checked={isItemChecked}
                                    onChange={(evt) => handleCheckAuth(evt, id)}
                                    name="isVisible"
                                    type="checkbox"
                                    className={inputCheckboxClassName}
                                    value={id === "codeExpirationMinutes" ? foundOpcCodeExp : foundOpcScurity}
                                />
                                <div className="flex max-w-xs flex-1 flex-col px-2 py-1 ">
                                    <p className="text-sm text-gray-400">{opc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {codeExpiration && (
                    <div className="ml-8 pb-3">
                        <div className="flex items-center">
                            <span className={`pl-1 font-bold text-red-950`}>*</span>
                            <Label name={t("hsm.createTemplateModal.expIn")} textColor="text-black" />
                        </div>
                        <div className=" mt-[0.3rem] flex h-[2.5rem] w-[8rem] items-center justify-center rounded-10 border-1 text-gray-34">
                            <input
                                type="text"
                                className="h-full w-[4rem] rounded-10 border-1 border-transparent text-black focus:border-transparent focus:outline-none "
                                onChange={(e) => {
                                    setMinutesExp(e.target.value);
                                }}
                                placeholder={t("hsm.createTemplateModal.placeHolderDateHours")}
                                value={minutesExp}
                            />
                            <h5 className="text-gray-17 text-15">{t("hsm.createTemplateModal.placeHolderDateMinutes")}</h5>
                        </div>
                        {parseInt(minutesExp) > 90 && (
                            <div className="flex items-center gap-2 pt-1 font-medium">
                                <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningExpMin")}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}
export default ContentAuth;
