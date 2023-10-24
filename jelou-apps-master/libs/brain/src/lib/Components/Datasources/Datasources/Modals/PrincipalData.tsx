/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

import { CloseIcon1 } from "@apps/shared/icons";
import { DATASOURCE, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "libs/brain/src/lib/constants";
import { INPUTS_NAMES } from "./consts";
import { InputCheckbox } from "libs/shop/src/lib/components/CreateProduct/Manually/PrincipalDataPanel/InputCheckbox";
import { Datasource, NextStep, STEPS } from "./types";
import { validateObjectParams } from "libs/brain/src/lib/hooks/helpers";
import ModalFooter from "libs/brain/src/lib/Modal/modalFooter";
import NameComponent from "libs/brain/src/lib/Modal/nameComponent";

type Props = {
    closeModal: () => void;
    nextStep: (props: NextStep) => void;
    datasource: Datasource;
};

export function PrincipalData({ closeModal, nextStep, datasource }: Props) {
    const { t } = useTranslation();

    const [disableButton, setDisableButton] = useState(true);
    const [datasourceValues, setDatasourceValues] = useState({
        name: get(datasource, "name", ""),
        description: get(datasource, "description", ""),
        available_on_bots: get(datasource, "available_on_bots", true),
        available_on_connect: get(datasource, "available_on_connect", false),
    });

    useEffect(() => {
        const isValid = validateObjectParams({ obj: datasourceValues, validate: { name: true } });
        setDisableButton(!isValid);
    }, [datasourceValues]);

    const handleUpdateDatasourceParams = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setDatasourceValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const hanldeNextStep = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);

        const available_on_bots = formData.get(INPUTS_NAMES.AVAILABLE_ON_BOTS) === "on";
        const available_on_connect = formData.get(INPUTS_NAMES.AVAILABLE_ON_CONNECT) === "on";

        const data = {
            name: formData.get(INPUTS_NAMES.NAME) as string,
            description: formData.get(INPUTS_NAMES.DESCRIPTION) as string,
            available_on_bots,
            available_on_connect,
        };

        nextStep({ data, currentStep: STEPS.PRINCIPAL_DATA, nextStep: STEPS.SELECT_TYPE });
    };

    return (
        <main className="flex h-full flex-col">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-base font-semibold text-primary-200">{t<string>("common.mainInformation")}</h3>
                <button onClick={closeModal}>
                    <CloseIcon1 fill="currentColor" className="text-primary-200" width={14} heigth={14} />
                </button>
            </div>
            <form onSubmit={hanldeNextStep} className="flex flex-1 flex-col">
                <section className="text-sm text-gray-400">
                    <div className="flex flex-row">
                        <div className="mt-3 h-24 w-full">
                            <NameComponent
                                title={`${t("common.nameOf")} ${DATASOURCE.SINGULAR_LOWER}`}
                                placeholder={t("common.placeholderExample")}
                                onChange={handleUpdateDatasourceParams}
                                itemValues={datasourceValues}
                                maxLength={NAME_MAX_LENGTH}
                                length={datasourceValues.name?.length}
                                minLength={NAME_MIN_LENGTH}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="mb-2 mt-4 text-base font-semibold text-primary-200">{t<string>("common.connectTo")}</h3>

                    <label
                        className={`mb-3 grid cursor-pointer grid-cols-[1rem_3rem_auto] items-center gap-4 rounded-3 border-2 border-primary-370 py-4 pl-4 transition-all duration-200 hover:border-primary-200`}
                    >
                        <InputCheckbox defaultValue={datasourceValues.available_on_bots} hasError={null} label="" name="available_on_bots" />
                        <div className="grid place-content-center">
                            <BotsIcons />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-semibold text-gray-610">Chatbots</h4>
                            <p className="mt-1 text-xs text-gray-400">{`${t("brain.onlyForBotsInstruction1")} `}</p>
                        </div>
                    </label>
                    <label
                        className={`grid cursor-pointer grid-cols-[1rem_3rem_auto] items-center gap-4 rounded-3 border-2 border-primary-370 py-4 pl-4 transition-all duration-200 hover:border-primary-200`}
                    >
                        <InputCheckbox defaultValue={datasourceValues.available_on_connect} hasError={null} label="" name="available_on_connect" />
                        <div className="grid place-content-center">
                            <PMAIcons />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-semibold text-gray-610">{t<string>("common.onlyForConnect")}</h4>
                            <p className="mt-1 text-xs text-gray-400">{`${t("brain.onlyForConnectInstruction")}`}</p>
                        </div>
                    </label>
                </section>

                <ModalFooter primaryText={t("common.next")} loading={false} closeModal={closeModal} disableButton={disableButton} isEditing={false} />
            </form>
        </main>
    );
}

