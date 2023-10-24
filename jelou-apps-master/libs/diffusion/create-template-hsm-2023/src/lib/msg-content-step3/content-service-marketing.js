import { FormComboboxSelect, Input, Label } from "@apps/shared/common";
import { MoreIcon } from "@apps/shared/icons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { FileDrop } from "react-file-drop";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import CircularProgress from "../circular-progress/circular-progress";
const MAXIMUM_CHARACTERS_CONTENT = 1000;
const MAXIMUM_CHARACTERS_HEAD_FOOTER = 60;
const MINIMUM_PARAMS_NUMBER = 9;
const MAXIMUM_CHARACTERS_PARAMS = 20;
export function ContentServMark(props) {
    const {
        templateModalInputNames,
        templateTypeOptions,
        handleCombobox,
        t,
        values,
        ArrowSelect,
        classSelect,
        fileType,
        isFileUploaded,
        loadingMedia,
        handleDocFile,
        clickFilePicker,
        mediaUrlMessage,
        mediaFileName,
        weightFile,
        isInputValuesDontComply,
        handleChange,
        MINIMUM_CHARACTERS,
        ErrorIcon,
        validateExtension,
        getValidFileTypes,
        onBlur,
        handleChangeParams,
        setLockStep,
        setScrollControl,
        paramsNew,
        handleEditParams,
        addParamToContent,
        array,
        setValues,
        inputParamClassName,
        hsmCategory,
        setOpcAuth,
        setFoundOpcScurity,
        setFoundOpcCodeExp,
        allowChangeCat,
        validationNameChar,
    } = props;

    React.useEffect(() => {
        const newValues =
            hsmCategory !== "AUTHENTICATION"
                ? {
                      ...values,
                      extraSettings: { addSecurityRecommendation: false, allowChangeCategory: allowChangeCat },
                  }
                : {
                      ...values,
                  };
        setValues(newValues);
        if (hsmCategory !== "AUTHENTICATION") {
            setOpcAuth([]);
            setFoundOpcScurity(false);
            setFoundOpcCodeExp(false);
        }
    }, [hsmCategory]);

    const formatFileName = (fileName) => {
        if (fileName.length >= 20) {
            const tailCaption = fileName.slice(0, 20);
            const extensionCaption = fileName.slice(-5);
            return `${tailCaption}[...]${extensionCaption}`;
        }
        return fileName;
    };
    const formatSizeFile = (weightFile) => {
        const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let l = 0,
            n = parseInt(weightFile, 10) || 0;

        while (n >= 1024 && ++l) {
            n = n / 1024;
        }

        return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
    };
    const getUrlFileImage = (type) => {
        switch (type) {
            case ".jpg, .png":
                return "assets/illustrations/imageFile.svg";
            case ".pdf":
                return "assets/illustrations/docFile.svg";
            case ".mp4":
                return "assets/illustrations/videoFile.svg";
            default:
                return "assets/illustrations/docFile.svg";
        }
    };
    const getLabelFile = (type) => {
        switch (type) {
            case ".jpg, .png":
                return t("hsm.dragImg");
            case ".pdf":
                return t("datum.uploadModal.dragNdrop");
            case ".mp4":
                return t("hsm.dragVideo");
            default:
                return "";
        }
    };

    //? Para evitar que se abra una ventana automaticamente
    window.addEventListener(
        "dragover",
        function (e) {
            e.preventDefault();
        },
        false
    );
    window.addEventListener(
        "drop",
        function (e) {
            e.preventDefault();
        },
        false
    );
    //**

    const onDrop = (files) => {
        const fileName = get(files, "[0].name");
        function MsgFile(fileType) {
            switch (fileType) {
                case ".pdf":
                    return "document";
                case ".jpg, .png":
                    return "image";
                case ".mp4":
                    return "video";
                default:
                    return "";
            }
        }
        if (!validateExtension(fileName)) {
            toast.error(`${t("selectMessage.fileNotSupported")} ${t(`selectMessage.${MsgFile(fileType)}`)} (${getValidFileTypes()})`, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });

            return;
        }
        const dropFile = { target: { files: files } };
        handleDocFile(dropFile);
    };
    const errorWarning = (valuesInput) => {
        return !isEmpty(valuesInput) && valuesInput.length > 0 && valuesInput.length < MINIMUM_CHARACTERS;
    };
    const errorWarningParams = (valuesNum) => {
        return !isEmpty(valuesNum) && parseInt(valuesNum) > MINIMUM_PARAMS_NUMBER;
    };
    const errorLoadMultimedia = (valuesType) => {
        return !isEmpty(valuesType) && valuesType.id !== "HSM" && isEmpty(mediaUrlMessage);
    };
    const incompleteParams = ({ paramsNumber, allLabelFilled, allExampleFilled }) => {
        return (!isEmpty(paramsNumber) && parseInt(paramsNumber) !== 0 && allLabelFilled === false) || allExampleFilled === false;
    };

    const validationWeightFile = ({ weightFile, fileType }) => {
        if (isEmpty(fileType) || weightFile === null) {
            return false;
        }

        const allowedTypes = {
            ".mp4": { minSize: 16, validUnits: ["MB", "GB", "TB"] },
            ".jpg, .png": { minSize: 5, validUnits: ["MB", "GB", "TB"] },
            ".pdf": { minSize: 5, validUnits: ["MB", "GB", "TB"] },
        };

        const typeInfo = allowedTypes[fileType];

        if (!typeInfo) {
            return false;
        }

        const fileWeight = formatSizeFile(weightFile);
        const weightParts = fileWeight.split(" ");
        const size = parseInt(weightParts[0]);
        const unit = weightParts[1];

        return size > typeInfo.minSize && typeInfo.validUnits.includes(unit);
    };
    React.useEffect(() => {
        const allLabelFilled = !isEmpty(paramsNew) ? paramsNew.every((param) => !isEmpty(param.label)) : "";
        const allExampleFilled = !isEmpty(paramsNew) ? paramsNew.every((param) => !isEmpty(param.example)) : "";
        const paramsNumber = values.paramsNumber;
        if (
            errorWarning(values.header) ||
            errorWarning(values.footer) ||
            !validationNameChar(values.footer) ||
            !validationNameChar(values.header) ||
            errorWarning(values.template) ||
            errorWarningParams(values.paramsNumber) ||
            isEmpty(values.type) ||
            errorLoadMultimedia(values.type) ||
            incompleteParams({ paramsNumber, allLabelFilled, allExampleFilled }) ||
            validationWeightFile({ weightFile, fileType }) ||
            isEmpty(values.template)
        ) {
            setLockStep(true);
        } else {
            setLockStep(false);
        }
    }, [values, paramsNew, weightFile, fileType]);

    React.useEffect(() => {
        if (
            (!isEmpty(values.type) && values.type.id !== "HSM") ||
            !isEmpty(values.paramsNumber) ||
            (errorWarning(values.template) && errorWarning(values.header) && errorWarning(values.footer)) ||
            !validationNameChar(values.header) ||
            !validationNameChar(values.footer)
        ) {
            setScrollControl(true);
        } else {
            setScrollControl(false);
        }
        if (!isEmpty(values) && values?.template?.length > MAXIMUM_CHARACTERS_CONTENT) {
            const newValues = { ...values, template: values?.template.slice(0, MAXIMUM_CHARACTERS_CONTENT), templateExample: values?.template.slice(0, MAXIMUM_CHARACTERS_CONTENT) };
            setValues(newValues);
        }
    }, [values]);

    React.useEffect(() => {
        if (!isEmpty(values.type) && values.type.id !== "HSM") {
            const newValues = { ...values, header: "" };
            setValues(newValues);
        }
    }, [values.type]);

    const numberInputOnWheelPreventChange = (e) => {
        // Prevent the input value change
        e.target.blur();

        // Prevent the page/container scrolling
        e.stopPropagation();

        // Refocus immediately, on the next tick (after the current function is done)
        setTimeout(() => {
            e.target.focus();
        }, 0);
    };

    return (
        <div className="">
            <div className="relative pb-3">
                <div className="flex items-center">
                    <span className={`${isEmpty(values.type) ? "opacity-1 pl-2" : "opacity-0"} font-bold text-red-950`}>*</span>
                    <Label name={templateModalInputNames.type} textColor="text-black" />
                </div>
                <div className="absolute top-1/2 right-[5%]">
                    <ArrowSelect />
                </div>
                <div className="[&_button]:[&_div]:[&_div]:[&_div]:!hidden">
                    <FormComboboxSelect
                        options={templateTypeOptions}
                        value={values.type || ""}
                        handleChange={(e) => handleCombobox(e, "type")}
                        name={"type"}
                        className={classSelect}
                        background={"#fff"}
                        hasCleanFilter={false}
                        placeholder={t("hsm.placeholderType")}
                    />
                </div>
            </div>
            {(fileType === ".jpg, .png" || fileType === ".pdf" || fileType === ".mp4") && !loadingMedia && !isFileUploaded && (
                <React.Fragment>
                    <FileDrop className="mt-4 w-full" onDrop={(files) => onDrop(files)}>
                        <div className="rounded-1 border-1 border-gray-34 bg-white py-[1.8rem] px-4">
                            <div className="flex items-center justify-center">
                                <img src={getUrlFileImage(fileType)} className="h-24 w-24" alt={"imageFile"} loading="lazy" />
                                <div className="pl-8">
                                    <p className="pb-3 text-15">{getLabelFile(fileType)}</p>
                                    <input onChange={handleDocFile} type="file" hidden={true} accept={fileType} id="file-picker" name="mediaUrl" />
                                    <button
                                        onClick={(evt) => {
                                            evt.preventDefault();
                                            clickFilePicker();
                                        }}
                                        type={"button"}
                                        className="button-gradient-xl w-auto !min-w-[9rem] whitespace-nowrap disabled:cursor-not-allowed"
                                    >
                                        {t("shop.modal.findFile")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FileDrop>
                    <div className="flex items-center gap-2 pt-1 pb-4 font-medium">
                        <ErrorIcon /> <span className="text-xs text-red-1010">*{templateModalInputNames.required}</span>
                    </div>
                </React.Fragment>
            )}
            {loadingMedia && (
                <div className="">
                    <p>&nbsp;</p>
                    <div className="">
                        <div className="my-1 flex h-11 w-full flex-row items-center justify-center pb-3">
                            <BarLoader size={"2.25rem"} color="#00b3c7" />
                        </div>
                    </div>
                </div>
            )}

            {isFileUploaded && !loadingMedia && (
                <React.Fragment>
                    <Label
                        name={
                            fileType === ".jpg, .png"
                                ? t("hsm.createTemplateModal.changeUploadImg")
                                : fileType === ".pdf"
                                ? t("hsm.createTemplateModal.changeUploadDoc")
                                : fileType === ".mp4"
                                ? t("hsm.createTemplateModal.changeUploadVid")
                                : ""
                        }
                        textColor="text-black"
                    />
                    <div className="relative pb-3">
                        <div className="rounded-1 border-1 border-gray-34 bg-white py-[1.8rem] px-4 ">
                            {!loadingMedia && (
                                <div className="items-start text-justify  text-sm font-medium" style={{ color: "#9CB4CD" }}>
                                    <div className="flex items-center justify-center">
                                        {mediaFileName && (
                                            <>
                                                {fileType === ".jpg, .png" && (
                                                    <div className="w-full">
                                                        <img style={{ maxWidth: "10rem" }} className="h-full w-full rounded-lg object-contain" src={mediaUrlMessage} alt="Uploaded file"></img>
                                                    </div>
                                                )}
                                                {fileType === ".mp4" && (
                                                    <video style={{ maxWidth: "6rem" }} className="h-11 rounded-lg">
                                                        <source src={mediaUrlMessage} type="video/mp4"></source>
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                                {fileType === ".pdf" && (
                                                    <div className="">
                                                        <img src="assets/illustrations/docFile.svg" className="h-24 w-24" alt={"imageFile"} loading="lazy" />
                                                    </div>
                                                )}
                                                <div className="pl-4">
                                                    <p className="... ml-3  flex-1 truncate pb-1 font-bold text-gray-400">{formatFileName(mediaFileName)}</p>
                                                    <p className="ml-3  flex-1 pb-4 font-bold text-gray-400">
                                                        {t("hsm.createTemplateModal.size")}
                                                        {formatSizeFile(weightFile)}
                                                    </p>
                                                    <input onChange={handleDocFile} type="file" hidden={true} accept={fileType} id="file-picker" name="mediaUrl" />
                                                    <button
                                                        onClick={(evt) => {
                                                            evt.preventDefault();
                                                            clickFilePicker();
                                                        }}
                                                        type={"button"}
                                                        className="button-gradient-xl w-auto !min-w-[8rem] whitespace-nowrap disabled:cursor-not-allowed"
                                                    >
                                                        {fileType === ".jpg, .png"
                                                            ? t("hsm.createTemplateModal.changeImg")
                                                            : fileType === ".pdf"
                                                            ? t("hsm.createTemplateModal.changeDoc")
                                                            : fileType === ".mp4"
                                                            ? t("hsm.createTemplateModal.changeVid")
                                                            : ""}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {validationWeightFile({ weightFile, fileType }) && (
                            <div className="flex items-center gap-2 pt-1 font-medium">
                                <ErrorIcon />{" "}
                                <span className="text-xs text-red-1010">{fileType === ".mp4" ? t("hsm.createTemplateModal.limitExceedVideo") : t("hsm.createTemplateModal.limitExceedFileMult")}</span>
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}
            {!isEmpty(values.type) && values.type.id === "HSM" && (
                <div className="pb-3 pt-1 ">
                    <Label className="pl-1" name={t("hsm.header")} textColor="text-black" />
                    <Input
                        type="text"
                        value={values.header || ""}
                        onChange={handleChange}
                        placeholder={t("hsm.placeholderHeader")}
                        name="header"
                        maxLength={MAXIMUM_CHARACTERS_HEAD_FOOTER}
                        required={true}
                        className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                            errorWarning(values.header) || (!isEmpty(values.header) && !validationNameChar(values.header))
                                ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                : "border-gray-34 bg-white focus:border-gray-39"
                        }`}
                    />
                    <h6 className="text-gray-41 pt-1 text-11">{t("hsm.createTemplateModal.fieldOpc")}</h6>
                    <div className="-mt-2">
                        <CircularProgress
                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                            MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS_HEAD_FOOTER}
                            countFieldLength={!isEmpty(values.header) ? values.header.length : 0}
                        />
                    </div>
                    {errorWarning(values.header) && (
                        <div className="flex items-center gap-2 pt-1 font-medium">
                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                        </div>
                    )}
                    {!isEmpty(values.header) && !validationNameChar(values.header) && (
                        <div className="flex items-center gap-2 pt-1 font-medium">
                            <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningNameButton")}</span>
                        </div>
                    )}
                </div>
            )}
            <div className="pb-3 ">
                <div className="flex items-center">
                    <span className={`font-bold text-red-950 ${isInputValuesDontComply(values.template) ? " opacity-1 pl-2" : " opacity-0"}`}>*</span>
                    <Label className="pl-1" name={templateModalInputNames.content} textColor="text-black" />
                </div>
                <textarea
                    type="text"
                    value={values.template || ""}
                    onChange={handleChange}
                    placeholder={t("hsm.placeholderContent")}
                    name="template"
                    onBlur={onBlur}
                    maxLength={MAXIMUM_CHARACTERS_CONTENT}
                    required={true}
                    className={` border h-[5rem] resize-none  rounded-lg py-3 px-4 text-15 text-black placeholder-gray-325 placeholder:text-13 focus:ring-transparent focus-visible:outline-none  ${
                        errorWarning(values.template) ? "!border-red-950 bg-red-1010 bg-opacity-10" : "border-gray-34 bg-white focus:border-gray-39"
                    }`}
                    rows="1"
                    cols="36"
                />
                <div className="pt-1">
                    <CircularProgress
                        MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                        MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS_CONTENT}
                        countFieldLength={!isEmpty(values.template) ? values.template.length : 0}
                    />
                </div>
                {errorWarning(values.template) && (
                    <div className="flex items-center gap-2 pt-1 font-medium">
                        <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                    </div>
                )}
            </div>

            <div className="pb-3 ">
                <div className="flex items-center">
                    <span className={`font-bold text-red-950 ${array.length > 0 ? " opacity-1" : " opacity-0"}`}>*</span>
                    <Label className="pl-1" name={templateModalInputNames.paramsNumber} textColor="text-black" />
                </div>
                <Input
                    type="number"
                    pattern="[0-9]*"
                    min="0"
                    onChange={handleChangeParams}
                    onWheel={numberInputOnWheelPreventChange}
                    value={values.paramsNumber || ""}
                    placeholder={templateModalInputNames.placeholderParamsNumber}
                    name="paramsNumber"
                    className={` w-full rounded-[0.8125rem] text-15 text-black ${
                        errorWarningParams(values.paramsNumber) ? "!border-red-950 bg-red-1010 bg-opacity-10" : "border-gray-34 bg-white focus:border-gray-39"
                    }`}
                />
                {errorWarningParams(values.paramsNumber) && (
                    <div className="flex items-center gap-2 pt-1 font-medium">
                        <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.maxParameters")}</span>
                    </div>
                )}
            </div>
            {parseInt(values.paramsNumber) !== 0 && array.length > 0 && array.length < 10 && (
                <div className="pt-1">
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
                                        value={param.label || ""}
                                        onChange={handleEditParams}
                                        placeholder={templateModalInputNames.placeholderParameters}
                                        name={`${param.id}`}
                                        className={inputParamClassName}
                                        maxLength={MAXIMUM_CHARACTERS_PARAMS}
                                    />
                                    <button onClick={() => addParamToContent(index + 1)} className="ml-2 h-34 w-8.5 border-spacing-[0.98rem] rounded-10 bg-teal-5">
                                        <MoreIcon width="40" height="30" className="text-primary-200" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {parseInt(values.paramsNumber) !== 0 && array.length > 0 && array.length < 10 && !!values?.paramsNumber && (
                <div className="pt-3">
                    <div className="flex items-center">
                        <span className={`font-bold text-red-950`}>*</span>
                        <h4 className="pl-1 text-sm font-bold text-primary-200">{t("hsm.createTemplateModal.exampleParams")}</h4>
                    </div>
                    <p className="py-3 text-13 text-gray-400">{t("hsm.createTemplateModal.exampleParamsText")}</p>
                    <div className="flex flex-1 flex-col sm:col-span-2 ">
                        {array.map((param, index) => {
                            return (
                                <div className="mb-2 flex justify-between" key={index}>
                                    <div className="mr-2 flex h-34 w-12 border-spacing-[0.98rem]  items-center justify-center rounded-10 border-1 border-gray-36 bg-transparent">
                                        <span className="text-15 text-gray-350 ">{`{{${index + 1}}}`}</span>
                                    </div>
                                    <Input
                                        type="text"
                                        id={index + 1}
                                        value={param.example || ""}
                                        onChange={handleEditParams}
                                        placeholder={t("hsm.createTemplateModal.exampleParamsLabel") + ` ${index + 1}`}
                                        name={`replace-${param.label}`}
                                        className={inputParamClassName}
                                        maxLength={MAXIMUM_CHARACTERS_PARAMS}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="pb-3 ">
                <Label className="pl-1" name={t("hsm.footer")} textColor="text-black" />
                <Input
                    type="text"
                    value={values.footer || ""}
                    onChange={handleChange}
                    placeholder={t("hsm.placeholderFooter")}
                    name="footer"
                    maxLength={MAXIMUM_CHARACTERS_HEAD_FOOTER}
                    required={true}
                    className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                        errorWarning(values.footer) || (!isEmpty(values.footer) && !validationNameChar(values.footer))
                            ? "!border-red-950 bg-red-1010 bg-opacity-10"
                            : "border-gray-34 bg-white focus:border-gray-39"
                    }`}
                />
                <h6 className="text-gray-41 pt-1 text-11">{t("hsm.createTemplateModal.fieldOpc")}</h6>
                <div className="-mt-2">
                    <CircularProgress
                        MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                        MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS_HEAD_FOOTER}
                        countFieldLength={!isEmpty(values.footer) ? values.footer.length : 0}
                    />
                </div>
                {errorWarning(values.footer) && (
                    <div className="flex items-center gap-2 pt-1 font-medium">
                        <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                    </div>
                )}
                {!isEmpty(values.footer) && !validationNameChar(values.footer) && (
                    <div className="flex items-center gap-2 pt-1 font-medium">
                        <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.warningNameButton")}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ContentServMark;
