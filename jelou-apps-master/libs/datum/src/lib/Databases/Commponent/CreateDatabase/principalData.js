import { CloseIcon2, ErrorIcon } from "@apps/shared/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modals/Index";

const INPUTS_KEY = {
    name: "nameDatabase",
    description: "descriptionDatabase",
};

const PrincipalData = ({ closeModal = () => null, isShow = false, hanldeSaveData = () => null } = {}) => {
    const { t } = useTranslation();
    const [nameDatabase, setNameDatabase] = useState("");
    const [descriptionDatabase, setDescriptionDatabase] = useState("");
    const [error, setError] = useState({});

    const handleNextStep = (evt) => {
        evt.preventDefault();
        if (nameDatabase.length <= 3) {
            setError({ [INPUTS_KEY.name]: t("datum.error.nameMustHave4Charact") });
            return;
        }

        if (descriptionDatabase.length <= 3) {
            setError({ [INPUTS_KEY.description]: t("datum.error.descripMustHave4Charact") });
            return;
        }

        hanldeSaveData({ nameDatabase, descriptionDatabase });
    };

    return (
        <Modal closeModal={() => null} isShow={isShow} widthModal="w-82">
            <section className="relative inline-block h-full w-82 transform overflow-hidden rounded-20 bg-white text-left align-middle font-extrabold text-gray-400 shadow-xl transition-all">
                <div className="flex h-8 items-end justify-end">
                    <button
                        aria-label="Close"
                        className="w-12"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <header className="border-b-1.5 border-gray-100 border-opacity-25 pb-4">
                    <h2 className="mb-2 text-center text-xl font-semibold text-gray-400">{t("datum.createDBtext1")}</h2>
                    <div className="flex h-16 w-full items-center justify-center gap-16">
                        <div className="relative flex flex-col items-center justify-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 p-1 text-white">1</span>
                            <h4 className="w-44 truncate text-center font-medium text-primary-200">{t("datum.mainData")}</h4>
                            <span className="absolute top-[0.6rem] left-[6rem] -z-10 h-0.5 w-56 bg-[#DCDEE4]"></span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DCDEE4] p-1 text-white">2</span>
                            <h4 className="truncate font-medium text-[#DCDEE4]">{t("datum.configureColumns")}</h4>
                        </div>
                    </div>
                </header>
                <main className="h-64 px-8 py-4">
                    <form onSubmit={(evt) => evt.preventDefault()} className="flex w-full flex-col gap-3 font-bold text-gray-400 text-opacity-75">
                        <label className="pb-2 text-sm">
                            <span className="font-semibold">{t("datum.databaseName")}</span>
                            <input
                                placeholder={t("datum.placeholders.databaseName")}
                                maxLength={50}
                                value={nameDatabase}
                                onChange={(evt) => setNameDatabase(evt.target.value)}
                                className={`mt-1 w-full rounded-10 p-2 pl-3 font-normal placeholder:text-gray-400 placeholder:text-opacity-50 focus-visible:outline-none
                                  ${
                                      error[INPUTS_KEY.name]
                                          ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                                          : "border-none bg-[#F5F9FD] focus:border-transparent"
                                  }
                                `}
                            />
                            {error[INPUTS_KEY.name] && (
                                <div className="flex items-center gap-2 font-medium">
                                    <ErrorIcon /> <span className="text-red-1010">{error[INPUTS_KEY.name]}</span>
                                </div>
                            )}
                        </label>
                        <label className="pb-2 text-sm">
                            <span className="font-semibold">{t("shop.table.description")}</span>
                            <textarea
                                maxLength={100}
                                placeholder={t("datum.placeholders.description")}
                                value={descriptionDatabase}
                                onChange={(evt) => setDescriptionDatabase(evt.target.value)}
                                className={`TextArea mt-1 h-28 w-full resize-none rounded-10 text-sm font-normal placeholder:text-gray-400 placeholder:text-opacity-50 focus:ring-transparent focus-visible:outline-none
                                  ${
                                      error[INPUTS_KEY.description]
                                          ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                                          : "border-none bg-[#F5F9FD] focus:border-transparent"
                                  }
                                `}
                            />
                            {error[INPUTS_KEY.description] && (
                                <div className="flex items-center gap-2 font-medium">
                                    <ErrorIcon /> <span className="text-red-1010">{error[INPUTS_KEY.description]}</span>
                                </div>
                            )}
                        </label>
                    </form>
                </main>
                <footer className="flex justify-end gap-6 border-t-1.5  border-gray-100 border-opacity-25 py-7 pr-6">
                    <button
                        type="button"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}
                        className="button h-9 bg-gray-10 text-gray-400">
                        {t("buttons.cancel")}
                    </button>
                    <button onClick={handleNextStep} className="button h-9 bg-primary-200 text-white">
                        {t("buttons.next")}
                    </button>
                </footer>
            </section>
        </Modal>
    );
};

export default PrincipalData;
