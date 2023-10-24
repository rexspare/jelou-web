import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { descuentoOptions, INPUTS_NAMES, INPUTS_TYPES, KEY_CATEGOIES_IS_UPDATE, STEPS_IDS, stockTypes, VALUE_EMPTY_DISCOUNT } from "../../../../constants";
import { CATEGORIES_OPTIONS_KEY } from "../../../filter/initFilters";
import { HeaderPanel } from "../HeaderPanel";
import { InputNumber } from "../PricesData/InputNumber";
import { FooterBtns } from "./FooterBtns";
import { InputCheckbox } from "./InputCheckbox";
import { InputSelector } from "./InputSelector";
import { InputText } from "./InputText";
import { validatePrincipalData } from "./validator.principalData";

const LIMITED_STOCK = "limited";

const initialShowDiscountInput = (discountType) => Boolean(discountType) && discountType !== VALUE_EMPTY_DISCOUNT;
const initShowStockInput = (stockType) => Boolean(stockType) && stockType === LIMITED_STOCK;

export const PrincipalDataForm = ({ closeModal, goToNextPanel, handleAddProductData, product, isUpdate, actionProduct, loading }) => {
    const [inputError, setInputError] = useState({});

    const [showDisountInput, setShowDisountInput] = useState(initialShowDiscountInput(product[INPUTS_NAMES.DISCOUNT_TYPE]));
    const [showStockInput, setShowStockInput] = useState(initShowStockInput(product[INPUTS_NAMES.STOCK_TYPE]));

    const { t } = useTranslation();

    const queryClient = useQueryClient();
    const categories = queryClient.getQueryData([CATEGORIES_OPTIONS_KEY]) || [];
    const categoriesOptions = categories.map((category) => ({ value: category.id, label: category.name }));

    const PrincipalDataInputs = [
        {
            name: INPUTS_NAMES.NAME,
            label: t("shop.table.name"),
            type: INPUTS_TYPES.TEXT,
            placeholder: t("shop.modal.productPlaceholderName"),
            showInput: true,
        },
        {
            name: INPUTS_NAMES.SKU,
            label: t("shop.table.sku"),
            type: INPUTS_TYPES.TEXT,
            placeholder: t("shop.modal.productPlaceholderSKU"),
            showInput: true,
        },
        {
            name: INPUTS_NAMES.PRICE,
            label: t("shop.table.price"),
            type: INPUTS_TYPES.NUMBER,
            placeholder: t("shop.modal.productPlaceholderPrice"),
            showInput: true,
        },
        {
            name: INPUTS_NAMES.DESCRIPTION,
            label: t("shop.table.description"),
            type: INPUTS_TYPES.TEXT,
            placeholder: t("shop.modal.productPlaceholderDescription"),
            showInput: true,
        },
        {
            name: INPUTS_NAMES.CATEGORIES,
            label: t("shop.table.category"),
            type: INPUTS_TYPES.SELECT,
            placeholder: t("shop.modal.productPlaceholderSelectCategory"),
            options: categoriesOptions,
            showInput: true,
        },
        {
            name: INPUTS_NAMES.DISCOUNT_TYPE,
            label: t("shop.modal.discountType"),
            type: INPUTS_TYPES.SELECT,
            placeholder: t("shop.modal.placeHolderdiscount"),
            options: descuentoOptions,
            showInput: true,
        },
        {
            name: INPUTS_NAMES.DISCOUNT,
            label: t("shop.modal.discount"),
            type: INPUTS_TYPES.NUMBER,
            placeholder: t("shop.modal.productPlaceholderSelectDiscount"),
            showInput: showDisountInput,
        },
        {
            name: INPUTS_NAMES.STOCK_TYPE,
            label: t("shop.typeStok"),
            type: INPUTS_TYPES.SELECT,
            placeholder: t("shop.placeHoldertypeStok"),
            options: stockTypes,
        },
        {
            name: INPUTS_NAMES.STOCK,
            label: t("shop.quantityStok"),
            type: INPUTS_TYPES.NUMBER,
            placeholder: t("shop.quantityStok"),
            showInput: showStockInput,
        },
        {
            name: INPUTS_NAMES.HAS_TAX,
            label: t("shop.table.hasTax"),
            type: INPUTS_TYPES.CHECKBOX,
            showInput: true,
        },
    ];

    const saveDataAndGoToNextPanel = (newProduct) => {
        handleAddProductData(newProduct);
        goToNextPanel(STEPS_IDS.PRINCIPAL_DATA, STEPS_IDS.IMAGES);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const newProduct = {
            ...data,
            [INPUTS_NAMES.CATEGORIES]: formData.getAll(INPUTS_NAMES.CATEGORIES),
            [INPUTS_NAMES.HAS_TAX]: formData.get(INPUTS_NAMES.HAS_TAX) ? 1 : 0,
        };

        const error = validatePrincipalData(newProduct);
        if (error) return setInputError(error);

        setInputError({});

        const action = isUpdate ? actionProduct : saveDataAndGoToNextPanel;
        action(newProduct);
    };

    const onChangeDiscountType = (data) => {
        setShowDisountInput(data.value !== VALUE_EMPTY_DISCOUNT);
    };

    const onChangeStockInput = (data) => {
        setShowStockInput(data.value === LIMITED_STOCK);
    };

    const labelBtnPrincipal = isUpdate ? t("buttons.save") : t("buttons.next");

    return (
        <>
            <HeaderPanel closeModal={closeModal} title={t("shop.principalData.title")} />

            <form onSubmit={handleSubmit}>
                <div className="grid h-[29.75rem] gap-4 overflow-y-scroll pr-2 text-base">
                    {PrincipalDataInputs.map((item) => {
                        const { label, name, placeholder, type, options, showInput } = item;
                        const hasError = inputError[name];
                        const defaultValue = product[name];

                        const selectorPorps = {
                            ...(name === INPUTS_NAMES.DISCOUNT_TYPE && { onChange: onChangeDiscountType }),
                            ...(name === INPUTS_NAMES.STOCK_TYPE && { onChange: onChangeStockInput }),
                        };

                        if (showInput === false) return null;

                        switch (type) {
                            case INPUTS_TYPES.TEXT: {
                                return <InputText defaultValue={defaultValue} hasError={hasError} label={label} name={name} placeholder={placeholder} key={name} />;
                            }

                            case INPUTS_TYPES.SELECT: {
                                let parseDefaultValues = null;

                                if (isUpdate && name === INPUTS_NAMES.CATEGORIES) {
                                    const categories = product[KEY_CATEGOIES_IS_UPDATE];
                                    parseDefaultValues = categories.map((category) => String(category.id));
                                }

                                if (isUpdate && defaultValue === null && name === INPUTS_NAMES.DISCOUNT_TYPE) {
                                    parseDefaultValues = VALUE_EMPTY_DISCOUNT;
                                }

                                return (
                                    <InputSelector
                                        key={name}
                                        name={name}
                                        label={label}
                                        options={options}
                                        {...selectorPorps}
                                        hasError={hasError}
                                        placeholder={placeholder}
                                        value={parseDefaultValues ?? defaultValue}
                                        multiSelect={name === INPUTS_NAMES.CATEGORIES}
                                    />
                                );
                            }

                            case INPUTS_TYPES.CHECKBOX: {
                                return <InputCheckbox defaultValue={defaultValue} hasError={hasError} label={label} name={name} key={name} />;
                            }

                            case INPUTS_TYPES.NUMBER: {
                                return <InputNumber key={name} name={name} label={label} hasError={hasError} value={defaultValue} placeholder={placeholder} />;
                            }

                            default:
                                return null;
                        }
                    })}
                </div>

                <FooterBtns closeModal={closeModal} loading={loading} labelBtnPrincipal={labelBtnPrincipal} labelBtnSecondary={t("buttons.close")} />
            </form>
        </>
    );
};
