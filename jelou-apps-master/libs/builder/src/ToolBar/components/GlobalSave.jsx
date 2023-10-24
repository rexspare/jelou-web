import { SpinnerIcon, SuccessIcon } from "@builder/Icons";
import { loadingWorkfloStore } from "@builder/Stores";

export const GlobalSave = () => {
    const isLoadingWorkflow = loadingWorkfloStore((state) => state.isLoadingWorkflow);

    return isLoadingWorkflow ? (
        <p className="flex items-center gap-1 text-primary-200">
            <SpinnerIcon width={18} />
            <span className="text-sm font-semibold">Guardando</span>
        </p>
    ) : (
        <p className="flex items-center gap-1 text-secondary-425">
            <SuccessIcon /> <span className="text-sm font-semibold">Guardado</span>
        </p>
    );
};
