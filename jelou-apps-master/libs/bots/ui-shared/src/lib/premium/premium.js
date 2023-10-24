import { JelouLogoIcon, CloseIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const ModalCommingSoon = (props) => {
    const { t } = useTranslation();
    const { setOpen } = props;

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="w-full max-w-md transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all">
                <div className="mb-3 flex items-center justify-between border-b-1 border-gray-35 pb-4 sm:mb-6">
                    <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.5rem" />
                        </div>
                        <div className="max-w-md text-xl font-medium text-black">{t("modalPremium.premiumFunction")}</div>
                    </div>
                    <span onClick={onClose}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-450" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative">
                    <div>
                        <div className="mx-auto w-full pb-6">
                            <div>
                                <div className="mb-4">
                                    <div className="px-3 text-lg text-gray-400 text-opacity-75">
                                        {t("modalPremium.activateFunctionality")}
                                        <a href="mailto:ventas@jelou.ai" className=" mx-1 inline text-primary-200 underline">
                                            ventas@jelou.ai
                                        </a>
                                        {t("modalPremium.throughWebsite")}
                                    </div>
                                </div>

                                <div className="mt-8 flex w-full flex-col md:flex-row">
                                    <div className="mt-6 flex w-full justify-end text-center md:mt-0">
                                        <a rel="noreferrer" target="_blank" href={"https://jelou.ai/contactanos"} className="button-primary w-40">
                                            {t("modalPremium.contact")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCommingSoon;
