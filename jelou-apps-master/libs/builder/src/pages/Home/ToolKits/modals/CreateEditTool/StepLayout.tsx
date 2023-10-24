import { SpinnerIcon } from "@builder/Icons";
import { isEmpty } from "lodash";

type StepLayoutProps = {
    children: React.ReactNode;
    title: string;
    subTitle?: string;
    onSecondaryClick: () => void;
    secondaryLabel: string;
    onPrimaryClick: () => void;
    primaryLabel: string;
    disabled?: boolean;
    showTerciary?: boolean;
    isLoading?: boolean;
    terciaryLabel?: string;
    onTerciaryClick?: () => void;
    terciaryIcon?: React.ReactNode;
    terciaryButtonClassName?: string;
};

export const StepLayout = ({
    children,
    title,
    subTitle,
    primaryLabel,
    terciaryLabel,
    secondaryLabel,
    onPrimaryClick,
    onSecondaryClick,
    onTerciaryClick,
    disabled = false,
    isLoading = false,
    terciaryIcon,
    terciaryButtonClassName,
    showTerciary,
}: StepLayoutProps) => {
    return (
        <div className={`grid h-full w-full grid-rows-[max-content] px-10 pb-6 pt-10`}>
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-primary-200">{title}</h2>
                {!isEmpty(subTitle) && <p className="text-sm text-gray-400">{subTitle}</p>}
            </div>
            <div className="mt-8 flex w-full flex-col gap-4 text-gray-400">{children}</div>
            <div className="grid items-end justify-end">
                <footer className="flex justify-end gap-2 py-4">
                    {showTerciary && (
                        <button onClick={onTerciaryClick} className={`h-10 rounded-20 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40 ${terciaryButtonClassName}`}>
                            {terciaryIcon}
                            {terciaryLabel}
                        </button>
                    )}
                    <button onClick={onSecondaryClick} className="h-10 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                        {secondaryLabel}
                    </button>
                    <button
                        onClick={onPrimaryClick}
                        disabled={disabled}
                        className="flex h-10 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isLoading ? <SpinnerIcon /> : primaryLabel}
                    </button>
                </footer>
            </div>
        </div>
    );
};
