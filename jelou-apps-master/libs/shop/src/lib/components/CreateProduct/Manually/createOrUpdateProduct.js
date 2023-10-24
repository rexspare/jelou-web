/** @typedef {import('./types.createProduct').CreatePrice} CreatePrice */
/** @typedef {import('./types.createProduct').ServerPrice} ServerPrice */
/** @typedef {CreatePrice | ServerPrice} Price */

import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { useState } from "react";

import { renderMessage } from "@apps/shared/common";
import { prepareDataToFormData, prepareDataToFormDataUpdate } from "./helper";
import { createPrice, updatePrice } from "../../../services/prices";
import { createProduct as createProductDB, updateProduct as updateProductDB } from "../../../services/products";
import { attachPriceToApp } from "../../../services/tags";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export function useCreateOrUpdateProduct() {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const company = useSelector((state) => state.company);
    const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);

    /**
     *  Create all prices for a product
     * @param {Price[]} pricesList - The list of prices to be created for this product
     * @param {string} productId - The product id to create the prices for
     */
    const actionAllPricesForProduct = async (pricesList, productId) => {
        for (let i = 0; i < pricesList.length; i++) {
            const price = pricesList[i];
            const { id, isNew = false, isEdit = false, ...restPrice } = price || {};

            if (isNew) {
                await createPrice(productId, restPrice).catch((error) => {
                    renderMessage(
                        "Tuvimos un error al crear uno de los precios para este producto. Puede intentar refrescar la página y editar el producto",
                        MESSAGE_TYPES.ERROR
                    );
                    console.error("Error al crear un precio", { error, price, productId });
                });
                await attachPriceToApp(app_id, price.price_group_tags);
            } else if (isEdit) {
                await updatePrice(productId, restPrice, id).catch((error) => {
                    renderMessage(
                        "Tuvimos un error al actualizar uno de los precios para este producto. Puede intentar refrescar la página y editar el producto",
                        MESSAGE_TYPES.ERROR
                    );
                    console.error("Error al editar un precio", { error, price, productId });
                });
            };
        }
        return Promise.resolve();
    };

    /**
     * @param {object} product - The product to be created.
     * @param {Price[]} pricesList - The list of prices to be created for this product
     */
    const createProduct = async (product, pricesList) => {
        setLoading(true);

        const { formData } = prepareDataToFormData(product);

        const productId = await createProductDB({ formData, app_id })
            .then((productId) => productId)
            .catch(() => {
                setLoading(false);
                renderMessage(t("shop.notifications.createProductError"), MESSAGE_TYPES.ERROR);
            });

        if (isEmpty(productId)) {
            setLoading(false);
            renderMessage(t("shop.notifications.createProductError"), MESSAGE_TYPES.ERROR);
            return;
        }

        await actionAllPricesForProduct(pricesList, productId).finally(() => setLoading(false));
        return productId;
    };

    /**
     * @param {object} product - The product to be created.
     * @param {Price[]} pricesList - The list of prices to be created for this product
     */
    const updateProduct = async (product, pricesList) => {
        setLoading(true);

        /** @type {string | undefined} */
        const productId = product?.id;

        if (isEmpty(productId)) {
            renderMessage(t("shop.notifications.updateProductIdEmpty"), MESSAGE_TYPES.ERROR);
            setLoading(false);
            return;
        }

        const { formData } = prepareDataToFormDataUpdate(product);

        await updateProductDB({ formData, productId, app_id })
            .then((productId) => productId)
            .catch((error) => {
                setLoading(false);
                renderMessage(t("shop.notifications.updateProductError"), MESSAGE_TYPES.ERROR);
                console.error("handleUpdateSubmit ~ updateProduct", { error });
            });

        await actionAllPricesForProduct(pricesList, productId).finally(() => setLoading(false));
        return productId;
    };

    return {
        createProduct,
        updateProduct,
        loading,
    };
}
