import { SpinnerIcon } from "@builder/Icons";

type ModalFooterBtnsProps = {
    colors: string;
    onCancel: () => void;
    onSubmit: () => void;
    className?: string;
    primaryLabel: string;
    secondaryLabel: string;
    disabled?: boolean;
    isLoading?: boolean;
    classNameSecondary?: string;
};

export const ModalFooterBtns = ({
    colors,
    onCancel,
    onSubmit,
    className = "",
    primaryLabel,
    secondaryLabel,
    disabled = false,
    isLoading = false,
    classNameSecondary = "bg-primary-700 text-gray-400",
}: ModalFooterBtnsProps): JSX.Element => {
    return (
        <div className={`flex justify-end gap-2 py-4 ${className}`}>
            <button type="button" onClick={onCancel} className={`h-10 min-w-1 rounded-20 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40 ${classNameSecondary}`}>
                {secondaryLabel}
            </button>
            <button
                type="submit"
                onClick={onSubmit}
                disabled={disabled}
                className={`flex h-10 items-center justify-center rounded-20 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 ${colors}`}
            >
                {isLoading ? <SpinnerIcon /> : primaryLabel}
            </button>
        </div>
    );
};