function BotsIcons() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="#E9F5F3" />
            <path
                fill="#209F8B"
                d="M20.599 22.515a2.856 2.856 0 0 0-2.844 2.844 2.856 2.856 0 0 0 2.844 2.843 2.856 2.856 0 0 0 2.843-2.843 2.856 2.856 0 0 0-2.843-2.844Zm0 3.988c-.624 0-1.145-.52-1.145-1.144 0-.625.52-1.145 1.145-1.145.624 0 1.144.52 1.144 1.145 0 .624-.52 1.144-1.144 1.144ZM28.401 22.515a2.856 2.856 0 0 0-2.843 2.844 2.856 2.856 0 0 0 2.843 2.843 2.856 2.856 0 0 0 2.843-2.843 2.856 2.856 0 0 0-2.843-2.844Zm0 3.988c-.624 0-1.144-.52-1.144-1.144 0-.625.52-1.145 1.144-1.145.624 0 1.144.52 1.144 1.145 0 .624-.52 1.144-1.144 1.144Z"
            />
            <path
                fill="#209F8B"
                d="M34.435 22.203c-.07 0-.139 0-.208.035v-1.7c0-2.08-1.7-3.814-3.815-3.814H27.57c.035-.104.07-.173.07-.277a3.167 3.167 0 0 0-3.156-3.155 3.167 3.167 0 0 0-3.156 3.155c0 .104.035.208.07.277h-2.844c-2.08 0-3.814 1.7-3.814 3.815v1.699c-.07 0-.14-.035-.209-.035a3.167 3.167 0 0 0-3.155 3.156 3.167 3.167 0 0 0 3.155 3.155c.07 0 .14 0 .209-.034v1.699c0 2.115 1.699 3.814 3.814 3.814h11.894c2.08 0 3.814-1.699 3.814-3.814v-1.7c.07 0 .14.035.208.035a3.167 3.167 0 0 0 3.156-3.155c-.035-1.734-1.422-3.156-3.19-3.156ZM14.53 26.85a1.465 1.465 0 0 1-1.456-1.456c0-.798.659-1.457 1.457-1.457.069 0 .138 0 .208-.035v2.983c-.07-.035-.14-.035-.209-.035Zm8.496-10.403c0-.797.66-1.456 1.457-1.456s1.456.659 1.456 1.456c0 .104.035.208.07.277h-3.052a.653.653 0 0 0 .07-.277Zm9.536 13.732a2.102 2.102 0 0 1-2.115 2.115H18.553a2.102 2.102 0 0 1-2.115-2.115v-9.64c0-1.18.936-2.115 2.115-2.115h11.894c1.179 0 2.115.936 2.115 2.115v9.64Zm1.873-3.329c-.07 0-.139 0-.208.035v-2.983c.07 0 .138.035.208.035.797 0 1.456.659 1.456 1.457.035.762-.624 1.456-1.456 1.456Z"
            />
        </svg>
    );
}

