// import { TippyWrapper } from "../Tippy.custom";
import Tippy from "@tippyjs/react";
import { InputErrorMessage } from "./ShowErrors.Input";
import { QuestionIcon } from "@apps/shared/icons";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import Switch from "react-switch";
import { isEmpty } from "lodash";
import CharacterCounter from "../characterCounter/CharacterCounter";
import { useTranslation } from "react-i18next";
import { validateColorChromePicker } from "@apps/shared/utils";

function TippyWrapper(props) {
    const { children, content } = props;
    return (
        <Tippy theme="tomato" arrow content={content}>
            {children}
        </Tippy>
    );
}

export const TextColorInput = ({
    color,
    name,
    placeholder = "#000000",
    label,
    classNameLabel = "flex text-sm leading-5 text-gray-400 w-1/2 items-center",
    onChangeInput,
    onChangeColorPicker,
    pickerPosition = "bl",
    tippyContent = undefined,
    autofocus = false,
}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = (evt) => {
        setDisplayColorPicker(true);
    };

    const handleClose = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setDisplayColorPicker(false);
    };

    return (
        <div className="flex items-center justify-between">
            <span className={classNameLabel}>
                {label}
                {tippyContent && (
                    <TippyWrapper content={tippyContent}>
                        <span className="cursor-pointer pl-2 text-primary-200 hover:text-primary-200">
                            <QuestionIcon width={13} height={13} />
                        </span>
                    </TippyWrapper>
                )}
            </span>
            <div onClick={handleClick} className={`relative mb-[3px] flex h-11 w-1/2 items-center space-x-2 rounded-lg border-1 border-neutral-200 px-3 py-1 font-medium text-gray-610`}>
                <div className=" h-7 w-7 rounded-[4px] border-1 border-gray-34 bg-white" style={{ backgroundColor: validateColorChromePicker(color) }}></div>
                <input
                    className="h-full w-full flex-1 text-sm font-light text-gray-400 placeholder:text-sm focus-visible:outline-none"
                    placeholder={placeholder}
                    name={name}
                    autoFocus={autofocus}
                    value={validateColorChromePicker(color)}
                    onChange={onChangeInput}
                />
                {displayColorPicker ? (
                    <div
                        className={`absolute ${
                            pickerPosition === "tr" ? "bottom-5 right-0" : pickerPosition === "tl" ? "bottom-5 left-0" : pickerPosition === "br" ? "top-5 right-0" : "inset-x-0 top-5 left-0"
                        } z-30`}
                    >
                        <div
                            style={{
                                position: "fixed",
                                top: "0px",
                                right: "0px",
                                bottom: "0px",
                                left: "0px",
                            }}
                            onClick={handleClose}
                        />
                        <ChromePicker color={color} onChange={onChangeColorPicker} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export const TextInput = ({
    name,
    label,
    value,
    inputURLRef = undefined,
    hasError,
    placeholder,
    defaultValue,
    inline = false,
    maxLength = null,
    minLength = null,
    disabled = false,
    onChange = undefined,
    onFocus = () => null,
    isControlled = false,
    labelClassName = "block font-medium mb-1 text-gray-610",
    classNameContainerInput = "",
    className = "bg-white px-2 py-6 pl-3 rounded-10 border-1 border-neutral-200 w-full font-light",
    tippyContent = undefined,
    readOnly = false,
    icon = {},
    justify = "",
    length,
    autofocus
}) => {
    const [hasMinLength, setHasMinLength] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        setHasMinLength(length >= minLength);
    }, [length]);

    const showError = length > 0 && !hasMinLength;

    return (
        <>
            <div className={inline ? `flex items-center ${!isEmpty(justify) ? "justify-between" : "gap-3"} ` : "relative w-full"}>
                {label && (
                    <span className={`${labelClassName} flex items-center gap-2`}>
                        {label}
                        {tippyContent && (
                            <TippyWrapper content={tippyContent}>
                                <span className="cursor-pointer pl-2 text-primary-200 hover:text-primary-200">
                                    <QuestionIcon width={16} height={16} />
                                </span>
                            </TippyWrapper>
                        )}
                    </span>
                )}
                <div className={`relative flex ${classNameContainerInput}`}>
                    <input
                        {...(isControlled ? { value: value || defaultValue } : { defaultValue })}
                        {...(maxLength && { maxLength })}
                        {...(onChange && { onChange })}
                        {...(onFocus && { onFocus })}
                        {...(inputURLRef && { ref: inputURLRef })}
                        readOnly={readOnly}
                        disabled={disabled}
                        name={name}
                        placeholder={placeholder}
                        autofocus={autofocus}
                        type="text"
                        className={`relative h-11 rounded-10 border-1 border-gray-34 py-1 text-sm text-gray-400 placeholder:text-13 placeholder:text-gray-330 focus:border-1 focus:border-gray-34 disabled:cursor-not-allowed disabled:bg-opacity-50 ${
                            !isEmpty(icon) && "pl-12"
                        } ${className} ${inline ? "flex-1" : ""} ${hasError ? "border-red-530 border-1" : ""}`}
                    />
                    {!isEmpty(icon) && <div className="absolute inset-y-0 flex items-center px-2">{icon}</div>}
                </div>
                {maxLength && (
                    <div className="mt-2 flex items-center justify-between">
                        {showError && minLength && (
                            <p className="ml-4 mb-2 w-full break-words text-xs text-semantic-error">{`${t("common.mustHaveAlLeast")} ${minLength} ${t("common.characters")}`}</p>
                        )}
                        <CharacterCounter
                            className={`${showError ? "#F95A59" : "#B0B6C2"}`}
                            colorCircle={`${showError ? "#F95A59" : "#B0B6C2"}`}
                            count={length}
                            max={maxLength}
                            width={15}
                            height={15}
                            right
                        />
                    </div>
                )}
                {/* {!isEmpty(icon) && <div className="absolute">{icon}</div>} */}
            </div>
            {hasError && <InputErrorMessage hasError={hasError} />}
        </>
    );
};

export const TextAreaInput = ({
    name,
    label,
    hasError,
    placeholder,
    defaultValue,
    disabled = false,
    onChange = undefined,
    labelClassName = "block font-medium text-gray-610",
    className = "bg-white px-2 rounded-10 border-1 border-neutral-200 h-15",
}) => {
    return (
        <label>
            {label && <span className={`mb-1 block font-medium ${labelClassName}`}>{label}</span>}
            <textarea
                {...(onChange && { onChange })}
                autoCapitalize="on"
                autoComplete="on"
                autoCorrect="on"
                disabled={disabled}
                className={`w-full resize-none rounded-10 border-1 border-neutral-200 py-2 pl-3 text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 focus:border-1 focus:border-neutral-200 disabled:cursor-not-allowed disabled:bg-opacity-50 ${className} ${
                    hasError ? "border-red-530 border-1" : ""
                }`}
                defaultValue={defaultValue}
                name={name}
                placeholder={placeholder}
                spellCheck="true"
            />
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};

export const SwitchInput = ({
    name,
    id,
    label,
    onChange = null,
    hasError,
    defaultChecked = false,
    labelClassName = "flex block font-medium text-gray-610",
    containerClassName = "",
    tippyContent = undefined,
}) => {
    return (
        <div className={`flex items-center ${containerClassName}`}>
            <span className={labelClassName}>
                {label}
                {tippyContent && (
                    <TippyWrapper content={tippyContent}>
                        <span className="cursor-pointer pl-2 text-primary-200 hover:text-primary-200">
                            <QuestionIcon width={13} height={13} />
                        </span>
                    </TippyWrapper>
                )}
            </span>
            <Switch
                id={id}
                width={40}
                height={20}
                onColor="#00B3C7"
                checkedIcon={false}
                uncheckedIcon={false}
                onHandleColor="#ffffff"
                className="react-switch"
                checked={defaultChecked}
                onChange={onChange}
                boxShadow="0rem 0.063rem 0.313rem rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0rem 0rem 0.063rem 0.625rem rgba(0, 0, 0, 0.2)"
            />
            {hasError && <InputErrorMessage hasError={hasError} />}
        </div>
    );
};
