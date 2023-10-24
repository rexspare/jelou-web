import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WarningIcon2 } from "@apps/shared/icons";
import { CharacterCounter } from "@apps/shared/common";
import { COMPONENT_NAME } from "../constants";

const DescriptionComponent = (props) => {
    const { placeholder, onChange, itemValues, maxLength, minLength, length, isUpdatingBlock, showTitle = true } = props;
    const { t } = useTranslation();
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (minLength) {
            setShowError(length > 0 && !(length >= minLength));
        }
    }, [length]);

    return (
        <>
            {showTitle &&
                <div className="mb-[0.3rem] font-bold text-gray-610">
                    {isUpdatingBlock ? t("common.content") : t("common.description")}
                </div>
            }
            <div
                className={`mb-[3px] flex ${isUpdatingBlock ? "h-48" : "h-20"} w-full rounded-lg border-1 p-2 font-medium text-gray-610 ${
                    showError ? "border-semantic-error" : "border-neutral-200"
                }`}>
                <textarea
                    className={`TextArea w-full border-0 resize-none text-sm placeholder:text-gray-400 placeholder:text-opacity-50 focus:ring-transparent focus-visible:outline-none`}
                    placeholder={`${isUpdatingBlock ? t("common.writeContent") : t("common.writeDescription")} ${placeholder}`}
                    name={isUpdatingBlock ? COMPONENT_NAME.CONTENT : COMPONENT_NAME.DESCRIPTION}
                    value={isUpdatingBlock ? itemValues.content : (itemValues?.description || "")}
                    onChange={onChange}
                    maxLength={maxLength}
                />
                {showError && <WarningIcon2 width="1.5rem" height="1.5rem" className="fill-current text-semantic-error" />}
            </div>
            <div className="flex items-center justify-between">
                {showError &&
                    <p className="ml-4 mb-2 w-full break-words text-xs text-semantic-error">
                        {`${t("common.mustHaveAlLeast")} ${minLength} ${t("common.characters")}`}
                    </p>
                }
                <CharacterCounter
                    className={`${showError ? "#F95A59" : "#B0B6C2"}`}
                    colorCircle={showError ? "#F95A59" : "#B0B6C2"}
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

export default DescriptionComponent;
