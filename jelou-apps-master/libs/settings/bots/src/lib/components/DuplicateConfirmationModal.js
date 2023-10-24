import { setOperatorSelected } from "@apps/redux/store";
import { CloseIcon, JelouLogoIcon, WarningIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const DuplicateConfirmationModal = (props) => {
    const { actualBot, botToDuplicate, openDuplicateConfirmation, setOpenDuplicateConfirmation } = props;
    const { t } = useTranslation();

    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-black bg-opacity-25" />
            </div>
            <div className="min-w-125 transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all">
                <div className="mb-3 flex items-center justify-end">
                    {/* <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex items-center justify-center rounded-full md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.5rem" />
                        </div>
                        <div className="max-w-md text-xl font-bold text-gray-400">{t("¿Desea replicar esta configuracion?")}</div>
                    </div> */}
                    <span
                        onClick={() => {
                            setOpenDuplicateConfirmation(false);
                        }}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-400 hover:text-gray-400" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative">
                    <div>
                        <div className="mx-auto w-full max-w-[28rem] px-5 pb-5">
                            <div className="flex items-start text-lg text-gray-400 text-opacity-75">
                                <div className="mr-2">
                                    <WarningIcon width="1.5rem" height="1.5rem" className=" fill-current text-red-1000" />
                                </div>
                                <div>
                                    <p className="font-bold text-red-1000">{t("Recuerda")}</p>
                                    <p>
                                        {t("Si duplicas la configuracion de ")} {<span className="font-bold text-gray-400">{actualBot.name}</span>} en{" "}
                                        {<span className="font-bold text-gray-400">{botToDuplicate.name}</span>},{" "}
                                        {<span className="text-orange-50 text-opacity-80">{t("perdera su configuracion previa")} </span>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col justify-center pt-5 md:flex-row">
                            <div className="mt-6 mr-3 flex text-center md:mt-0">
                                <button
                                    type="submit"
                                    className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                    onClick={() => setOpenDuplicateConfirmation(false)}>
                                    {t("botsComponentDelete.cancel")}
                                </button>
                            </div>
                            <div className="mt-6 flex text-center md:mt-0">
                                <button type="submit" className="button-primary w-32" onClick={() => openDuplicateConfirmation(true)}>
                                    {/* {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsComponentDelete.delete2")}`} */}
                                    {`${t("botsComponentDelete.delete2")}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuplicateConfirmationModal;
