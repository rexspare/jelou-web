import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon2 } from "@apps/shared/icons";
import { TicketIcon } from "@heroicons/react/solid";
import React, { useRef } from "react";

const TicketAssignationModal = (props) => {
    const { onClose, onExit, emailNumber } = props;

    const modalRef = useRef(null);
    useOnClickOutside(modalRef, () => onClose());

    return (
        <div className="fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-smoke-light" />
            </div>
            <div ref={modalRef} className="relative z-70 min-h-20 w-[24rem] rounded-xl bg-white pb-6">
                <div className="flex items-center justify-between rounded-t-xl bg-[#F3FBFC] px-6 py-3">
                    <div className="flex items-center space-x-3">
                        <TicketIcon width="1.4rem" />
                        <p className="text-2xl font-bold text-primary-200">Asignación de Ticket</p>
                    </div>
                    <span className="" onClick={() => onClose()}>
                        <CloseIcon2 width={"1.2rem"} height={"1rem"} className={"z-120 fill-current text-gray-300 hover:cursor-pointer"} />
                    </span>
                </div>
                <div className="flex flex-col px-6 pt-4">
                    <div className="flex space-x-2">
                        <p className="flex-1 font-bold text-primary-200">
                            El número de tu ticket es <span className="font-bold text-primary-200">{emailNumber}</span>
                        </p>
                    </div>
                    <div className="mt-3 flex flex-col text-xs">
                        <p className="flex-1 text-gray-500">
                            Se te ha asignado un numero de caso para este email, con esto podrás hacer un seguimiento de toda la línea de mails
                        </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <div className={`hidden items-center lg:flex`}>
                            <button
                                className="flex items-center justify-center rounded-full border-transparent bg-[#F2F7FD] px-6 py-2 outline-none focus:outline-none"
                                onClick={() => {
                                    onClose();
                                    onExit();
                                }}>
                                <span className="flex items-center justify-center text-xs font-bold text-gray-400">Salir</span>
                            </button>
                        </div>
                        <div className={`hidden items-center lg:flex`}>
                            <button
                                className="hover:bg-primary-light flex items-center justify-center rounded-full border-transparent bg-primary-200 px-5 py-2 outline-none focus:outline-none"
                                onClick={() => onClose()}>
                                <span className="flex items-center justify-center text-xs font-bold text-white">Volver</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketAssignationModal;