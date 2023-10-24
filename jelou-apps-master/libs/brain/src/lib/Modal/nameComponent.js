import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { WarningIcon2 } from "@apps/shared/icons";
import { CharacterCounter } from "@apps/shared/common";
import { COMPONENT_NAME } from "../constants";

const NameComponent = (props) => {
    const { title, placeholder, onChange, itemValues, maxLength, minLength, length, name = COMPONENT_NAME.NAME , showAnotherError = "" } = props;
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
            <div
                className={`mb-[3px] flex h-11 w-full rounded-lg border-1 px-4 py-2 font-medium text-gray-610 ${
                    showError || showAnotherError ? "border-semantic-error" : "border-neutral-200"
                }`}>
                <input
                    className="h-full w-full font-medium text-gray-610 placeholder:text-sm focus-visible:outline-none"
                    placeholder={`${t("common.forExample")} ${placeholder}`}
                    name={name}
                    value={itemValues?.name}
                    onChange={onChange}
                    autoFocus={true}
                    maxLength={maxLength}
                />
                {showError || showAnotherError && <WarningIcon2 width="1.5rem" height="1.5rem" className="fill-current text-semantic-error" />}
            </div>
            <div className="flex items-center justify-between">
                {showError && (
                    <p className="ml-4 mb-2 w-full break-words text-xs text-semantic-error">
                        {`${t("common.mustHaveAlLeast")} ${minLength} ${t("common.characters")}`}
                    </p>
                )}
                {showAnotherError && (
                  <span className="ml-4 mb-2 w-full break-words text-xs text-semantic-error">{showAnotherError}</span>
                )}
                <CharacterCounter
                    className={`${showError ? "text-semantic-error" : "text-gray-400"}`}
                    colorCircle={`${showError ? "#F95A59" : "#959DAF"}`}
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

export default NameComponent;
