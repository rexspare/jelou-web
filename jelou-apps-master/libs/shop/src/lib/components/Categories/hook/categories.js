import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createCategories, deleteCategory as deleteCategoryService } from "../../services/categories";

export function useCategories({ setCategoryList, onClose = () => null } = {}) {
    const company = useSelector((state) => state.company);
    const [loading, setLoading] = useState(false);

    const create = ({ dataForm }) => {
        const { app_id = null } = company?.properties?.shopCredentials?.jelou_ecommerce || {};

        if (!app_id) {
            console.error("hook - useCategories - create - credentials", { app_id });
            renderMessage(
                "Ocurrió un error al obtener las credenciales del ecommerce, por favor intente de nuevo refrescando la página",
                MESSAGE_TYPES.ERROR
            );
            return;
        }

        setLoading(true);

        createCategories({ app_id, dataForm })
            .then((data) => {
                renderMessage("Categoría creada correctamente", MESSAGE_TYPES.SUCCESS);
                setCategoryList((preState) => [data, ...preState]);
            })
            .catch((error) => {
                console.error("hook - useCategories - create - error", { error });
                renderMessage(error, MESSAGE_TYPES.ERROR);
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    const deleteCategory = ({ category_id }) => {
        const { app_id = null } = company?.properties?.shopCredentials?.jelou_ecommerce || {};

        if (!app_id || !category_id) {
            console.error("hook - useCategories - deleteCategory - credentials", { app_id, category_id });
            renderMessage(
                "Ocurrió un error al obtener las credenciales del ecommerce, por favor intente de nuevo refrescando la página",
                MESSAGE_TYPES.ERROR
            );
            return;
        }

        setLoading(true);

        deleteCategoryService({ app_id, category_id })
            .then((data) => {
                renderMessage(data, MESSAGE_TYPES.SUCCESS);
                setCategoryList((preState) => preState.filter((item) => item.id !== category_id));
            })
            .catch((error) => {
                console.error("hook - useCategories - deleteCategory - error", { error });
                renderMessage(error, MESSAGE_TYPES.ERROR);
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    return { create, deleteCategory, loading };
}
