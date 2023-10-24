import { CloseIcon2 } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

import { Modal } from "./Index";
import { RENDER_SEE_COLUMN } from "../../../constants";
import { useRenderFileIcon } from "@apps/shared/common";

export default function SeeData({ oneDataBase, rowSeletec, isShow, closeModal } = {}) {
    const { renderImg } = useRenderFileIcon();
    const { t } = useTranslation();
    return (
        <Modal closeModal={closeModal} isShow={isShow} widthModal="w-full max-w-md">
            <section className="relative inline-block w-full max-w-md p-8 overflow-hidden font-semibold text-left text-gray-400 align-middle transition-all transform bg-white shadow-xl max-h-xl rounded-20">
                <div className="flex items-center justify-between">
                    <h3 className="text-base">{t("datum.viewRegistry")}</h3>
                    <button
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <p className="w-full my-5 border-gray-300 border-t-1 border-opacity-65"></p>
                <div className="space-y-4 overflow-y-scroll max-h-lg">
                    {oneDataBase &&
                        oneDataBase.columns.length > 0 &&
                        oneDataBase.columns.map((column) => {
                            const { name, key, id, type } = column;
                            const render = RENDER_SEE_COLUMN[type] ?? null;

                            return render ? (
                                render(key, id, name, rowSeletec, renderImg)
                            ) : (
                                <p key={key + id}>
                                    {name}: <span className="font-normal">{rowSeletec[key] ?? "-"}</span>
                                </p>
                            );
                        })}
                </div>
            </section>
        </Modal>
    );
}
