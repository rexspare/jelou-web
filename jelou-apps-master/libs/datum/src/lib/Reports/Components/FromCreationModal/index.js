import React, { Fragment, useRef, useState } from "react";
import { Transition, Dialog, Switch } from "@headlessui/react";

export const DBCreationModal = ({ isShow, closeModal }) => {
    const [enabledSwitch, setEnabledSwitch] = useState(false);
    const [desactivateSwitch, setDesactivateSwitch] = useState(false);
    const inputFile = useRef(null);

    const handleInputFileClick = () => {
        inputFile.current.click();
    };
    return (
        <Transition appear show={isShow} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-15" />
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <section className="relative inline-block h-users w-full max-w-md transform overflow-hidden overflow-y-scroll rounded-20 bg-white px-8 pt-8 text-left align-middle font-extrabold text-gray-400 shadow-xl transition-all">
                            <h3 className="mb-5 ml-3 text-lg">Crear dato</h3>
                            <form className="text-15">
                                <label className="ml-4">
                                    Campo de texto
                                    <input
                                        className="mb-4 block w-full rounded-lg border-none bg-primary-700 focus:border-transparent focus:ring-transparent "
                                        type="text"
                                        placeholder="Escribe el nombre completo"
                                    />
                                </label>
                                <label className="ml-4">
                                    Campo de número
                                    <input
                                        className="mb-4 block w-full rounded-lg border-none bg-primary-700 focus:border-transparent focus:ring-transparent "
                                        type="number"
                                        placeholder="Ingresa un número"
                                    />
                                </label>
                                <label className="ml-4">
                                    Campo de email
                                    <input
                                        className="mb-4 block w-full rounded-lg border-none bg-primary-700 focus:border-transparent focus:ring-transparent "
                                        type="email"
                                        placeholder="Ingresa un correo electrónico"
                                    />
                                </label>
                                <label className="ml-4">
                                    Campo de link
                                    <input
                                        className="mb-4 block w-full rounded-lg border-none bg-primary-700 focus:border-transparent focus:ring-transparent "
                                        type="text"
                                        placeholder="Ingresa un link a una página web"
                                    />
                                </label>
                                <label className="ml-4">
                                    Campo de opción
                                    <select className="mb-4 block w-full rounded-lg border-none bg-primary-700 focus:border-transparent focus:ring-transparent">
                                        <option value="">Selecciona una opción</option>
                                        <option value="">Opción 1</option>
                                        <option value="">Opción 2</option>
                                        <option value="">Opción 3</option>
                                    </select>
                                </label>
                                <label className="ml-4">
                                    Campo de fecha
                                    <input
                                        className="mb-4 block w-full rounded-lg border-none bg-primary-700 hover:cursor-text focus:border-transparent focus:ring-transparent "
                                        type="date"
                                        placeholder="DD/MM/YYYY"
                                    />
                                </label>
                                <label className="ml-4 cursor-pointer">
                                    Campo de adjunto
                                    <input ref={inputFile} className="hidden" type="file" />
                                    <button
                                        onClick={handleInputFileClick}
                                        className="mt-2 flex gap-1 border-none bg-transparent font-bold text-primary-200">
                                        <IconFile /> Adjuntar archivo
                                    </button>
                                </label>
                                <span className="my-6 block h-0.25 w-full bg-gray-100/25"></span>
                                <h3 className="mb-5 ml-3 text-lg">Campo de opción</h3>
                                <label className="mb-4 flex cursor-pointer select-none items-center gap-4">
                                    <Switch
                                        checked={enabledSwitch}
                                        onChange={setEnabledSwitch}
                                        className={`${enabledSwitch ? "bg-primary-200" : "bg-gray-100"}
          flex h-5 w-10 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out `}>
                                        <span
                                            aria-hidden="true"
                                            className={`${enabledSwitch ? "translate-x-5" : "translate-x-0"}
            ring-0 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
                                        />
                                    </Switch>
                                    Campo de activación
                                </label>
                                <label className="flex cursor-pointer select-none items-center gap-4">
                                    <Switch
                                        checked={desactivateSwitch}
                                        onChange={setDesactivateSwitch}
                                        className={`${desactivateSwitch ? "bg-primary-200" : "bg-gray-100"}
          flex h-5 w-10 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}>
                                        <span
                                            aria-hidden="true"
                                            className={`${desactivateSwitch ? "translate-x-5" : "translate-x-0"}
            ring-0 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
                                        />
                                    </Switch>
                                    Campo de desactivación
                                </label>
                                <span className="mt-11 block h-0.25 w-full bg-gray-100/25"></span>
                                <h3 className="mt-6 mb-5 ml-3 text-lg">Campo de opción</h3>
                                <div className="flex select-none flex-col gap-4">
                                    <label className="cursor-pointer">
                                        <input
                                            className="mr-4 h-4 w-4 cursor-pointer rounded-default border-2 border-gray-400 border-opacity-[0.59] text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                                            type="checkbox"
                                        />
                                        Opción 1
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            className="mr-4 h-4 w-4 cursor-pointer rounded-default border-2 border-gray-400 border-opacity-[0.59] text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                                            type="checkbox"
                                        />
                                        Opción 2
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            className="mr-4 h-4 w-4 cursor-pointer rounded-default border-2 border-gray-400 border-opacity-[0.59] text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                                            type="checkbox"
                                        />
                                        Opción 3
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            className="mr-4 h-4 w-4 cursor-pointer rounded-default border-2 border-gray-400 border-opacity-[0.59] text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                                            type="checkbox"
                                        />
                                        Opción 4
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            className="mr-4 h-4 w-4 cursor-pointer rounded-default border-2 border-gray-400 border-opacity-[0.59] text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"
                                            type="checkbox"
                                        />
                                        Opción 5
                                    </label>
                                </div>
                            </form>
                            <div className="sticky bottom-0 h-14 bg-white">
                                <div className="flex justify-end gap-4">
                                    <button onClick={closeModal} className="button-primary bg-gray-10 text-gray-400 hover:bg-gray-10">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="button-gradient">
                                        Crear data
                                    </button>
                                </div>
                            </div>
                        </section>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

const IconFile = () => (
    <svg width={14} height={16} fill="none">
        <path
            d="M13.817 5.827a.59.59 0 0 0-.878.003l-7.46 8.057c-.969 1.04-2.541 1.04-3.51-.001-.97-1.042-.97-2.73 0-3.771L9.65 1.82a1.477 1.477 0 0 1 2.193.001c.606.651.606 1.706 0 2.357L5.48 11.014v.001a.59.59 0 0 1-.877-.001.702.702 0 0 1 0-.943l3.072-3.3a.702.702 0 0 0 0-.943.59.59 0 0 0-.878 0l-3.072 3.3c-.727.782-.727 2.048 0 2.829a1.772 1.772 0 0 0 2.633 0l.003-.003 6.36-6.833c1.092-1.172 1.092-3.071 0-4.243-1.09-1.17-2.858-1.17-3.949 0L1.09 9.173c-1.452 1.56-1.452 4.093.002 5.656 1.454 1.561 3.812 1.561 5.266 0L13.82 6.77a.702.702 0 0 0-.002-.943Z"
            fill="#00B3C7"
        />
    </svg>
);
