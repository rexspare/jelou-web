import { ErrorIcon } from "@apps/shared/icons";

export const InputErrorMessage = ({ hasError }) => {
    return (
        <div className="text-red-530 mt-1 grid grid-cols-[1rem_auto] items-center gap-2 text-sm font-medium">
            <ErrorIcon /> <span className="text-12">{hasError}</span>
        </div>
    );
};
