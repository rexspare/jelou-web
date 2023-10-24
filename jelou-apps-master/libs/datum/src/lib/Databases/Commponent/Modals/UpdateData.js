import { useCallback, useContext, useReducer, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon2, LoadingSpinner } from "@apps/shared/icons";
import { Modal } from "./Index";
import { renderMessage } from "@apps/shared/common";
import { RowsTableData } from "../../Table";
import { INITIAL_STATE, reducer } from "../CreateData/Hooks/inputChage";
import { useRowData } from "../../services/rowData";
import InputList from "../CreateData/inputsList/inputs";
import { ACTION_MODALS } from "../../../constants";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export default function UpdateModal({ closeModal, isShow, oneDataBase, rowSeletec }) {
    const [loading, setLoading] = useState(false);
    const [disableButtonCreateData, setDisableButtonCreateData] = useState(false);

    const [data, dispatch] = useReducer(reducer, INITIAL_STATE);

    const { setRowOfTable } = useContext(RowsTableData);
    const { updateData } = useRowData();
    const { t } = useTranslation();

    const handleUpdateData = useCallback(
        (evt) => {
            evt.preventDefault();
            setLoading(true);

            updateData({ databaseId: oneDataBase.id, data, rowId: rowSeletec._id })
                .then(({ row: rowResponse }) => {
                    setRowOfTable((preState) => preState.map((row) => row._id === rowResponse._id ? rowResponse : row));
                    renderMessage(t("datum.register.UpdateRow"), MESSAGE_TYPES.SUCCESS);
                    setLoading(false);
                    closeModal();
                })
                .catch((error) => {
                    renderMessage(String(t("datum.register.ErrorRow")), MESSAGE_TYPES.ERROR);

                    setLoading(false);
                    closeModal();
                });
        },
        [oneDataBase, data, rowSeletec]
    );

    const escFunctionClose = useCallback((event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunctionClose, false);

        return () => {
            document.removeEventListener("keydown", escFunctionClose, false);
        };
    }, [escFunctionClose]);

    return (
        <Modal closeModal={() => null} isShow={isShow} widthModal="w-[30rem]">
            <section className="relative inline-block h-users w-full max-w-md transform overflow-hidden rounded-20 bg-white pt-8 text-left align-middle font-semibold text-gray-400 text-opacity-75 shadow-xl transition-all">
                <div className="flex items-start justify-end pr-8">
                    <button
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <h3 className="mb-5 ml-8 text-base">{t("datum.updateData")}</h3>
                <form onSubmit={handleUpdateData} className="text-15">
                    <div className="h-80 overflow-y-scroll pl-8 pr-8 text-sm">
                        <InputList
                            actionModal={ACTION_MODALS.UPDATE}
                            dataRows={rowSeletec}
                            dispatch={dispatch}
                            oneDataBase={oneDataBase}
                            setDisableButtonCreateData={setDisableButtonCreateData}
                        />
                    </div>
                    <footer className="mt-3 flex h-14 items-center justify-end gap-4 bg-white pr-8">
                        <button
                            type="button"
                            onClick={(evt) => {
                                evt.preventDefault();
                                closeModal();
                            }}
                            className="h-9 rounded-3xl border-transparent bg-gray-10 px-5 text-base font-bold text-gray-400 outline-none">
                            {t("botsCreate.cancel")}
                        </button>
                        <button
                            disabled={disableButtonCreateData || loading}
                            type="submit"
                            className="button-gradient h-9 disabled:cursor-not-allowed disabled:bg-opacity-60">
                            {loading ? (
                                <div className="flex justify-center">
                                    <LoadingSpinner color="#fff" />
                                </div>
                            ) : (
                                t("buttons.save")
                            )}
                        </button>
                    </footer>
                </form>
            </section>
        </Modal>
    );
}
