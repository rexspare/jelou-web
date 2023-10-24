import { useState } from "react";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie";
import { ClipLoader } from "react-spinners";

import { WarningIcon1 } from "@apps/shared/icons";
import { ModalHeadless } from "../modal-headless/modal-headless";
import animation from "./Session-Warning3.json";

const UnattandedCasesWarning = ({ closeModal = () => null, openModal = {}, isForceNotLogOut, logOut } = {}) => {
    const [loading, setLoading] = useState(false);
    const { isOpen = false, numOfRooms = 0 } = openModal;
    const { t } = useTranslation();

    const handleLogOut = (evt) => {
        evt.preventDefault();
        setLoading(true);
        logOut();
        setLoading(false);
        closeModal();
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <ModalHeadless closeModal={closeModal} isOpen={isOpen} className="w-[26rem]">
            <Lottie options={defaultOptions} height={200} width={255} />

            <footer className="mt-3 flex w-full justify-center">
                <div>
                    <div className="w-[20.65rem] space-y-1">
                        <h3 className="flex items-center gap-2 text-yellow-550">
                            <WarningIcon1 className="h-6 w-6" />
                            <span className="text-xl font-semibold">{t("pma.modalWarningTitle")}</span>
                        </h3>
                        <h4 className="text-sm font-semibold text-yellow-650">{`${t("pma.modalWarningTitle1")} ${numOfRooms}  ${t("pma.modalWarningTitle2")}`}</h4>
                        <p className="text-xs font-normal text-gray-400/80 ">{isForceNotLogOut ? t("pma.forceText") : t("pma.warningText")}</p>
                    </div>
                    <div className="my-6 flex justify-end gap-1">
                        <button onClick={closeModal} className="rounded-20 bg-gray-10 px-4 py-2 text-15 font-semibold text-gray-400">
                            {t("pma.btnBack")}
                        </button>
                        <button
                            disabled={isForceNotLogOut}
                            onClick={handleLogOut}
                            className="w-32 rounded-20 bg-primary-200 px-4 py-2 text-15 font-semibold text-white disabled:cursor-not-allowed disabled:bg-primary-25"
                        >
                            {loading ? <ClipLoader size={"0.75rem"} color="#fff" /> : t("pma.Desconectar")}
                        </button>
                    </div>
                </div>
            </footer>
            <div className="h-4 bg-yellow-75"></div>
        </ModalHeadless>
    );
};
export default UnattandedCasesWarning;
