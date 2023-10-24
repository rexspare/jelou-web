import { CloseIcon } from "@apps/shared/icons";

export const HeaderPanel = ({ closeModal, title }) => {
    return (
        <div className="flex justify-between">
            <h3 className="pt-10 pb-5 text-lg font-semibold text-gray-400">{title}</h3>
            <button onClick={closeModal}>
                <CloseIcon width={10} className="text-gray-400/25" fill="currentColor" />
            </button>
        </div>
    );
};
