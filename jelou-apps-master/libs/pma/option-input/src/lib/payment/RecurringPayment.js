import { lazy, Suspense, useCallback, useState } from "react";
import PaymentMessageModal from "./Modals/PaymentMessage";
import RecurringPaymentModal from "./Modals/RecurringPayment.modal";

// const RecurringPaymentModal = lazy(() => import("./Modals/RecurringPayment.modal"));
// const PaymentMessageModal = lazy(() => import("./Modals/PaymentMessage"));

export const RecurringPayment = ({ createMessage, showRecurringPaymentModal, onCloseRecurringPayment, plans }) => {
    const [showPaymentMessage, setPaymentMessage] = useState(false);
    const [paymentLink, setPaymentLink] = useState(null);

    const closeModal = useCallback(() => {
        setPaymentMessage(false);
        setPaymentLink(null);
    }, []);

    return (
        <Suspense fallback={null}>
            {showRecurringPaymentModal && (
                <RecurringPaymentModal
                    plans={plans}
                    setPaymentLink={setPaymentLink}
                    isOpen={showRecurringPaymentModal}
                    onClose={onCloseRecurringPayment}
                    setPaymentMessage={setPaymentMessage}
                />
            )}
            {showPaymentMessage && (
                <PaymentMessageModal createMessage={createMessage} closeModal={closeModal} isOpen={showPaymentMessage} paymentLink={paymentLink} />
            )}
        </Suspense>
    );
};
