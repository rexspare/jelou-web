/**
 * Shows the bulk data load step the user is in.
 * Appears on the left side of the bulk data upload modal.
 */

import { useTranslation } from "react-i18next";

import { CheckIcon3 } from "@apps/shared/icons";

export function NavigationSteps({ stepsList }) {
    const { t } = useTranslation();

    return (
        <>
            <h3 className="text-xl font-bold text-primary-200">{t("datum.uploadModal.importDoc")}</h3>
            <ul className="grid justify-center gap-[2.625rem] py-[42px]">
                {stepsList.map((item) => {
                    const { isActive, number, title, hasLine, id, isComplete } = item;
                    const styleLI = isComplete ? "text-[#209F8B]" : isActive ? "text-primary-200" : "text-primary-370";
                    const styleDIV = isComplete
                        ? "bg-[#209F8B] after:bg-[#209F8B]"
                        : isActive
                        ? "bg-primary-200 after:bg-primary-200"
                        : "after:bg-primary-370 bg-primary-370";
                    const styleLine = hasLine
                        ? "after:absolute after:-bottom-[1.5rem] after:-left-[0.625rem] after:h-0.5 after:w-11 after:rotate-90 after:content-['']"
                        : "";

                    return (
                        <li key={id} className={`flex gap-2 ${styleLI}`}>
                            <div className={`relative grid h-6 w-6 place-content-center rounded-full text-base text-white ${styleLine} ${styleDIV}`}>
                                {isComplete ? (
                                    <span className="mt-0.5">
                                        <CheckIcon3 />
                                    </span>
                                ) : (
                                    number
                                )}
                            </div>
                            <p className="text-base font-semibold">{t(title)}</p>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
