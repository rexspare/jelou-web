import { useTranslation } from "react-i18next";

import { Modal } from "./Index";
import { countInvalidElements } from "../CreateData/BulkDataLoad/bulkDataHooks";

export const ImportDataWarning = ({ showModal, closeModal, uploadDataToDb, selectedFileCol }) => {
    const { t } = useTranslation();
    const unmatchedColumns = countInvalidElements(selectedFileCol);
    const isAllDatabaseColumnsMatched = unmatchedColumns > 0 ? false : true;

    return (
        <Modal closeModal={closeModal} isShow={showModal} widthModal="w-[30rem]">
            <section className="relative inline-block w-[30rem] transform overflow-hidden rounded-20 bg-white p-8 shadow-xl transition-all">  
                <h2 className="mb-4 text-left text-xl font-bold text-gray-400">{t("datum.confirmText")}</h2>
                {!isAllDatabaseColumnsMatched && 
                    <p className="mt-2 text-justify text-lg text-gray-400">
                        {unmatchedColumns === 1 
                        ? t("datum.error.missingFields_one")
                        : t("datum.error.missingFields", { count: unmatchedColumns })
                    }</p>
                }
                <footer className="mt-12 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                closeModal(true);
                            }}
                            className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400">
                            {t("datum.cancel")}
                        </button>
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                uploadDataToDb();
                                closeModal(true);
                            }}
                            className="h-9 button-gradient flex items-center font-bold justify-center">
                            {t("datum.confirm")}
                        </button>
                </footer>  
            </section>
        </Modal>
    );
}
