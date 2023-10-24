import { lazy, Suspense, useCallback, useState } from "react";
import CustomPaymentModal from "./Modals/CustomPayment.modal";
import PaymentMessageModal from "./Modals/PaymentMessage";

// const CustomPaymentModal = lazy(() => import("./Modals/CustomPayment.modal"));
// const PaymentMessageModal = lazy(() => import("./Modals/PaymentMessage"));

export const CustomPayment = ({ createMessage, showCustomPaymentModal, onCloseCustomPayment }) => {
    const [showPaymentMessage, setPaymentMessage] = useState(false);
    const [paymentLink, setPaymentLink] = useState(null);

    const closeModal = useCallback(() => {
        setPaymentMessage(false);
        setPaymentLink(null);
    }, []);

    return (
        <Suspense fallback={null}>
            {showCustomPaymentModal && (
                <CustomPaymentModal
                    setPaymentLink={setPaymentLink}
                    isOpen={showCustomPaymentModal}
                    onClose={onCloseCustomPayment}
                    setPaymentMessage={setPaymentMessage}
                />
            )}
            {showPaymentMessage && (
                <PaymentMessageModal createMessage={createMessage} closeModal={closeModal} isOpen={showPaymentMessage} paymentLink={paymentLink} />
            )}
        </Suspense>
    );
};
