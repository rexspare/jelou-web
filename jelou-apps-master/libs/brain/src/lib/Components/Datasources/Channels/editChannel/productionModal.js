import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { CloseIcon1, SettingsIcon } from "@apps/shared/icons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Modal } from "../../../../Modal";
import { CHANNEL, CREATE_PRODUCTION_STEP, PRODUCTION_TYPE_WA } from "../../../../constants";
import { deleteSwap, useSendChannelToProductionOnPremise } from "../../../../services/brainAPI";
import ChooseEnvironment from "./ChooseEnvironment";
import FinishProduction from "./FinishProduction";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ProductionModal(props) {
    const {
        openModal,
        closeModal,
        cloudOptions,
        setCloudOptions,
        channelSelected,
        isLoadingProductionCloud,
        productionCloud,
        testers,
        refetchChannel,
        setLinkFromOnPromise,
        remainingTime,
        setDuplicateNameError
    } = props;

    const { t } = useTranslation();

    const [environment, setEnvironment] = useState("");
    const [premiseOptions, setPremiseOptions] = useState({ name: "", link: "" });
    const [createStep, setCreateStep] = useState(CREATE_PRODUCTION_STEP.ENVIRONMENT);
    dayjs.tz.setDefault("America/Guayaquil");
    const { mutateAsync: productionOnPremise, isLoading: isLoadingProductionPremise } = useSendChannelToProductionOnPremise({
        channelName: channelSelected?.name,
    });

    const link = get(channelSelected, "metadata.link", "");

    useEffect(() => {
        if (remainingTime !== null) {
            setEnvironment(PRODUCTION_TYPE_WA.ON_PREMISE);
            setPremiseOptions((prevState) => ({ ...prevState, link }));
            setCreateStep(CREATE_PRODUCTION_STEP.FINISH);
        } else {
            setCreateStep(CREATE_PRODUCTION_STEP.ENVIRONMENT);
        }
    }, [remainingTime]);

    const removedTesters = async () => {
        let removePromises, allPromises;
        if (!isEmpty(testers)) {
            removePromises = testers.map(async (tester) => {
                const phone = tester.replace("+", "");
                return deleteSwap({ phone });
            });
            allPromises = [...removePromises].filter(Boolean);
            await Promise.all(allPromises);
        }
    };

    const execCloudProduction = async () => {
        //swapt delete
        try {
            await removedTesters();
            // production
            await productionCloud(
                {},
                {
                    onSuccess: () =>
                        toastMessage({
                            messagePart1: `${t("common.successGoingToProduction")}`,
                            type: MESSAGE_TYPES.SUCCESS,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                    onError: () =>
                        toastMessage({
                            messagePart1: `${t("common.errorGoingToProduction")} ${t(CHANNEL.SINGULAR_LOWER)} `,
                            messagePart2: `${channelSelected?.name}`,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                }
            );
            refetchChannel();
        } catch (err) {
            console.log("err", err);
        }
    };

    const execOnPremiseProduction = async () => {
        try {
            await productionOnPremise(
                {},
                {
                    onSuccess: (data) => {
                        setCreateStep(CREATE_PRODUCTION_STEP.FINISH);
                        setPremiseOptions((prevState) => ({ ...prevState, link: data.link }));
                        setLinkFromOnPromise({ link: data.link, dateCreate: dayjs.tz().format(), app_id: data.appId });
                    },
                    onError: (err) => {
                        const { error } = err.response.data;
                        const message = error.developerMessages[localStorage.getItem("lang")];
                        toastMessage({
                            messagePart1: `${t("common.errorGoingToProduction")} ${t(CHANNEL.SINGULAR_LOWER)} : ${message}`,
                            messagePart2: `${channelSelected?.name}`,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        });
                        setDuplicateNameError(t("brain.duplicateName"));
                        closeModal();
                    },
                }
            );
        } catch (err) {
            console.log("error", err);
        }
    };
    //console.log("environment", environment)

    const handlePrimaryClick = async (step) => {
        switch (step) {
            case CREATE_PRODUCTION_STEP.ENVIRONMENT:
                if (environment === PRODUCTION_TYPE_WA.ON_PREMISE) {
                    execOnPremiseProduction();
                    //cloudOptions.metadata.properties.provider.name = CHANNEL_PRODUCTION_TYPE.CLOUD;
                } else {
                    setCreateStep(CREATE_PRODUCTION_STEP.FINISH);
                }
                break;
            case CREATE_PRODUCTION_STEP.FINISH:
                if (environment === PRODUCTION_TYPE_WA.CLOUD) {
                    execCloudProduction();
                }
                closeModal();
                break;
            default:
                break;
        }
    };

    const handleSecondaryClick = (step) => {
        switch (step) {
            case CREATE_PRODUCTION_STEP.FINISH:
                setCreateStep(CREATE_PRODUCTION_STEP.ENVIRONMENT);
                break;
            default:
                closeModal();
                // setCreateStep(CREATE_PRODUCTION_STEP.ENVIRONMENT);
                // afterCreateUpdate();
                return;
        }
    };

    const STEP = {
        [CREATE_PRODUCTION_STEP.ENVIRONMENT]: (
            <ChooseEnvironment
                environment={environment}
                setEnvironment={setEnvironment}
                closeModal={closeModal}
                handlePrimaryClick={handlePrimaryClick}
                isLoadingProductionPremise={isLoadingProductionPremise}
            />
        ),
        [CREATE_PRODUCTION_STEP.FINISH]: (
            <FinishProduction
                handlePrimaryClick={handlePrimaryClick}
                handleSecondaryClick={handleSecondaryClick}
                environment={environment}
                cloudOptions={cloudOptions}
                setCloudOptions={setCloudOptions}
                isLoadingProductionCloud={isLoadingProductionCloud}
                premiseOptions={premiseOptions}
                channelSelected={channelSelected}
                refetchChannel={refetchChannel}
            />
        ),
    };

    return (
        <Modal closeModal={() => null} openModal={openModal} className={`max-h-[65vh] min-h-[25vh] w-auto rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]`} classNameActivate="">
            <div className="w-[45vw] justify-start">
                <header className="right-0 top-0 flex items-center justify-between bg-primary-350 px-10 py-3">
                    <div className="flex items-center gap-x-3 text-primary-200">
                        <SettingsIcon fillCircle={"#e6f7f9"} />
                        <span className="font-semibold">{t("brain.Pasar canal a produccion")}</span>
                    </div>
                    <button onClick={() => handleSecondaryClick("")}>
                        <CloseIcon1 className="fill-current text-primary-200" />
                    </button>
                </header>
                {STEP[createStep]}
            </div>
        </Modal>
    );
}
