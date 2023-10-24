import { useRef } from "react";
import { CloseIcon, JelouLogoIcon } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import { BeatLoader } from "react-spinners";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useTranslation } from "react-i18next";
// import "../../../i18n";

const renderErrors = (errors, t) => {
    return <span className="text-xs font-normal text-red-675">{errors}</span>;
};

const DeleteBot = (props) => {
    const { bot, onConfirm, onClose, loading, errors } = props;
    const ref = useRef();
    const { t } = useTranslation();

    useOnClickOutside(ref, () => onClose());

    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="min-w-125 transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all" ref={ref}>
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex items-center justify-center rounded-full md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.5rem" />
                        </div>
                        <div className="max-w-md text-xl font-bold text-gray-400">
                            {t("botsComponentDelete.delete")} {bot.name}
                        </div>
                    </div>
                    <span onClick={onClose}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-400 hover:text-gray-400" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative">
                    <div>
                        <div className="mx-auto w-full max-w-sm px-5 pb-5">
                            <div className="mt-2">
                                <div className="mb-4">
                                    <div className="text-center text-lg text-gray-400 text-opacity-75">{t("botsComponentDelete.verifyDelete")}</div>
                                </div>
                                {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors)}</div>}

                                <div className="flex w-full flex-col justify-center pt-5 md:flex-row">
                                    <div className="mt-6 mr-3 flex text-center md:mt-0">
                                        <button
                                            type="submit"
                                            className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                            onClick={onClose}>
                                            {t("botsComponentDelete.cancel")}
                                        </button>
                                    </div>
                                    <div className="mt-6 flex text-center md:mt-0">
                                        <button type="submit" className="button-primary w-32" disabled={loading} onClick={onConfirm}>
                                            {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsComponentDelete.delete2")}`}
                                        </button>
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

export default DeleteBot;
