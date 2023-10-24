import { useParams } from "react-router-dom";

import { SpinnerIcon, VersioningIcon } from "@builder/Icons";
import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { useQueryVersion } from "@builder/modules/ToolsVersions/infrastructure/queryVersion";
import { getTimeParsed, parsePrivacy } from "../utils.toolbar";

type VersioningModalProps = {
    isOpen: boolean;
    handleClose: () => void;
};

export const VersioningModal = ({ isOpen, handleClose }: VersioningModalProps): JSX.Element => {
    const { toolkitId, toolId } = useParams();
    const { versions = [], isLoading } = useQueryVersion({ toolId: String(toolId), toolkitId: String(toolkitId) });

    return (
        <ModalHeadless showBtns={false} className="w-[45rem]" isDisable={false} showClose={false} isOpen={isOpen} closeModal={handleClose}>
            <HeaderModalBtns Icon={VersioningIcon} onClose={handleClose} title="Historial de versiones" colors="bg-[#F2FBFC] text-primary-200" />
            <main className="flex flex-col gap-4 px-8 pb-2 pt-6 text-gray-400">
                <p className="text-sm">Cada vez que se publica una herramienta, aparece un nuevo registro en la siguiente tabla.</p>
                {isLoading ? (
                    <div className="grid h-full items-center justify-center">
                        <span className="text-primary-200">
                            <SpinnerIcon width={50} />
                        </span>
                    </div>
                ) : (
                    <div className="relative mb-4 overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="flex w-full bg-gray-50 text-xs uppercase text-gray-700">
                                <tr className="flex w-full">
                                    <th scope="col" className="w-1/4 px-6 py-3">
                                        Fecha
                                    </th>
                                    <th scope="col" className="w-1/4 px-6 py-3">
                                        Version
                                    </th>
                                    <th scope="col" className="w-1/4 px-6 py-3">
                                        Usuario
                                    </th>
                                    <th scope="col" className="w-1/4 px-6 py-3">
                                        Privacidad
                                    </th>
                                    <th scope="col" className="w-1/4 px-6 py-3">
                                        Edición
                                    </th>
                                    {/* <th scope="col" className="px-6 py-3">
                      Estado
                    </th> */}
                                    {/* <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th> */}
                                </tr>
                            </thead>
                            <tbody
                                className="flex w-full flex-col items-center overflow-y-scroll [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
                                style={{ height: "10rem" }}
                            >
                                {versions &&
                                    versions.map((version, index) => (
                                        <tr key={index} className="flex w-full border-b-1 border-gray-230 bg-white hover:bg-gray-230">
                                            <td className="w-1/4 whitespace-nowrap px-6 py-4 font-medium text-gray-900">{getTimeParsed(new Date(), new Date(version.createdAt))}</td>
                                            <td className="w-1/4 px-6 py-4">{version.version}</td>
                                            <td className="w-1/4 px-6 py-4">{version.author.name}</td>
                                            <td className="w-1/4 px-6 py-4">{parsePrivacy(version.privacy)}</td>
                                            <td className="w-1/4 px-6 py-4">{version.readonly ? "Solo Lectura" : "Editable"}</td>
                                            {/* <td className="px-6 py-4">{version.workflowId}</td> */}
                                            {/* <td className="flex items-center gap-2 px-6 py-6">
                        <Tippy arrow theme="jelou" content="Previsualizar versión">
                          <div className="cursor-pointer hover:text-primary-200">
                            <RevealIcon width={24} height={24} />
                          </div>
                        </Tippy>
                        <Tippy arrow theme="jelou" content="Restaurar versión">
                          <div className="cursor-pointer hover:text-primary-200">
                            <RestoreTimeIcon width={24} height={24} />
                          </div>
                        </Tippy>
                      </td> */}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </ModalHeadless>
    );
};
