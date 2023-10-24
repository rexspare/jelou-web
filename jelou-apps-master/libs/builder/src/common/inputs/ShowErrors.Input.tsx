import { ErrorIcon } from "../../Icons";

export const InputErrorMessage = ({ hasError }: { hasError: string }) => {
    return (
        <div className="mt-1 grid grid-cols-[1rem_auto] items-center gap-2 text-sm font-medium text-red-300">
            <ErrorIcon /> <span className="text-12">{hasError}</span>
        </div>
    );
};
