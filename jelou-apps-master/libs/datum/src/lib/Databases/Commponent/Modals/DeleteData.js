import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { CloseIcon2, LoadingSpinner } from "@apps/shared/icons";
import { RowsTableData } from "../../Table";
import { useRowData } from "../../services/rowData";
import { Modal } from "./Index";

export default function DeleteDataModal({ closeModal, isShow, rowToDelete, databaseId } = {}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { setRowOfTable } = useContext(RowsTableData);

  const { deleteData } = useRowData();

  const handleDeleteDataClick = useCallback(async (evt) => {
    evt.preventDefault();
    setLoading(true);

    const { _id } = rowToDelete;
    deleteData({ databaseId, rowId: _id })
      .then(() => {
        setRowOfTable((preState) => {
          const newState = preState.filter((row) => row._id !== _id);
          return newState;
        });
        renderMessage(t("datum.register.DeleteRow"), MESSAGE_TYPES.SUCCESS);
        setLoading(false);
        closeModal();
      })
      .catch(() => {
        renderMessage(String("datum.register.ErrorRow"), MESSAGE_TYPES.ERROR);
        setLoading(false);
        closeModal();
      });
  }, []);

  return (
    <Modal closeModal={closeModal} isShow={isShow} widthModal="w-[30rem]">
      <section className="relative inline-block w-[30rem] transform overflow-hidden rounded-20 bg-white p-8 shadow-xl transition-all">
        <div className="flex items-start justify-end">
          <button
            aria-label="Close"
            onClick={(evt) => {
              evt.preventDefault();
              closeModal();
            }}>
            <CloseIcon2 />
          </button>
        </div>
        <div>
          <h2 className="mb-4 text-left text-xl font-normal text-primary-200">{t("datum.deleteDatabase")}</h2>
          <p className="text-left text-base font-semibold text-gray-400">{t("shop.modal.deleteImgTitle2")}</p>

          <footer className="mt-4">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={(evt) => {
                  evt.preventDefault();
                  closeModal(false);
                }}
                className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400">
                {t("shop.modal.cancel")}
              </button>
              <button type="submit" disabled={loading} onClick={handleDeleteDataClick} className="button-gradient flex items-center justify-center">
                {loading ? <LoadingSpinner color="#fff" /> : <span>{t("shop.modal.remove")}</span>}
              </button>
            </div>
          </footer>
        </div>
      </section>
    </Modal>
  );
}
