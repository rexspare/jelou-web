import { ErrorIcon } from "@apps/shared/icons";

export const InputErrorMessage = ({ hasError }) => {
    return (
        <div className="flex items-center gap-2 mt-1 font-medium">
            <ErrorIcon /> <span className="text-sm text-red-1010">{hasError}</span>
        </div>
    );
};