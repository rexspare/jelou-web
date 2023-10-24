import type { Output as OutputTypes } from "@builder/modules/OutputTools/domain/outputs.domain";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, Suspense, useState } from "react";

import { inputsOutputsPanelsStore } from "@builder/Stores";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";

import { CreateUpdateOutput } from "../CreateOutput";
import { DeleteOutput } from "../Delete.output";
import OutputsItems from "./outputsItems";

export const OutputsAdmin = () => {
    const [isOpenUpdateOutput, setIsOpenUpdateOutput] = useState(false);
    const [isOpenDeleteOutput, setIsOpenDeleteOutput] = useState(false);

    const [OutputSelected, setOutputSelected] = useState<OutputTypes | undefined>(undefined);

    const { isOutputAdminModal, setOutputAdminModal, setCreateOutputModal, isCreateOutputModal } = inputsOutputsPanelsStore();

    const closeCreateOutput = () => setCreateOutputModal(false);
    const openCreateOutput = () => setCreateOutputModal(true);

    const closeOutputAdmin = () => setOutputAdminModal(false);

    const handleOpenUpdateOutputModal = (output: OutputTypes) => {
        setOutputSelected(output);
        setIsOpenUpdateOutput(true);
    };

    const handleOpenDeleteOutputModal = (output: OutputTypes) => {
        setOutputSelected(output);
        setIsOpenDeleteOutput(true);
    };

    const { tool } = useQueryTool();
    const { Outputs = [] } = tool || {};

    return (
        <>
            <Transition show={isOutputAdminModal} as={Fragment}>
                <Dialog
                    as="div"
                    open={isOutputAdminModal}
                    onClose={closeOutputAdmin}
                    className={`absolute right-[0.6rem] top-[5rem] z-10 grid h-[90vh] grid-rows-[3rem_auto_4rem] rounded-10 bg-white shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)] transition-all duration-500 ease-in-out ${
                        isOutputAdminModal ? "w-72" : "w-0"
                    }`}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-300"
                        leaveFrom="translate-x-0"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel>
                            {isOutputAdminModal && (
                                <>
                                    <Dialog.Title className={"border-grey-lightest border-b-1 px-6 py-3 text-lg font-semibold text-primary-200"}>Administrador de outputs</Dialog.Title>
                                    <Dialog.Description as="section">
                                        <main className="h-[calc(90vh-115px)] overflow-y-scroll py-6 pl-6">
                                            <ul className="space-y-3 text-[#374361]">
                                                {Outputs &&
                                                    Outputs.map((output) => (
                                                        <OutputsItems
                                                            key={output.id}
                                                            output={output}
                                                            handleOpenUpdateOutputModal={handleOpenUpdateOutputModal}
                                                            handleOpenDeleteOutputModal={handleOpenDeleteOutputModal}
                                                        />
                                                    ))}
                                            </ul>
                                        </main>
                                    </Dialog.Description>
                                    <footer className="border-grey-lightest flex items-center justify-center border-t-1 px-6 py-3">
                                        <button onClick={openCreateOutput} className="h-8 w-full rounded-full border-1 border-primary-200 text-sm font-medium text-primary-200">
                                            Agregar nuevo output
                                        </button>
                                    </footer>
                                </>
                            )}
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            <Suspense fallback={null}>
                {/* update output */}
                {isOpenUpdateOutput && <CreateUpdateOutput isCreateOutputModal={isOpenUpdateOutput} onClose={() => setIsOpenUpdateOutput(false)} defaultOutput={OutputSelected} />}

                {/* create output */}
                {isCreateOutputModal && <CreateUpdateOutput isCreateOutputModal={isCreateOutputModal} onClose={closeCreateOutput} />}

                {isOpenDeleteOutput && OutputSelected && <DeleteOutput outputToDelete={OutputSelected} isOpenDeleteOutput={isOpenDeleteOutput} onClose={() => setIsOpenDeleteOutput(false)} />}
            </Suspense>
        </>
    );
};