function PMAIcons() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="#E6F6FA" />
            <path
                fill="#00A2CF"
                d="M18.221 24.817h-.8c-.88 0-1.594-.878-1.594-1.955 0-1.08.714-1.958 1.595-1.958h.473v.95h-.473c-.367 0-.677.46-.677 1.006 0 .545.31 1.005.677 1.005h.8v.952ZM29.778 24.817h.8c.88 0 1.595-.878 1.595-1.955 0-1.08-.715-1.958-1.595-1.958h-.473v.95h.473c.367 0 .677.46.677 1.006 0 .545-.31 1.005-.677 1.005h-.8v.952Z"
            />
            <path fill="#00A2CF" d="M26.527 25.808v-.949c.947 0 1.697-.279 2.224-.827.904-.938.933-2.445.933-2.46l.892.054c0 .076.005 1.845-1.17 3.072-.704.736-1.674 1.11-2.879 1.11Z" />
            <path
                fill="#00A2CF"
                d="M25.055 27.054c-1.064 0-1.93-.77-1.93-1.72 0-.947.866-1.72 1.93-1.72 1.065 0 1.931.77 1.931 1.72s-.866 1.72-1.93 1.72Zm0-2.489c-.549 0-1.012.353-1.012.769 0 .418.463.77 1.012.77.55 0 1.013-.352 1.013-.77 0-.416-.464-.769-1.013-.769ZM17.923 21.465l-.132-.94c2.972-.448 5.028-1.449 6.107-2.98.973-1.379.774-2.683.767-2.737l.904-.164c.012.069.281 1.725-.911 3.436-1.226 1.76-3.493 2.898-6.735 3.385Z"
            />
            <path fill="#00A2CF" d="M28.927 21.629c-3.467 0-5.086-3.53-5.102-3.569l.833-.398c.07.154 1.75 3.78 5.414 2.87l.213.923c-.48.122-.933.174-1.358.174Z" />
            <path
                fill="#00A2CF"
                d="M24 28.645c-3.642 0-6.602-3.228-6.602-7.197 0-3.97 2.963-7.198 6.602-7.198 3.642 0 6.602 3.228 6.602 7.198 0 3.969-2.96 7.197-6.602 7.197ZM24 15.2c-3.135 0-5.684 2.802-5.684 6.248 0 3.445 2.549 6.247 5.684 6.247 3.135 0 5.684-2.802 5.684-6.247 0-3.446-2.549-6.248-5.684-6.248Z"
            />
            <path
                fill="#00A2CF"
                d="M14.272 33.75c-.01-.066-.203-1.603.76-2.746.648-.77 1.64-1.16 2.95-1.16 1.06 0 1.806-.27 2.218-.798.553-.714.345-1.72.343-1.73l.894-.213c.014.059.315 1.449-.513 2.528-.594.774-1.583 1.165-2.941 1.165-1.027 0-1.787.28-2.253.83-.689.81-.535 2.112-.535 2.124h-.923Z"
            />
            <path fill="#00A2CF" d="m24.043 32.705-3.737-3.042.568-.746 3.15 2.567 2.953-2.558.589.73-3.523 3.049Z" />
            <path
                fill="#00A2CF"
                d="m33.728 33.75-.852-.002c.002-.01.085-1.315-.603-2.125-.467-.55-1.224-.83-2.253-.83-1.358 0-2.348-.39-2.94-1.164-.827-1.08-.527-2.47-.513-2.528l.895.215-.447-.108.447.106c-.003.01-.21 1.015.343 1.73.412.53 1.157.798 2.217.798 1.309 0 2.303.391 2.95 1.16.96 1.145.765 2.682.756 2.748Z"
            />
            <path
                stroke="#00A2CF"
                strokeWidth=".2"
                d="M18.221 24.817h-.8c-.88 0-1.594-.878-1.594-1.955 0-1.08.714-1.958 1.595-1.958h.473v.95h-.473c-.367 0-.677.46-.677 1.006 0 .545.31 1.005.677 1.005h.8v.952ZM29.778 24.817h.8c.88 0 1.595-.878 1.595-1.955 0-1.08-.715-1.958-1.595-1.958h-.473v.95h.473c.367 0 .677.46.677 1.006 0 .545-.31 1.005-.677 1.005h-.8v.952Z"
            />
            <path
                stroke="#00A2CF"
                strokeWidth=".2"
                d="M26.527 25.808v-.949c.947 0 1.697-.279 2.224-.827.904-.938.933-2.445.933-2.46l.892.054c0 .076.005 1.845-1.17 3.072-.704.736-1.674 1.11-2.879 1.11Z"
            />
            <path
                stroke="#00A2CF"
                strokeWidth=".2"
                d="M25.055 27.054c-1.064 0-1.93-.77-1.93-1.72 0-.947.866-1.72 1.93-1.72 1.065 0 1.931.77 1.931 1.72s-.866 1.72-1.93 1.72Zm0-2.489c-.549 0-1.012.353-1.012.769 0 .418.463.77 1.012.77.55 0 1.013-.352 1.013-.77 0-.416-.464-.769-1.013-.769ZM17.923 21.465l-.132-.94c2.972-.448 5.028-1.449 6.107-2.98.973-1.379.774-2.683.767-2.737l.904-.164c.012.069.281 1.725-.911 3.436-1.226 1.76-3.493 2.898-6.735 3.385Z"
            />
            <path stroke="#00A2CF" strokeWidth=".2" d="M28.927 21.629c-3.467 0-5.086-3.53-5.102-3.569l.833-.398c.07.154 1.75 3.78 5.414 2.87l.213.923c-.48.122-.933.174-1.358.174Z" />
            <path
                stroke="#00A2CF"
                strokeWidth=".2"
                d="M24 28.645c-3.642 0-6.602-3.228-6.602-7.197 0-3.97 2.963-7.198 6.602-7.198 3.642 0 6.602 3.228 6.602 7.198 0 3.969-2.96 7.197-6.602 7.197ZM24 15.2c-3.135 0-5.684 2.802-5.684 6.248 0 3.445 2.549 6.247 5.684 6.247 3.135 0 5.684-2.802 5.684-6.247 0-3.446-2.549-6.248-5.684-6.248Z"
            />
            <path
                stroke="#00A2CF"
                strokeWidth=".2"
                d="M14.272 33.75c-.01-.066-.203-1.603.76-2.746.648-.77 1.64-1.16 2.95-1.16 1.06 0 1.806-.27 2.218-.798.553-.714.345-1.72.343-1.73l.894-.213c.014.059.315 1.449-.513 2.528-.594.774-1.583 1.165-2.941 1.165-1.027 0-1.787.28-2.253.83-.689.81-.535 2.112-.535 2.124h-.923Z"
            />
            <path stroke="#00A2CF" strokeWidth=".2" d="m24.043 32.705-3.737-3.042.568-.746 3.15 2.567 2.953-2.558.589.73-3.523 3.049Z" />
            <path
                stroke="#00A2CF"
                strokeWidth=".2"
                d="m33.728 33.75-.852-.002c.002-.01.085-1.315-.603-2.125-.467-.55-1.224-.83-2.253-.83-1.358 0-2.348-.39-2.94-1.164-.827-1.08-.527-2.47-.513-2.528l.895.215-.447-.108.447.106c-.003.01-.21 1.015.343 1.73.412.53 1.157.798 2.217.798 1.309 0 2.303.391 2.95 1.16.96 1.145.765 2.682.756 2.748Z"
            />
        </svg>
    );
}
