import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { setDatabases } from "@apps/redux/store";
import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { CloseIcon2, LoadingSpinner } from "@apps/shared/icons";

import { useDataBases } from "../../../services/databases";
import { Modal } from "./Index";

export default function DeleteDatabaseModal({ closeModal, isShow, databaseId, databaseName }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const databases = useSelector((state) => state.databases);
  const dispatch = useDispatch();

  const { deleteDatabase } = useDataBases();
  const handleDeleteDataClick = useCallback(
    async (evt) => {
      evt.preventDefault();
      setLoading(true);

      deleteDatabase({ databaseId })
        .then((response) => {
          const { data, message } = response;
          dispatch(setDatabases(databases.filter((database) => database.id !== data.id)));
          renderMessage("datum.register.DeleteRow", MESSAGE_TYPES.SUCCESS);
        })
        .catch((messageError) => {
          renderMessage(t("datum.register.ErrorRow"), MESSAGE_TYPES.ERROR);
        })
        .finally(() => {
          setLoading(false);
          closeModal();
        });
    },
    [databaseId]
  );

  return (
    <Modal closeModal={closeModal} isShow={isShow} widthModal="w-82">
      <section className="relative inline-block w-82 transform overflow-hidden rounded-20 bg-white pb-8 shadow-xl transition-all">
        <div className="m-3 flex items-start justify-end">
          <button
            aria-label="Close"
            onClick={(evt) => {
              evt.preventDefault();
              closeModal();
            }}>
            <CloseIcon2 />
          </button>
        </div>
        <div className="px-8">
          <h2 className="mb-2 text-left text-xl font-normal text-primary-200">
            {t("shop.modal.deleteProductTitle1_1")}
            <span className="font-bold"> {databaseName} </span>
            {t("datum.deleteDatabaseModaltitle2")}
          </h2>
          <p className="mb-4 text-left text-gray-400">{t("datum.deleteDatabaseModaltitle3")}</p>
          <p className="text-left text-base font-semibold text-gray-400">{t("shop.modal.deleteImgTitle2")}</p>

          <footer className="mt-4">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={(evt) => {
                  evt.preventDefault();
                  closeModal();
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
