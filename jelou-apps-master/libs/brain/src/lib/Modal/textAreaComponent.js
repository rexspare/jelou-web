import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CharacterCounter } from "@apps/shared/common";

const TextAreaComponent = (props) => {
    const { title, placeholder, onChange, maxLength, minLength, length, disabled, name, defaultValue, className = "" } = props;
    const { t } = useTranslation();
    const [hasMinLength, setHasMinLength] = useState(false);

    useEffect(() => {
        setHasMinLength(length >= minLength);
    }, [length]);

    const showError = length > 0 && !hasMinLength;

    return (
        <>
            {title ? (
                <div className="mb-[0.3rem] font-bold text-gray-610">{title}</div>
            ) : (
                <div className="mb-[0.3rem] font-bold text-gray-610">{t("common.name")}</div>
            )}
            <textarea
                {...(onChange && { onChange })}
                autoCapitalize="on"
                autoComplete="on"
                autoCorrect="on"
                disabled={disabled}
                className={`w-full resize-none rounded-10 border-1 border-gray-34 py-2 pl-3 text-sm text-gray-400 placeholder:text-13 focus:border-1 focus:border-gray-34 disabled:cursor-not-allowed disabled:bg-opacity-50 ${className}`}
                defaultValue={defaultValue}
                name={name}
                placeholder={placeholder}
                spellCheck="true"
                maxLength={maxLength}
            />
            <div className="flex items-center justify-between">
                {showError && (
                    <p className="ml-4 mb-2 w-full break-words text-xs text-semantic-error">
                        {`${t("common.mustHaveAlLeast")} ${minLength} ${t("common.characters")}`}
                    </p>
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
        </>
    );
};

export default TextAreaComponent;
