import React, { useRef } from "react";

import { useTranslation } from "react-i18next";

import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon, PremiumCrown } from "@apps/shared/icons";
import Lottie from "react-lottie";
import PremiumFeatureAnimation from "./animations/premiumCrownAnimation.json";
import { Modal } from "./modals";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: PremiumFeatureAnimation,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

const PremiumFeaturesModal = (props) => {
    const { setOpen, premiumFeature, fromBots } = props;

    const ref = useRef();
    const { t } = useTranslation();

    useOnClickOutside(ref, () => {
        return setOpen(false);
    });

    return (
        <Modal isShow={true} widthModal="w-[27rem]">
            <div className="relative flex h-[29rem] w-[27rem] flex-col  rounded-12 bg-white px-10 shadow-modal" ref={ref}>
                <button onClick={() => setOpen(false)}>
                    <CloseIcon className="absolute top-2 right-2 fill-current text-gray-400" width="1rem" height="1rem" />
                </button>
                <Lottie options={defaultOptions} height={250} width={250} />
                <div className="flex items-center pb-2">
                    <PremiumCrown height={"1.4rem"} width={"1.4rem"} className="text-[#EEBE39]" />
                    <p className="pl-2 text-left text-xl font-bold text-[#987001]">{fromBots ? t("modalPremium.premiumFunction") : t("common.configPaid")}</p>
                </div>
                <p className="text-lg text-gray-400">
                    {fromBots ? (
                        <>
                            {t("modalPremium.activateFunctionality")}
                            <a href="mailto:ventas@jelou.ai" className=" mx-1 inline text-primary-200 underline">
                                ventas@jelou.ai
                            </a>
                            {t("modalPremium.throughWebsite")}
                        </>
                    ) : (
                        <>
                            <span className="font-bold text-gray-500">{`${t("common.configPaidText1")} ${premiumFeature} ${t("common.configPaidText2")}`}</span> {t("common.configPaidText3")}
                            <span className="font-bold text-gray-500"> soporte@jelou.ai</span>
                        </>
                    )}
                </p>
                <div className="flex w-full flex-col justify-center pt-6 pb-8 md:flex-row">
                    <div className="mt-6 mr-3 flex text-center md:mt-0">
                        <button
                            type="submit"
                            className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                            onClick={() => setOpen(false)}
                        >
                            {t("botsComponentDelete.cancel")}
                        </button>
                    </div>
                    <div className="mt-6 flex text-center md:mt-0">
                        <button
                            type="submit"
                            className=" premium-gradient w-32 rounded-20 font-bold text-white"
                            //  onClick={onConfirm}
                        >
                            <a href="mailto:soporte@jelou.ai"> {`${t("common.contactUs")} `}</a>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PremiumFeaturesModal;
