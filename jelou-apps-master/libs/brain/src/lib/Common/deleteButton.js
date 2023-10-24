import { TrashIcon2, LoadingSpinner } from "@apps/shared/icons";

const DeleteButton = (props) => {
    const {
        buttonText,
        onClick,
        showIcon = true,
        redBackground = false,
        isBlockEditable = false,
        isLoading = false,
        disabled = false,
    } = props;

    return (
        <button
            onClick={onClick}
            type="button"
            disabled={disabled}
            className={`${
                isBlockEditable ?
                    "bg-[#EFF1F4] text-gray-400"
                : redBackground ?
                    "bg-semantic-error text-white"
                : "border-1 border-semantic-error text-semantic-error"
            } flex h-9 w-min items-center justify-center rounded-3xl px-4 py-3.5 font-bold hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50`}
        >
            {
                showIcon && (
                    <span className="mr-2">
                        {isLoading
                            ? <LoadingSpinner color={redBackground ? "#ffffff" : ""}/>
                            : <TrashIcon2 />
                        }
                    </span>
                )
            }
            <span className="whitespace-nowrap">{buttonText}</span>
        </button>
    );
};

export default DeleteButton;
