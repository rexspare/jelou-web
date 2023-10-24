import { useReactFlow } from "reactflow";

import { deleteBlockConfig } from "@builder/Nodes/utils/libs.config";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { ModalHeadless } from "./Modal";

type DeleteBlockMessageModalProps = {
    closeModal: () => void;
    isOpen: boolean;
    nodeId: string;
    itemId: string;
    keyOfListName: string;
};

const DeleteBlockMessageModal = (props: DeleteBlockMessageModalProps) => {
    const { closeModal, isOpen, nodeId, itemId, keyOfListName } = props;

    const { updateLocalNode } = useCustomsNodes();
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId);

    if (!currentNode) {
        renderMessage("Tuvimos un error al intentar eliminar este bloque, por favor intenta de nuevo recargando la página", TYPE_ERRORS.ERROR);
        closeModal();
        return null;
    }

    return (
        <ModalHeadless
            className="w-73"
            closeModal={closeModal}
            handleClick={deleteBlockConfig(currentNode, itemId, keyOfListName, updateLocalNode)}
            isOpen={isOpen}
            isDisable={false}
            primaryBtnLabel="Si"
            secondaryBtnLabel="No"
            loading={false}
        >
            <main className="px-7 text-gray-400">
                <h2 className="mb-2 text-xl font-semibold text-primary-200">Estás a punto de eliminar este bloque de este paso</h2>
                <p className="text-13 font-normal">Esta acción puede ser irreversible</p>
                <p className="text-base font-semibold">¿Deseas hacerlo?</p>
            </main>
        </ModalHeadless>
    );
};

export default DeleteBlockMessageModal;
