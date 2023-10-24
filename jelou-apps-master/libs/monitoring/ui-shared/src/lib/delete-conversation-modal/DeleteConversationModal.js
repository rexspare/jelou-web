import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";

import { ModalHeadlessSimple, renderMessage } from "@apps/shared/common";
import { CloseIcon2, DeleteConversationIcon, LoadingSpinner } from "@apps/shared/icons";
import { deleteConversation } from "./deleteConversation.service";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const DeleteConversationModal = ({ closeModal, isShowModal, conversationId, dailyConversations, displayName }) => {
    const [disableButton, setDisableButton] = useState(true);
    const reasonInput = useRef(null);

    const { t } = useTranslation();
    const company = useSelector((state) => state.company);

    const { mutate, isLoading } = useMutation(deleteConversation);

    const handleDeleteConversation = () => {
        const { id: companyId } = company;
        const reason = reasonInput.current.value.trim();

        if (!companyId || !conversationId) {
            console.error("params requiered", { companyId, conversationId, reason });
            renderMessage("Hubo un error con las credenciales, por favor refesque la página e intente nuevamente", "error");
            return;
        }

        mutate(
            { companyId, conversationId, reason },
            {
                onSuccess: () => {
                    renderMessage("Conversación eliminada", MESSAGE_TYPES.SUCCESS);
                },
                onError: (error) => {
                    console.error("service ~ cancel order ~ catch - error ", { error });
                    renderMessage(error, MESSAGE_TYPES.ERROR);
                },
                onSettled: () => {
                    closeModal();
                    dailyConversations();
                },
            }
        );
    };

    const validateInput = (e) => {
        const { value } = e.target;

        const validation = value.trim().length < 3;
        setDisableButton(validation);
    };

    return (
        <ModalHeadlessSimple className="max-w-md rounded-20" closeModal={closeModal} isShow={isShowModal}>
            <header className="flex h-12 items-center justify-between bg-[#FDEDEA] px-10 text-[#9E3223]">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                    <DeleteConversationIcon width={20} />
                    <span className="whitespace-nowrap">Eliminar conversación</span>
                </h2>

                <button onClick={closeModal}>
                    <CloseIcon2 fill="currentColor" className="cursor-pointer fill-current" width="1rem" height="1rem" />
                </button>
            </header>

            <div className="my-6 space-y-5 px-10 text-gray-400">
                <div className="space-y-2">
                    <h3 className="text-15 font-semibold">
                        Estás a punto de eliminar la conversación con <span className="text-[#EC5F4F]">{displayName}</span>
                    </h3>
                    <p className="text-15">
                        Si eliminas esta conversación, recuerda que el borrado es <span className="text-[#EC5F4F]">definitivo</span>
                    </p>
                    <p className="text-15 font-semibold text-gray-400">{t("datum.Desear hacerlo")}</p>
                </div>

                <label className="block text-sm">
                    <span className="font-semibold">Motivo por el cual eliminas esta conversación</span>
                    <textarea
                        onChange={validateInput}
                        autoFocus
                        maxLength={100}
                        ref={reasonInput}
                        placeholder={"Escribe aquí la razón por la que eliminas esta conversación (Este campo es obligatorio)"}
                        className="TextArea mt-1 h-28 w-full resize-none rounded-10 border-none bg-[#F5F9FD] text-sm font-normal placeholder:text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none"
                    />
                    <small>*Este campo es obligatorio</small>
                </label>

                <footer className="flex w-full justify-end gap-4">
                    <button className="h-[2.25rem] rounded-1 bg-primary-700 px-4 text-15 font-semibold text-gray-400" onClick={closeModal}>
                        {t("buttons.cancel")}
                    </button>
                    <button
                        disabled={disableButton}
                        className="flex h-[2.25rem] w-48 items-center justify-center rounded-1 bg-[#EC5F4F] px-4 text-15 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleDeleteConversation}>
                        {isLoading ? <LoadingSpinner color="#fff" /> : "Eliminar conversación"}
                    </button>
                </footer>
            </div>
        </ModalHeadlessSimple>
    );
};
export default DeleteConversationModal;
