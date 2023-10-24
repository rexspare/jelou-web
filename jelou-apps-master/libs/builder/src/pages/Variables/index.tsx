import { Suspense, lazy, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import { PlusIcon, RefreshIcon, SpinnerIcon } from "@apps/shared/icons";
import ToolBar from "@builder/ToolBar";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import useWorkflow from "../ToolsWorkflow/useWorkflow";
import { FromPageContext } from "../Workflow";
import { FROM_PAGE } from "../constants.home";
import { VariableList } from "./components/VariableList";
import useVariables from "./hooks/useVariables";
import { CreateNewVariableParams } from "./models/variables";

const AddVariableModal = lazy(() => import("./components/AddVariableModal"));
const ConfirmDeleteModal = lazy(() => import("./components/ConfirmDeleteModal"));

export const VariablesPage = () => {
    const [openAddVariableModal, setOpenAddVariableModal] = useState<boolean>(false);
    const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false);
    const [variableIdAboutToDelete, setVariableIdAboutToDelete] = useState<string>("");
    /**
     * TODO: Replace this state using react-query
     */
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

    const { isLoadingTools, workflowId, isLoadingWorkflow } = useWorkflow();

    const { systemVariables, personalVariables, isLoadingVariables, createNewVariableMutation, deleteVariableMutation, refreshPersonalVariables, refreshSystemVariables, syncSystemVariables } =
        useVariables({
            workflowId: String(workflowId),
            enableQuery: !isLoadingWorkflow && String(workflowId) !== undefined,
        });

    const handleCreateNewPersonalVariable = ({ name, value, type }: CreateNewVariableParams) => {
        createNewVariableMutation(
            { name, value, type },
            {
                onSuccess: () => {
                    renderMessage(`Se ha creado la variable personal ${name} exitosamente`, TYPE_ERRORS.SUCCESS);
                    refreshPersonalVariables();
                },
                onError: (reason) => {
                    const error = reason as Error;
                    renderMessage(error.message, TYPE_ERRORS.SUCCESS);
                },
            }
        );
    };

    const handleDeletePersonalVariable = (variableId: string) => {
        deleteVariableMutation(variableId, {
            onSuccess: () => {
                renderMessage("Se ha eliminado la variable personal exitosamente", TYPE_ERRORS.SUCCESS);
                refreshPersonalVariables();
            },
            onError: (reason) => {
                const error = reason as Error;
                renderMessage(error.message, TYPE_ERRORS.ERROR);
            },
        });
    };

    const handleOnDeleteElementAction = (variableId: string) => {
        setOpenConfirmDeleteModal(true);
        setVariableIdAboutToDelete(variableId);
    };

    const handleSyncVariables = () => {
        const syncSystemVariablesRequest = async () => {
            try {
                setLoadingRequest(true);
                await syncSystemVariables();
                renderMessage("Se han sincronizado exitosamente las variables de sistema", TYPE_ERRORS.SUCCESS);
                refreshSystemVariables();
            } catch (reason) {
                const error = reason as Error;
                renderMessage(error.message, TYPE_ERRORS.SUCCESS);
            } finally {
                setLoadingRequest(false);
            }
        };

        syncSystemVariablesRequest();
    };

    if (isLoadingTools || isLoadingWorkflow || isLoadingVariables) {
        return (
            <div className="grid h-screen w-screen place-content-center">
                <span className="text-primary-200">
                    <SpinnerIcon width={50} heigth={30} />
                </span>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden">
            <Suspense fallback={null}>
                {openAddVariableModal && <AddVariableModal isOpen={openAddVariableModal} closeModal={() => setOpenAddVariableModal(false)} onCreateNewVariable={handleCreateNewPersonalVariable} />}
                {openConfirmDeleteModal && (
                    <ConfirmDeleteModal isOpen={openConfirmDeleteModal} closeModal={() => setOpenConfirmDeleteModal(false)} onConfirm={() => handleDeletePersonalVariable(variableIdAboutToDelete)} />
                )}
            </Suspense>

            <FromPageContext.Provider value={FROM_PAGE.TOOL}>
                <ReactFlowProvider>
                    <ToolBar />
                </ReactFlowProvider>
                <section
                    className="absolute top-[5rem] left-[12px] flex
                    h-[calc(100%_-_100px)] w-[calc(100%_-_24px)] flex-col rounded-10
                    bg-white shadow-[4px_4px_5px_grba(184,_189,_201,_0.25)]"
                >
                    <header className="border-b-1 border-[#E1E1E1] py-6">
                        <h2 className="px-8 text-lg text-primary-200">Configuración de variables</h2>
                    </header>

                    <div className="grid max-h-[calc(100%_-_80px)] grow grid-rows-2 gap-y-8 p-8">
                        <VariableList
                            variables={systemVariables}
                            title="Variables del sistema"
                            actionButtonLabel="Sincronizar"
                            actionButtonIcon={<RefreshIcon fill="currentColor" width="14" height="14" />}
                            emptyVariablesLabel="Aún no tienes variables del sistema asignadas"
                            canRevealValues={false}
                            disableActionButton={loadingRequest || isLoadingVariables}
                            onActionClick={handleSyncVariables}
                        />
                        <VariableList
                            variables={personalVariables}
                            title="Variables personales"
                            canDeleteElements
                            actionButtonLabel="Agregar"
                            actionButtonIcon={<PlusIcon fill="currentColor" width="14" height="14" />}
                            disableActionButton={loadingRequest || isLoadingVariables}
                            emptyVariablesLabel="Aún no tienes variables personales asignadas"
                            onActionClick={() => setOpenAddVariableModal(true)}
                            onDeleteElement={handleOnDeleteElementAction}
                        />
                    </div>
                </section>
            </FromPageContext.Provider>
        </main>
    );
};
