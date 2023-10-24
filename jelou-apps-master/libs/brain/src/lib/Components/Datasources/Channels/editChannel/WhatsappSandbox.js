import dayjs from "dayjs";
import advanced from "dayjs/plugin/advancedFormat";
import customFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";

import { CloseIcon1, WarningIcon } from "@apps/shared/icons";
import DeleteButton from "../../../../Common/deleteButton";
import NameComponent from "../../../../Modal/nameComponent";
import { CHANNEL, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../../constants";
import { useGetSwaps, useOnPremiseCheckStatusJob } from "../../../../services/brainAPI";
import QRCodeImage from "../common/qrCodeImage";
import WhatsappTesters from "../common/whatsappTesters";
import ProductionModal from "./productionModal";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);
dayjs.extend(customFormat);

const MILISECONDSXHOUR = 3600 * 1000;

export default function WhatsappSandbox(props) {
    const {
        onChangeName,
        channelSelected,
        openDeleteModal,
        cloudOptions,
        setCloudOptions,
        productionCloud,
        isLoadingProductionCloud,
        refetchChannel,
        testers,
        setTesters,
        setInitialTesters,
        setLinkFromOnPromise,
        hasLink,
        inProduction,
        useProductionCloud,
        onPromiseToProduction
    } = props;

    const { t } = useTranslation();
    dayjs.tz.setDefault("America/Guayaquil");

    const [areAllPhoneNumbersValid, setAreAllPhoneNumbersValid] = useState(false);
    const [openProductionModal, setOpenProductionModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [duplicateNameError, setDuplicateNameError] = useState("");

    const { data: swapData } = useGetSwaps({ referenceId: channelSelected?.reference_id });

    const { mutateAsync: checkOnPremiseStatus } = useOnPremiseCheckStatusJob({
        channelId: channelSelected?.id,
    });

    const goToProduction = () => {
        /*         if (!hasLink && !inProduction) {
            checkOnPremiseStatus();
        } */
        setOpenProductionModal(true);
    };

    const closeProductionModal = () => {
        setOpenProductionModal(false);
    };

    const handleOpenDeleteModal = () => {
        openDeleteModal();
    };

    useEffect(() => {
        if (hasLink) {
            const intervalCall = setInterval(() => {
                checkOnPremiseStatus(
                    {},
                    {
                        onSuccess: (data) => {
                            if (data?.app?.live) {
                              onPromiseToProduction(data?.app?.name,data?.app?.phone);
                            }
                        },
                    }
                );
                refetchChannel();
            }, 60 * 1000);

            return () => {
                // clean up
                clearInterval(intervalCall);
            };
        }
    }, [hasLink, inProduction, channelSelected]);

    useEffect(() => {
        const phones = get(swapData, "data", []);
        if (!isEmpty(phones)) {
            const referenceIds = phones?.map((phone) => `+${get(phone, "referenceId", "")}`);
            setTesters(referenceIds);
            setInitialTesters(Object.freeze(cloneDeep(referenceIds)));
        } else {
            setTesters([""]);
            setInitialTesters([""]);
        }
    }, [swapData]);

    useEffect(() => {
        if (channelSelected?.metadata?.link && channelSelected?.metadata?.dateCreate) {
            const diff = dayjs.tz().diff(dayjs.tz(dayjs(channelSelected?.metadata?.dateCreate)), "miliseconds");
            const oneHour = MILISECONDSXHOUR > diff;
            setRemainingTime(oneHour ? diff : null);
        }
    }, [channelSelected]);

    const renderer = ({ minutes, seconds, completed }) => {
        if (!completed && openProductionModal) {
            return (
                <div className="flex w-full flex-col justify-start gap-y-4">
                    <span className="w-1/2 text-sm text-gray-400">
                        {`${t("brain.whatsappChannelAproved1")} `} <b>{`${t("common.approved")} `}</b> {`${t("brain.whatsappChannelAproved2")} `}
                        <b>{t("brain.whatsappChannelAproved3")}</b>
                        {`, ${t("brain.whatsappChannelAproved4")}`}
                    </span>
                    <div className="flex w-full justify-start">
                       <button
                            onClick={goToProduction}
                            className="rounded-full border-1 border-primary-200 px-4 py-2 font-bold text-primary-200 hover:opacity-80">
                            <span>
                                {minutes}:{seconds}
                            </span>
                        </button>
                    </div>
                </div>
            );
        }
        if (!completed) {
            return (
                <div className="flex w-full flex-row gap-x-4">
                    <div className="flex w-1/2 flex-col gap-y-4">
                        <span className="text-sm text-gray-400">
                            {`${t("brain.whatsappChannelAproved1")} `} <b>{`${t("common.approved")} `}</b> {`${t("brain.whatsappChannelAproved2")} `}
                            <b>{t("brain.whatsappChannelAproved3")}</b>
                            {`, ${t("brain.whatsappChannelAproved4")}`}
                        </span>
                        <div className="flex w-full justify-start">
                            <a
                                href={channelSelected?.metadata?.link}
                                rel="noreferrer"
                                target="_blank"
                                className="flex cursor-pointer items-center justify-center rounded-full border-1 border-primary-200 px-3 py-1 font-semibold text-primary-200"
                            >
                                {t("brain.Continuar proceso de producción")}
                            </a>
                            <span className="ml-2 flex items-center font-bold  text-neutral-200">
                                {minutes}:{seconds}
                            </span>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center">
                        <div className="flex w-full flex-row items-start justify-start gap-x-8 rounded-12 bg-[#FFFAE8] p-4">
                            <WarningIcon width="1.2rem" height="1.2rem" className="fill-current text-red-675" />
                            <span className="text-sm text-gray-400 ">
                                <b>{t("brain.whatsappChannelWarning1")}</b> {t("brain.whatsappChannelWarning2")} <b>{t("brain.whatsappChannelWarning3")}, </b>
                                {t("brain.whatsappChannelWarning4")}.
                            </span>
                            <CloseIcon1 width={"12px"} height={"12px"} className="fill-current text-gray-610" />
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-[60vh] p-10 py-8">
            <div className="mb-8 grid grid-cols-2 gap-5">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center gap-x-4">
                        <div className="w-full text-sm">
                            <NameComponent
                                title={t("common.channelName")}
                                placeholder={CHANNEL.SINGULAR_CAPITALIZED}
                                onChange={onChangeName}
                                itemValues={channelSelected}
                                maxLength={NAME_MAX_LENGTH}
                                length={channelSelected.name?.length}
                                minLength={NAME_MIN_LENGTH}
                                showAnotherError={duplicateNameError}
                            />
                        </div>
                    </div>
                    <WhatsappTesters
                        testers={testers}
                        setTesters={setTesters}
                        setAreAllPhoneNumbersValid={setAreAllPhoneNumbersValid}
                        areAllPhoneNumbersValid={areAllPhoneNumbersValid}
                        isChannelEdition={true}
                    />
                </div>
                <div className="flex flex-row items-center justify-center text-sm">
                    <div className="flex flex-row items-center">
                        <span className="w-1/2 text-gray-400 line-clamp-2">{t("brain.scanCode")}</span>
                        <div className="p-6">
                            <QRCodeImage size={100} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`flex flex-col gap-3 space-y-3 border-y-1 border-gray-34 py-8`}>
                {remainingTime !== null ? (
                    <Countdown date={Date.now() + (MILISECONDSXHOUR - remainingTime)} renderer={renderer} />
                ) : (
                    <div className="flex w-full flex-col justify-start gap-y-4">
                        <span className="w-1/2 text-sm text-gray-400">
                            {`${t("brain.whatsappChannelAproved1")} `} <b>{`${t("common.approved")} `}</b> {`${t("brain.whatsappChannelAproved2")} `}
                            <b>{t("brain.whatsappChannelAproved3")}</b>
                            {`, ${t("brain.whatsappChannelAproved4")}`}
                        </span>
                        <div className="flex w-full justify-start">
                            <button
                                onClick={goToProduction}
                                className="rounded-full border-1 border-primary-200 px-4 py-2 font-bold text-primary-200 hover:opacity-80">
                                {t("botsCard.goToProduction")}
                            </button>
                        </div>
                      </div>
                    )
                }
            </div>
            <div className="my-4 flex flex-col gap-5 pb-8">
                <div className="flex flex-col space-y-2">
                    <span className="text-base font-bold text-gray-610">{t("common.deleteChannel")}</span>
                    <span className="mb-2 text-sm text-gray-400">{t("brain.deleteChannelInstruction")}</span>
                </div>
                <DeleteButton onClick={handleOpenDeleteModal} buttonText={`${t("common.delete")} ${t(CHANNEL.SINGULAR_LOWER)}`} showIcon={true} />
            </div>
            <ProductionModal
                openModal={openProductionModal}
                closeModal={closeProductionModal}
                cloudOptions={cloudOptions}
                setCloudOptions={setCloudOptions}
                channelSelected={channelSelected}
                productionCloud={productionCloud}
                isLoadingProductionCloud={isLoadingProductionCloud}
                testers={testers}
                refetchChannel={refetchChannel}
                setLinkFromOnPromise={setLinkFromOnPromise}
                remainingTime={remainingTime}
                setDuplicateNameError={setDuplicateNameError}
            />
        </div>
    );
}
