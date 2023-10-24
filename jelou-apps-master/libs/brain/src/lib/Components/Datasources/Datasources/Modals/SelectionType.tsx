/* eslint-disable @nx/enforce-module-boundaries */

import { t } from "i18next";
import get from "lodash/get";
import { useState } from "react";

import { CloseIcon1 } from "@apps/shared/icons";
import { DATASOURCE, DATASOURCE_TYPES } from "libs/brain/src/lib/constants";
import { Datasource, NextStep, STEPS } from "./types";

type Props = {
    closeModal: () => void;
    nextStep: (data: NextStep) => void;
    backStep: (data: Omit<NextStep, "data">) => void;
    datasource: Datasource;
};

export function SelectTypeData({ closeModal, nextStep, backStep, datasource }: Props) {
    const [selectedType, setSelectedType] = useState<string>(get(datasource, "type", ""));

    const TypeList = [
        {
            id: DATASOURCE_TYPES.TEXT,
            title: t("common.text"),
            description: t("brain.knowledgeTextDescription"),
            // description: `${t("brain.onlyForBotsInstruction1")} ${DATASOURCE.SINGULAR_LOWER} ${t("brain.onlyForBotsInstruction2")}`,
            Icon: TestListIcon,
        },
        /*{
            id: DATASOURCE_TYPES.FILE,
            title: t("common.file"),
            description: t("brain.knowledgeFileDescription"),
            // description: `${t("brain.onlyForConnectInstruction")} ${DATASOURCE.SINGULAR_LOWER}`,
            Icon: FileIcon,
        },
        {
            id: DATASOURCE_TYPES.WEBPAGE,
            title: t("common.webpage"),
            description: t("brain.knowledgeWebpageDescription"),
            // description: `${t("brain.onlyForBotsInstruction1")} ${DATASOURCE.SINGULAR_LOWER} ${t("brain.onlyForBotsInstruction2")}`,
            Icon: WebPageIcon,
        },*/
        {
          id: DATASOURCE_TYPES.SKILL,
          title: "Skill",
          description: t("brain.knowledgeSkillDescription"),
          // description: `${t("brain.onlyForConnectInstruction")} ${DATASOURCE.SINGULAR_LOWER}`,
          Icon: SkillIcon,
        },
        /*{
            id: DATASOURCE_TYPES.WORKFLOW,
            title: t("common.flow"),
            description: t("brain.knowledgeWorkflowDescription"),
            // description: `${t("brain.onlyForConnectInstruction")} ${DATASOURCE.SINGULAR_LOWER}`,
            Icon: FlowIcon,
        },*/

    ];

    const toggleSelectedType = (type: string) => {
        setSelectedType(type);
    };

    const back = () => {
        backStep({ currentStep: STEPS.SELECT_TYPE, nextStep: STEPS.PRINCIPAL_DATA });
    };

    const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            type: selectedType,
        };

        nextStep({ currentStep: STEPS.SELECT_TYPE, nextStep: STEPS.FILL_DATA, data });
    };

    return (
        <main className="flex h-full flex-col">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-semibold text-primary-200">{`${t("common.typeOf")} ${DATASOURCE.SINGULAR_LOWER}`}</h3>
                <button onClick={closeModal}>
                    <CloseIcon1 fill="currentColor" className="text-primary-200" width={14} heigth={14} />
                </button>
            </div>

            <form className="flex flex-1 flex-col" onSubmit={handleNext}>
                {TypeList.map((item) => {
                    const { Icon, description, id, title } = item;
                    const isChecked = selectedType === id;

                    return (
                        <label
                            onClick={() => toggleSelectedType(id)}
                            key={id}
                            className={`mb-3 grid cursor-pointer grid-cols-[3rem_auto] items-center gap-4 rounded-3 border-2 border-opacity-50 py-4 pl-4 transition-all duration-200 ${
                                isChecked ? "border-primary-200 text-primary-200" : "border-neutral-200 hover:border-gray-400"
                            }`}
                        >
                            <div className="grid place-content-center text-current">
                                <Icon />
                            </div>
                            <div>
                                <h4 className={`text-[14px] font-semibold ${isChecked ? "text-primary-200" : "text-gray-610"}`}>{title}</h4>
                                <p className={`mt-1 text-xs ${isChecked ? "text-primary-200" : "text-gray-400"}`}>{description}</p>
                            </div>
                        </label>
                    );
                })}

                <footer className="mb-0 mt-auto flex items-center justify-end gap-x-6">
                    <button type="button" onClick={back} className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400">
                        {`${t("common.back")}`}
                    </button>
                    <button type="submit" disabled={!selectedType} className="min-w-fit button-primary flex h-9 w-28 items-center justify-center px-5">
                        {`${t("common.next")}`}
                    </button>
                </footer>
            </form>
        </main>
    );
}

function TestListIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="currentColor" opacity={0.15} />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.333 18.5h17.333m-17.333 4.333h17.333m-17.333 4.334h17.333M15.333 31.5h17.333" />
        </svg>
    );
}

// function FileIcon() {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 48 48">
//             <circle cx="24" cy="24" r="24" fill="currentColor" opacity={0.15} />
//             <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M20.75 24h6.5m-6.5 4.333h6.5m2.166 5.417H18.584a2.167 2.167 0 0 1-2.166-2.167V16.417c0-1.197.97-2.167 2.166-2.167h6.051c.288 0 .563.114.767.317l5.865 5.866c.203.203.317.478.317.766v10.384c0 1.197-.97 2.167-2.166 2.167Z"
//             />
//         </svg>
//     );
// }

// function WebPageIcon() {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 48 48">
//             <circle cx="24" cy="24" r="24" fill="currentColor" opacity={0.15} />
//             <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M33.75 24c0 5.385-4.365 9.75-9.75 9.75M33.75 24c0-5.385-4.365-9.75-9.75-9.75M33.75 24h-19.5M24 33.75c-5.385 0-9.75-4.365-9.75-9.75M24 33.75c1.795 0 3.25-4.365 3.25-9.75s-1.455-9.75-3.25-9.75m0 19.5c-1.795 0-3.25-4.365-3.25-9.75s1.455-9.75 3.25-9.75M14.25 24c0-5.385 4.365-9.75 9.75-9.75"
//             />
//         </svg>
//     );
// }

function FlowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="currentColor" opacity={0.15} />
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M30.5 20.666a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM17.5 28.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM30.5 35.834a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM20.306 26.636l7.399 4.311M27.694 19.053l-7.388 4.311"
            />
        </svg>
    );
}

function SkillIcon() {
    return (
        <svg width="35" height="35" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#EFF1F4" />
            <path
                d="M17.5 34.2083V21.75C17.5 24.3359 18.5272 26.8158 20.3557 28.6443C22.1842 30.4728 24.6641 31.5 27.25 31.5"
                stroke="#727C94"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="14.25" y="15.25" width="6.5" height="6.5" stroke="#727C94" strokeWidth="2" strokeLinejoin="round" />
            <rect x="27.25" y="28.25" width="6.5" height="6.5" stroke="#727C94" strokeWidth="2" strokeLinejoin="round" />
        </svg>
    );
}
