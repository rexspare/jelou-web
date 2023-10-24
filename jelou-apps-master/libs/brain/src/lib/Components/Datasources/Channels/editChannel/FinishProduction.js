import React, { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import { LeftArrow1 } from "@apps/shared/icons";
import { TextInput } from "@apps/shared/common";
import { CREATE_PRODUCTION_STEP, PRODUCTION_TYPE_WA } from "../../../../constants";
import ModalFooter1 from "../../../../Modal/modalFooter1";
import PhoneInput from "react-phone-number-input";

export default function FinishProduction(props) {
    const {
        handlePrimaryClick,
        handleSecondaryClick,
        environment,
        cloudOptions,
        setCloudOptions,
        isLoadingProductionCloud,
        premiseOptions,
        channelSelected,
        refetchChannel,
    } = props;

    const { t } = useTranslation();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setCloudOptions({ ...cloudOptions, [name]: value });
    };

    const disableCloudButton =
        isEmpty(cloudOptions.displayPhoneNumber) ||
        isEmpty(cloudOptions.accountId) ||
        isEmpty(cloudOptions.phoneNumberId) ||
        isEmpty(cloudOptions.access_token) ||
        !isPossiblePhoneNumber(cloudOptions?.displayPhoneNumber);

    const link = get(premiseOptions, "link", "");
    const inProduction = get(channelSelected, "metadata.inProduction", false);
/*
    const { link = "" } = premiseOptions
    const { metadata = {} } = channelSelected;
    const { inProduction = false } = metadata; */

    useEffect(() => {
        if (inProduction) {
            handleSecondaryClick(CREATE_PRODUCTION_STEP.FINISH);
        }
    }, [channelSelected]);
/*
    useEffect(() => {
        if (environment === PRODUCTION_TYPE_WA.CLOUD) return;
        const intervalCall = setInterval(() => {
            console.log("minute");
            refetchChannel();
        }, 60 * 1000);

        return () => {
            // clean up
            clearInterval(intervalCall);
        };
    }, [environment]); */

    //On premise
    if (environment === PRODUCTION_TYPE_WA.ON_PREMISE) {
        return (
            <div className="flex flex-col space-y-6 p-8 px-10">
                <header className="flex items-center space-x-3 text-gray-400">
                    <span className="font-semibold text-gray-610">On Premise</span>
                </header>
                <span className="text-sm leading-5 text-gray-400">
                    <Trans i18nKey="brain.Para continuar con el proceso a traves de On premise, ingresa al siguiente boton" />
                </span>
                <a
                    href={link}
                    rel="noreferrer"
                    target="_blank"
                    className="flex w-44 cursor-pointer items-center justify-center rounded-full border-1 border-primary-200 px-3 py-1 font-semibold text-primary-200">
                    {t("brain.Iniciar proceso")}
                    <LeftArrow1 className="rotate-180" />
                </a>
            </div>
        );
    }

    // Cloud
    return (
        <div className="flex max-h-[55vh] min-h-[35vh] flex-col space-y-6 overflow-y-auto p-6 px-10">
            <header className="flex items-center space-x-3 divide-x-1 text-gray-400">
                <button onClick={() => handleSecondaryClick(CREATE_PRODUCTION_STEP.FINISH)}>
                    <LeftArrow1 />
                </button>
                <span className="pl-2 font-bold text-gray-610">Cloud</span>
            </header>
            <span className="text-sm leading-5 text-gray-400">
                <Trans i18nKey="brain.Para pasar a produccion el canal a traves de Cloud, recuerda ingresar correctamente los datos requeridos ya que es un proceso propio de Meta y la validacion va por su cuenta, por favor ingresa los siguientes datos" />
            </span>
            <div className="flex flex-col space-y-4">
                <div>
                    <span className={`mb-1 block items-center gap-2 text-sm font-semibold text-gray-610`}>{t("common.phone")}</span>
                    <div className="flex h-11 grow rounded-lg border-1 border-neutral-200 px-4 py-3 font-medium text-gray-610">
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="EC"
                            value={cloudOptions.displayPhoneNumber}
                            onChange={(value) => setCloudOptions({ ...cloudOptions, displayPhoneNumber: value })}
                        />
                    </div>
                </div>
                <div>
                    <TextInput
                        labelClassName="mb-1 block items-center gap-2 text-sm font-semibold text-gray-610"
                        label={t("brain.Account ID")}
                        placeholder={t("brain.Escriba el id de cuenta")}
                        name={"accountId"}
                        onChange={handleInput}
                    />
                    <a
                        target="_blank"
                        href="https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/"
                        className="text-13 font-light text-primary-200 underline hover:text-primary-100"
                        rel="noreferrer">
                        {t("brain.Como lo obtengo")}
                    </a>
                </div>
                <div>
                    <TextInput
                        labelClassName="mb-1 block items-center gap-2 text-sm font-semibold text-gray-610"
                        label={t("brain.Access token")}
                        placeholder={t("brain.Escriba token")}
                        name={"access_token"}
                        onChange={handleInput}
                    />
                    <a
                        target="_blank"
                        href="https://developers.facebook.com/blog/post/2022/12/05/auth-tokens/"
                        className="text-13 font-light text-primary-200 underline hover:text-primary-100"
                        rel="noreferrer">
                        {t("brain.Como lo obtengo")}
                    </a>
                </div>
                <div>
                    <TextInput
                        labelClassName="mb-1 block items-center gap-2 text-sm font-semibold text-gray-610"
                        label={t("brain.Phone Number ID")}
                        placeholder={t("brain.Escriba el id del número de teléfono")}
                        name={"phoneNumberId"}
                        onChange={handleInput}
                    />
                </div>
            </div>
            <ModalFooter1
                closeModal={() => handleSecondaryClick(CREATE_PRODUCTION_STEP.FINISH)}
                primaryText={t("common.create")}
                disableButton={disableCloudButton}
                loading={isLoadingProductionCloud}
                primaryAction={() => handlePrimaryClick(CREATE_PRODUCTION_STEP.FINISH)}
            />
        </div>
    );
}
