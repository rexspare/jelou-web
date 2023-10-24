import { ModalHeadless } from "../../../common/Headless/Modal";

type Props = {
    isOpen: boolean;
    closeModal: () => void;
    onConfirm: () => void;
};

const ConfirmDeleteModal = ({ isOpen, closeModal, onConfirm }: Props) => {
    const handleConfirmDelete = () => {
        onConfirm();
        closeModal();
    };

    return (
        <ModalHeadless className="w-73" closeModal={closeModal} handleClick={handleConfirmDelete} isOpen={isOpen} isDisable={false} primaryBtnLabel="Si" secondaryBtnLabel="No">
            <main className="px-7 text-gray-400">
                <h2 className="mb-2 text-xl font-semibold text-primary-200">Estas a punto de eliminar esta variable</h2>
                <p className="text-base font-semibold">¿Deseas hacerlo?</p>
            </main>
        </ModalHeadless>
    );
};

export default ConfirmDeleteModal;
