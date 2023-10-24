import dayjs from "dayjs";
import { INPUTS_NAMES, KEY_CATEGOIES_IS_UPDATE, VALUE_EMPTY_DISCOUNT } from "../../../constants";

export function prepareDataToFormData(product) {
    const formData = new FormData();

    const imagesList = product[INPUTS_NAMES.IMAGES] ?? [];
    imagesList.forEach((img) => formData.append(INPUTS_NAMES.IMAGES, img));

    const categories = product[INPUTS_NAMES.CATEGORIES];
    categories.forEach((category) => formData.append(INPUTS_NAMES.CATEGORIES, category));

    const { [INPUTS_NAMES.IMAGES]: _, [INPUTS_NAMES.CATEGORIES]: __, ...rest } = product;
    Object.entries(rest).forEach(([key, value]) => formData.append(key, value));

    const discount_type = formData.get(INPUTS_NAMES.DISCOUNT_TYPE);
    if (discount_type === VALUE_EMPTY_DISCOUNT) {
        formData.delete(INPUTS_NAMES.DISCOUNT);
        formData.delete(INPUTS_NAMES.DISCOUNT_TYPE);
    }

    return { formData };
}

export function prepareDataToFormDataUpdate(product) {
    const formData = new FormData();

    const imagesList = product[INPUTS_NAMES.IMAGES] ?? [];
    imagesList.forEach((img) => {
        if (!img.id) formData.append(INPUTS_NAMES.IMAGES, img);
    });

    const categories = product[INPUTS_NAMES.CATEGORIES] ?? product[KEY_CATEGOIES_IS_UPDATE].map((category) => category.id);
    categories.forEach((category) => formData.append(INPUTS_NAMES.CATEGORIES, category));

    const { [INPUTS_NAMES.IMAGES]: _, [INPUTS_NAMES.CATEGORIES]: __, ...rest } = product;
    Object.values(INPUTS_NAMES).forEach((key) => {
        if (key !== INPUTS_NAMES.IMAGES && key !== INPUTS_NAMES.CATEGORIES) {
            formData.append(key, rest[key]);
        }
    });

    if (typeof product[INPUTS_NAMES.HAS_TAX] === "boolean") {
        formData.set(INPUTS_NAMES.HAS_TAX, product[INPUTS_NAMES.HAS_TAX] ? 1 : 0);
    }

    const discount_type = formData.get(INPUTS_NAMES.DISCOUNT_TYPE);
    if (discount_type === VALUE_EMPTY_DISCOUNT || discount_type === "null") {
        formData.delete(INPUTS_NAMES.DISCOUNT);
        formData.delete(INPUTS_NAMES.DISCOUNT_TYPE);
    }

    const availableAt = formData.get(INPUTS_NAMES.AVAILABLE_AT);
    const expiresAt = formData.get(INPUTS_NAMES.EXPIRES_AT);
    if (availableAt === "null" && expiresAt === "null") {
        formData.delete(INPUTS_NAMES.AVAILABLE_AT);
        formData.delete(INPUTS_NAMES.EXPIRES_AT);
    }

    if (availableAt !== "null" && expiresAt !== "null") {
        formData.set(INPUTS_NAMES.AVAILABLE_AT, dayjs(availableAt).format("YYYY-MM-DD HH:mm:ss"));
        formData.set(INPUTS_NAMES.EXPIRES_AT, dayjs(expiresAt).format("YYYY-MM-DD HH:mm:ss"));
    }

    return { formData };
}
