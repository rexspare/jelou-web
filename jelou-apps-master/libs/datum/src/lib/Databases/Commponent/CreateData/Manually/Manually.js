import { memo, useCallback, useContext, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon2, LoadingSpinner } from "@apps/shared/icons";
import { INITIAL_STATE, reducer } from "../Hooks/inputChage";
import { Modal } from "../../Modals/Index";
import { renderMessage } from "@apps/shared/common";
import { RowsTableData } from "../../../Table";
import { useRowData } from "../../../services/rowData";
import InputList from "../inputsList/inputs";
import { MESSAGE_TYPES } from "@apps/shared/constants";

function CreateDataManually({ isShow, closeModal, oneDataBase }) {
    const [data, dispatch] = useReducer(reducer, INITIAL_STATE);

    const [loading, setLoading] = useState(false);
    const { setRowOfTable } = useContext(RowsTableData);
    const [disableButtonCreateData, setDisableButtonCreateData] = useState(false);

    const { createData } = useRowData();
    const { t } = useTranslation();

    const changeData = useCallback((data) => dispatch(data), []);

    const handleCreateData = useCallback(
        (evt) => {
            evt.preventDefault();
            setLoading(true);

            createData({ databaseId: oneDataBase.id, data })
                .then(({ row, message }) => {
                    setRowOfTable((preState) => [row, ...preState]);
                    renderMessage(message, MESSAGE_TYPES.SUCCESS);
                    setLoading(false);
                    closeModal();
                })
                .catch((error) => {
                    renderMessage(String(error), MESSAGE_TYPES.ERROR);
                    setLoading(false);
                    closeModal();
                });
        },
        [oneDataBase, data]
    );

    return (
        <Modal closeModal={() => null} isShow={isShow} widthModal="w-[30rem]">
            <section className="relative inline-block h-users w-full max-w-md transform overflow-hidden rounded-20 bg-white pt-4 text-left align-middle font-semibold text-gray-400 text-opacity-75 shadow-xl transition-all">
                <div className="flex items-start justify-end pr-4">
                    <button
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <h3 className="mb-5 ml-8 text-base">{t("datum.createData")}</h3>
                <form onSubmit={handleCreateData} className="text-15">
                    <div className="h-80 overflow-y-scroll pl-8 pr-8 text-sm">
                        <InputList dispatch={changeData} oneDataBase={oneDataBase} setDisableButtonCreateData={setDisableButtonCreateData} />
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
                            disabled={disableButtonCreateData}
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
export default memo(CreateDataManually);
