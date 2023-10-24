import { useTranslation } from "react-i18next";

import { ModalHeadless } from "@apps/shared/common";
import { useCategories } from "./hook/categories";

export function DeleteCategoriesModal({ isShow, onClose, categoryData, setCategoryList }) {
    const { t } = useTranslation();
    const { deleteCategory, loading } = useCategories({ setCategoryList, onClose });

    async function handleDeleteCategoryClick(evt) {
        evt.preventDefault();

        const { id: category_id } = categoryData;
        deleteCategory({ category_id });
    }

    return (
        <ModalHeadless
            textButtonSecondary={t("buttons.cancel")}
            textButtonPrimary={t("buttons.delete")}
            handleClickPrimaryButton={handleDeleteCategoryClick}
            loading={loading}
            showButtons={true}
            className="relative inline-block h-72 w-[35rem] max-w-xl transform overflow-hidden rounded-20 bg-white pl-8 text-left align-middle font-semibold text-gray-400 shadow-xl transition-all"
            titleModal=""
            closeModal={onClose}
            isShowModal={isShow}
        >
            <section className="mb-4 pr-8">
                <p className="mb-2 text-xl font-normal text-primary-200">
                    {t("shop.modal.deleteProductTitle1_1")}
                    <span className="font-bold"> "{categoryData?.name}" </span>
                    {t("shop.modal.fromCategories")}
                </p>
                <p className="mb-4">{t("shop.modal.deleteCategoriesWarning")}</p>
                <p className="text-base font-bold text-gray-400">¿Deseas hacerlo?</p>
            </section>
        </ModalHeadless>
    );
}
