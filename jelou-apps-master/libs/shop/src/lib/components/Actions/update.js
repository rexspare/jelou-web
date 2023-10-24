import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { getAllPriceOfOneProduct } from "../../services/prices";
import { getMediaProducts } from "../../services/media";
import { INPUTS_NAMES } from "../../constants";
import { renderMessage } from "@apps/shared/common";
import CreateProductModal from "../CreateProduct/Manually/CreateModal";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const UpdateModal = ({ isShow, closeModal, product, refreshProductList } = {}) => {
    const productId = product?.id ?? "";
    const company = useSelector((state) => state.company);
    const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);

    const {
        data: imgsList = [],
        isError: isErrorImg,
        error: errorImg,
        isLoading: loadingImages,
    } = useQuery([INPUTS_NAMES.IMAGES, productId], () => getMediaProducts({ productId, app_id }), {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        enabled: Boolean(app_id),
    });

    const {
        data: initialPricesList = [],
        isLoading: loadingPrices,
        isError: isErrorPrices,
        error: errorPrices,
    } = useQuery([INPUTS_NAMES.PRICE, productId], () => getAllPriceOfOneProduct(productId), {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
    });

    const productForUpdate = { ...product, [INPUTS_NAMES.IMAGES]: imgsList };

    if (isErrorImg) renderMessage(errorImg, MESSAGE_TYPES.ERROR);
    if (isErrorPrices) renderMessage(errorPrices, MESSAGE_TYPES.ERROR);

    if (loadingImages || loadingPrices) return null;

    return (
        <CreateProductModal
            isUpdate
            isShow={isShow}
            closeModal={closeModal}
            product={productForUpdate}
            pricesListDefault={initialPricesList}
            refreshProductList={refreshProductList}
        />
    );
};

export default UpdateModal;
