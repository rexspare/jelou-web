/* eslint-disable @nx/enforce-module-boundaries */
import { GenericModal } from "@apps/shared/common";
import { ConnectionDotIcon } from "@apps/shared/icons";
import React from "react";
import { BeatLoader } from "react-spinners";

const TakeQueueDisconnectedModal = (props) => {
    const { setShowDisconnectedModal, showDisconnectedModal, handleConnectOperator, loadingConnection, t } = props;

    const modalIcon = <ConnectionDotIcon className="h-3 w-3 text-[#952F23]" />;

    return (
        <GenericModal
            icon={modalIcon}
            width="20rem"
            theme={"alert"}
            onClose={() => setShowDisconnectedModal(false)}
            showModal={showDisconnectedModal}
            closeModal={() => setShowDisconnectedModal(false)}
            title={t("pma.Estás desconectado")}
        >
            <div className="flex w-full flex-col items-center space-y-3 rounded-b-xl bg-white py-8 px-6">
                <img src={"assets/illustrations/operatorDisconnected.svg"} alt="Disconnected" className=" w-[80%]" />
                <p className="pt-2 text-sm text-gray-400">{t("pma.¡Aparentemente estás desconectado!")}</p>
                <p className="!mb-3 text-sm text-gray-400">{t("pma.Recuerda que no puedes tomar un caso sin cambiar tu estado de conexión")}</p>
                <div className="flex w-full flex-col space-y-2">
                    <button
                        onClick={() => {
                            handleConnectOperator();
                        }}
                        className="flex w-full items-center justify-center rounded-xl bg-secondary-425 px-4 py-2 text-sm text-white"
                    >
                        {loadingConnection ? <BeatLoader color={"white"} size={"0.625rem"} /> : t("pma.Cambiar estado a disponible")}
                    </button>
                    <button onClick={() => setShowDisconnectedModal(false)} className="w-full rounded-xl bg-[#EFF1F4]  px-4 py-2 text-sm text-gray-400">
                        {t("common.cancel")}
                    </button>
                </div>
            </div>
        </GenericModal>
    );
};

export default TakeQueueDisconnectedModal;
