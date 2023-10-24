import { RecoverChatIcon } from "@apps/shared/icons";
import { BeatLoader } from "react-spinners";
import { useTranslation, withTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import FormModal from "../form-modal/form-modal";

const RecoverRoom = (props) => {
    const { closeRecoverModal, names, recoverRoom, recovering, errors, setShowUniqueModal, sendHsm, inManualState } = props;
    const { t } = useTranslation();

    let name = get(props, "names", t("pma.este usuario"));
    if (isEmpty(name)) {
        name = get(props, "name", t("pma.este usuario")).split("-")[0];
    }

    return (
        <FormModal title={`${t(`Contactar a`)} ${names}`} onClose={closeRecoverModal} canOverflow maxWidth={"md:min-w-lg md:max-w-2xl"}>
            <div className="xs:pb-2 flex flex-col">
                <RecoverChatIcon className="mx-auto -mt-6 hidden xxl:block" width="13.063rem" height="11.875rem" fill="none" />
                <RecoverChatIcon className="mx-auto xxl:hidden" width="13.063rem" height="8.75rem" fill="none" />

                <div className="flex flex-col space-y-3">
                    {!inManualState ? (
                        <>
                            <div className="mt-3 md:mx-10">
                                <div className="text-center font-light text-gray-450">{t("pma.Está a punto de contactar a este cliente")}</div>
                            </div>
                            <div className="text-center font-bold text-gray-400">{t("pma.¿Te gustaría continuar?")}</div>
                            <div className="md:mx-10">
                                <div className="text-center font-light text-red-675">
                                    {errors && sendHsm
                                        ? t("pma.El cliente se encuentra fuera de sesión, puedes enviarle un hsm para contactarlo")
                                        : errors}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mt-3 md:mx-10">
                            <div className="text-center text-red-675">{errors}</div>
                            {inManualState && <div className="text-center font-bold text-gray-400">{t("pma.¿Quieres volverlo a intentar?")}</div>}
                        </div>
                    )}
                </div>

                <div className="bg-modal-footer mt-3 flex w-full items-center justify-center rounded-b-lg pt-3 md:justify-end xxl:pt-8">
                    <button
                        className="mr-4 flex w-32 justify-center rounded-3xl border-transparent bg-gray-10 py-3 px-5 font-bold text-gray-400 focus:outline-none"
                        onClick={closeRecoverModal}>
                        {t("pma.No")}
                    </button>
                    {recovering ? (
                        <button className="hover:bg-primary-hover flex w-32 justify-center rounded-3xl border-transparent bg-primary-200 py-3 px-5 font-bold text-white focus:outline-none">
                            <BeatLoader size={"0.625rem"} color="#ffff" />
                        </button>
                    ) : (
                        <button
                            className="hover:bg-primary-hover flex min-w-[8rem] justify-center rounded-3xl border-transparent bg-primary-200 py-3 px-5 font-bold text-white focus:outline-none"
                            onClick={
                                errors && sendHsm
                                    ? () => {
                                          closeRecoverModal();
                                          setShowUniqueModal(true);
                                      }
                                    : () => recoverRoom()
                            }>
                            {errors && sendHsm ? t("pma.Si, enviar HSM") : inManualState ? t("pma.Si, contactar") : t("pma.Si")}
                        </button>
                    )}
                </div>
            </div>
        </FormModal>
    );
};
export default RecoverRoom;
