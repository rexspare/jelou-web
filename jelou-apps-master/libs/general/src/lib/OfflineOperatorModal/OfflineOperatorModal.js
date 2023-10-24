import { ConnectionDotIcon } from "@apps/shared/icons";
import { useState } from "react";
import get from "lodash/get";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { JelouApiV1 } from "@apps/shared/modules";
import { useDispatch, useSelector } from "react-redux";
import { setStatusOperator, updateUserSession } from "@apps/redux/store";
import { toast } from "react-toastify";
import ModalFrame from "../modal-frame/ModalFrame.js";

const OfflineOperatorModal = (props) => {
    const { showModal, setShowModal } = props;
    const [loadingConnection, setLoadingConnection] = useState(false);
    const { t } = useTranslation();
    const userSession = useSelector((state) => state.userSession);
    const operatorId = get(userSession, "operatorId", null);
    const sessionId = get(userSession, "sessionId", null);
    const modalIcon = <ConnectionDotIcon className="h-3 w-3 text-[#952F23]" />;

    const dispatch = useDispatch();

    const newState = "online";
    // logic for operator connection

    const toastMessage = (message) => {
        toast.error(message, {
            autoClose: true,
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };
    const handleConnectOperator = async () => {
        setLoadingConnection(true);
        // logic for operator connection
        try {
            await JelouApiV1.patch(`/operators/${operatorId}`, {
                status: newState,
                sessionId: sessionId,
            });
            const operatorActive = newState;
            dispatch(updateUserSession({ operatorActive }));
            dispatch(setStatusOperator(newState));
            setLoadingConnection(false);
            setShowModal(false);
        } catch (error) {
            console.log("error setting operator online");
            dispatch(setStatusOperator("offline"));
            toastMessage(t("pma.Error de conexion"));
            setLoadingConnection(false);
        }
    };

    return (
        <ModalFrame
            icon={modalIcon}
            width="20rem"
            theme={"alert"}
            onClose={() => {
                setShowModal(false);
            }}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t("pma.Estás desconectado")}>
            <div className="flex w-full flex-col items-center space-y-3 rounded-b-xl bg-white py-8 px-6">
                <img src={"assets/illustrations/operatorDisconnected.svg"} alt="Disconnected" className=" w-[80%]" />
                <p className="pt-2 text-sm text-gray-400">{t("pma.¡Aparentemente estás desconectado!")}</p>
                <p className="!mb-3 text-sm text-gray-400">
                    {t("pma.Recuerda que no puedes realizar esta acción sin cambiar tu estado de conexión")}
                </p>
                <div className="flex w-full flex-col space-y-2">
                    <button
                        onClick={() => {
                            handleConnectOperator();
                        }}
                        className="flex w-full items-center justify-center rounded-xl bg-secondary-425 px-4 py-2 text-sm text-white">
                        {loadingConnection ? <BeatLoader color={"white"} size={"0.625rem"} /> : t("pma.Cambiar estado a disponible")}
                    </button>
                    <button onClick={() => setShowModal(false)} className="w-full rounded-xl bg-[#EFF1F4]  px-4 py-2 text-sm text-gray-400">
                        {t("common.cancel")}
                    </button>
                </div>
            </div>
        </ModalFrame>
    );
};

export default OfflineOperatorModal;
