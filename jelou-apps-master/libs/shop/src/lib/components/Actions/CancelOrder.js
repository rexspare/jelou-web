import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie";

import animation from "./cart.json";

import { renderMessage } from "@apps/shared/common";
import { cancelOrder } from "../../services/order";
import { CloseIcon2, LoadingSpinner, ShoppingCarCancel } from "@apps/shared/icons";
import { Modal } from "../Modal";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const CancelOrderModal = ({ order, isShow, onClose, getQueryKey }) => {
    const { id } = order;

    const { t } = useTranslation();
    const company = useSelector((state) => state.company);

    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(cancelOrder, {
        onSuccess: () => {
            const queryKey = getQueryKey();
            queryClient.invalidateQueries(queryKey);
        },
    });

    const handleCancelOrder = () => {
        const jelou_pay = company.properties?.shopCredentials?.jelou_pay ?? {};
        const { bearer_token = null } = jelou_pay;

        if (!bearer_token) {
            console.error("bearer_token is required", { bearer_token });
            renderMessage("Hubo un error con las credenciales, por favor refesque la página e intente nuevamente", MESSAGE_TYPES.ERROR);
            return;
        }

        mutate(
            { bearer_token, orderId: id },
            {
                onSuccess: () => {
                    renderMessage("Se canceló la orden correctamente", MESSAGE_TYPES.SUCCESS);
                },
                onError: (error) => {
                    console.error("service ~ cancel order ~ catch - error ", { error });
                    renderMessage(error, MESSAGE_TYPES.ERROR);
                },
                onSettled: () => {
                    onClose();
                },
            }
        );
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <Modal closeModal={onClose} isShow={isShow} classNameActivate="" className="max-w-md rounded-12">
            <div className="flex w-full justify-end pt-2 pr-2">
                <button onClick={onClose}>
                    <CloseIcon2 className="cursor-pointer fill-current text-gray-75" width="1rem" height="1rem" />
                </button>
            </div>
            <Lottie options={defaultOptions} height={200} width={255} />

            <aside className="mt-20 w-full px-10">
                <div className="mb-3 flex items-center gap-3">
                    <ShoppingCarCancel fillCar="#EC5F4F" fillX="#EC5F4F" />
                    <h3 className="text-[1.25rem] font-bold text-[#EC5F4F]">{`${t("shop.modal.cancel")} orden # ${id}`}</h3>
                </div>
                <p className="text-15 font-semibold text-[#A83927]">Si cancelas esta orden de compra, no podrás recuperarla</p>
                <p className="my-1 text-15 font-semibold text-gray-400">{t("datum.Desear hacerlo")}</p>
            </aside>

            <footer className="mt-4 mb-8 flex w-full justify-end gap-4 pr-10">
                <button className="h-[2.25rem] rounded-1 bg-primary-700 px-4 text-15 font-semibold text-gray-400" onClick={onClose}>
                    {t("buttons.cancel")}
                </button>
                <button
                    className="flex h-[2.25rem] w-48 items-center justify-center rounded-1 bg-[#EC5F4F] px-4 text-15 font-semibold text-white"
                    onClick={handleCancelOrder}>
                    {isLoading ? <LoadingSpinner color="#fff" /> : t("shop.Si,deseoeliminarla")}
                </button>
            </footer>
            <p className="h-4 w-full bg-[#FDEFED]"></p>
        </Modal>
    );
};
export default CancelOrderModal;
