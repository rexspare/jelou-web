import { ErrorIcon } from "@apps/shared/icons";

export const InputErrorMessage = ({ hasError }) => {
    return (
        <div className="flex items-center gap-2 mt-2 ml-2 font-medium">
            <ErrorIcon /> <span className="text-12 text-red-1010">{hasError}</span>
        </div>
    );
};
