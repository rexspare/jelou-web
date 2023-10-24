import Tippy from "@tippyjs/react";
import TextareaAutosize from "react-autosize-textarea/lib";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";

import { ModalHeadless } from "@apps/pma/ui-shared";
import { SpinnerIcon } from "@apps/shared/icons";

const DEFAULT_MESSAGE = `En este enlace podrás realizar tu pago: \n`;
const PaymentMessageModal = ({ closeModal, createMessage, isOpen, paymentLink } = {}) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const company = useSelector((state) => state.company);
    const companyDefaultMessage = company?.properties?.operatorView?.customPaymentMessage;
    const accompanyingMessage = companyDefaultMessage ?? DEFAULT_MESSAGE;

    const copyLinkToClipbiard = () => navigator.clipboard.writeText(paymentLink);
    const handleSubmitMessage = (evt) => {
        evt.preventDefault();
        setLoading(true);

        const form = new FormData(evt.currentTarget);
        const data = Object.fromEntries(form);

        const text = data?.message ? `${data.message} \n ${paymentLink}` : accompanyingMessage + paymentLink;
        const message = { type: "TEXT", text };

        createMessage(message, true);
        setTimeout(() => closeModal(), 1000);
    };

    return (
        <ModalHeadless closeModal={closeModal} isOpen={isOpen} title="Personalizar mensaje" className="w-80">
            <form onSubmit={handleSubmitMessage} className="p-4">
                <label className="grid gap-1 text-sm text-gray-400">
                    Enlace con el monto personalizado
                    <div className="flex items-center justify-between px-4 text-gray-400 h-9 rounded-10 bg-gray-10">
                        <input className="font-normal text-gray-400 truncate w-52 bg-gray-10 text-13" readOnly value={paymentLink} />
                        <Tippy content="Copiar" placement="top">
                            <button type={"button"} onClick={copyLinkToClipbiard}>
                                <svg width={13} height={17} fill="none">
                                    <path
                                        d="M4.445.092c.374-.062.767-.04 1.162-.049a99.236 99.236 0 0 1 2.93-.017c.949.005 1.962-.09 2.901.054.911.139 1.56.9 1.561 1.9.002 2.745 0 5.49 0 8.236 0 .846-.006 1.692-.002 2.538.005.949-.447 1.89-1.395 2.048-.397.066-.808.034-1.212.045-.09.003-.181 0-.287 0v.184c-.01 1.118-.76 1.92-1.803 1.92-2.142.002-4.32.12-6.457-.018-.283-.018-.57-.048-.835-.156-.642-.26-1.005-1.035-1.005-1.741C0 12.852 0 10.668.002 8.483c0-1.502-.006-3.003.004-4.505.006-.888.594-1.645 1.412-1.78.417-.068.849-.032 1.274-.042.064-.002.129 0 .207 0 0-.107-.002-.189 0-.27.021-.587.287-1.13.738-1.465a1.8 1.8 0 0 1 .808-.33ZM1.116 9.545v5.448c0 .475.243.753.675.754 2.175.003 4.35.002 6.525 0 .324 0 .558-.173.634-.466a1.37 1.37 0 0 0 .036-.342V4.16c0-.554-.237-.809-.75-.809H1.878c-.527 0-.763.252-.763.813v5.381Zm8.987 4.107h1.038c.503 0 .745-.26.745-.8V2.057c0-.553-.235-.802-.755-.802H7.946c-1.078 0-2.155-.002-3.232 0-.436.001-.682.262-.702.712-.007.156.041.192.18.192 1.36-.006 2.72-.008 4.079 0 .217.002.444.029.649.1.74.26 1.183.959 1.183 1.832v9.561Z"
                                        fill="#A6B4D0"
                                    />
                                </svg>
                            </button>
                        </Tippy>
                    </div>
                </label>

                <div className="my-6 border-b-1.5 border-gray-100 border-opacity-25"></div>

                <label className="grid gap-1 text-sm text-gray-400">
                    Este mensaje acompañará al enlace de pago
                    <div className="rounded-10 bg-gray-10">
                        <TextareaAutosize
                            spellCheck={true}
                            autoFocus
                            name="message"
                            className="w-full overflow-y-auto font-normal leading-normal text-gray-400 align-middle bg-transparent border-transparent resize-none text-13 placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-transparent focus:ring-transparent"
                            maxRows={5}
                            defaultValue={DEFAULT_MESSAGE}
                        />
                    </div>
                </label>

                <button
                    disabled={loading}
                    className="grid w-full h-10 px-4 py-2 mt-4 font-medium text-center text-white rounded-md place-content-center bg-primary-200 disabled:cursor-not-allowed">
                    {loading ? (
                        <SpinnerIcon />
                    ) : (
                        <div className="grid grid-flow-col gap-2 place-content-center">
                            <svg className="pt-0.25" width={18} height={14} fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.281 3.002c-1.238.571-2.476 1.145-3.714 1.715-.969.446-1.934.898-2.911 1.323a.713.713 0 0 1-.55-.016A336.644 336.644 0 0 1 .965 3.69c-.083-.047-.405-.237-.738-.432-.28-.165-.192-.583.134-.626 1.23-.165 3.296-.446 4.258-.602.47-.077.94-.152 1.407-.23 2.45-.397 4.901-.797 7.35-1.195 1.15-.186 2.301-.377 3.453-.551.032-.005.062-.006.094-.006a.32.32 0 0 1 .277.463.565.565 0 0 1-.054.084c-2.365 3.062-4.743 6.115-7.12 9.17-.992 1.274-1.979 2.554-2.978 3.82a.504.504 0 0 0-.006.007c-.18.213-.557.095-.571-.184-.07-1.736-.12-3.476-.193-5.214-.015-.355.075-.59.388-.817 1.754-1.271 3.486-2.57 5.224-3.862.165-.122.31-.273.464-.41a2.794 2.794 0 0 1-.074-.103Z"
                                    fill="#fff"
                                />
                            </svg>
                            {t("Enviar")}
                        </div>
                    )}
                </button>
            </form>
        </ModalHeadless>
    );
};

export default PaymentMessageModal;
