import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

import { actionHideModal, actionShowModal } from "../../actions/modalsStates";
import { STRUCTURE_ACTIONS } from "../../hooks/constants.structureCols";
import { PRICE_METADATA } from "../filter/RangeFilter/useRange";
import DetailProduct from "../SeeDetail/product";
import PriceContext from "./PriceContext";

const CreateProductModal = lazy(() => import("../CreateProduct/Manually/CreateModal"));
const DeleteModal = lazy(() => import("./DeleteProduct"));
const ImageCarousel = lazy(() => import("./ImagesCarousel"));
const UpdateModal = lazy(() => import("./update"));

export const ProductsModals = ({ productData, modalStates, dispatch, getQueryKey }) => {
    const handleCloseModal = (typeModal) => () => dispatch(actionHideModal(typeModal));
    const handleOpenModal = (typeModal) => () => dispatch(actionShowModal(typeModal));

    const queryClient = useQueryClient();

    const refreshProductList = () => {
        queryClient.invalidateQueries(getQueryKey);
        queryClient.invalidateQueries(PRICE_METADATA);
    };

    const refreshPriceList = (productId) => {
        queryClient.invalidateQueries(["price", productId]);
    };

    return (
        <PriceContext.Provider value={{ refreshPriceList }}>
            <Suspense fallbac={null}>
                {modalStates[STRUCTURE_ACTIONS.DELETE_PRODUCT] && (
                    <DeleteModal
                        refreshProductList={refreshProductList}
                        closeModal={handleCloseModal(STRUCTURE_ACTIONS.DELETE_PRODUCT)}
                        isShow={modalStates[STRUCTURE_ACTIONS.DELETE_PRODUCT]}
                        product={productData}
                    />
                )}

                {modalStates[STRUCTURE_ACTIONS.CREATE_PRODUCT] && (
                    <CreateProductModal
                        refreshProductList={refreshProductList}
                        closeModal={handleCloseModal(STRUCTURE_ACTIONS.CREATE_PRODUCT)}
                        isShow={modalStates[STRUCTURE_ACTIONS.CREATE_PRODUCT]}
                    />
                )}

                <DetailProduct
                    open={modalStates[STRUCTURE_ACTIONS.SEE_PRODUCT]}
                    setOpen={handleCloseModal(STRUCTURE_ACTIONS.SEE_PRODUCT)}
                    product={productData}
                />

                {modalStates[STRUCTURE_ACTIONS.UPDATE_PRODUCT] && (
                    <UpdateModal
                        refreshProductList={refreshProductList}
                        closeModal={handleCloseModal(STRUCTURE_ACTIONS.UPDATE_PRODUCT)}
                        isShow={modalStates[STRUCTURE_ACTIONS.UPDATE_PRODUCT]}
                        product={productData}
                    />
                )}

                {modalStates[STRUCTURE_ACTIONS.SEE_IMG_PRODUCT] && (
                    <ImageCarousel
                        closeModal={handleCloseModal(STRUCTURE_ACTIONS.SEE_IMG_PRODUCT)}
                        isShow={modalStates[STRUCTURE_ACTIONS.SEE_IMG_PRODUCT]}
                        product={productData}
                        setShowUpdateModal={handleOpenModal(STRUCTURE_ACTIONS.UPDATE_PRODUCT)}
                    />
                )}
            </Suspense>
        </PriceContext.Provider>
    );
};
