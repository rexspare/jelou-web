import { useState, useCallback, InputHTMLAttributes } from "react";
import { EyesOnIcon, EyesOffIcon, TrashIcon } from "@apps/shared/icons";
import { TextInput } from "../../../common/inputs";
import { Variable, VariableType } from "../models/variables";
import { SettingsStorageIcon } from "../../../Icons/SettingsStorage.Icon";
import { PASSWORD_PLACEHOLDER } from "../../../constants.local";

type TextHideInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value"> & {
    value: string;
    label?: string;
    className?: string;
    canRevealValue?: boolean;
    initWithHiddenValue?: boolean;
};

export const TextHideInput = ({ value, label = "", className = "", canRevealValue = true, initWithHiddenValue = true, ...props }: TextHideInputProps) => {
    const [hiddenValue, setHiddenValue] = useState<boolean>(!canRevealValue || (canRevealValue && initWithHiddenValue));

    const handleChangeVisibility = () => {
        setHiddenValue((hidden) => !hidden);
    };

    const currentValue = props.readOnly && hiddenValue ? PASSWORD_PLACEHOLDER : value;

    return (
        <div className={`flex h-fit w-full flex-col ${className}`}>
            {label && <span className="mb-1 font-medium">{label}</span>}
            <label className="relative flex">
                {canRevealValue && (
                    <button onClick={handleChangeVisibility}>
                        <EyesOnIcon
                            className={`absolute right-[8px] top-[24%] ${!hiddenValue ? "opacity-0" : "opacity-100"} transition-opacity duration-200 ease-linear`}
                            fill="#727C94"
                            width="24"
                            height="24"
                        />
                        <EyesOffIcon
                            className={`absolute right-[8px] top-[24%] ${hiddenValue ? "opacity-0" : "opacity-100"} transition-opacity duration-200 ease-linear`}
                            fill="#727C94"
                            width="24"
                            height="24"
                        />
                    </button>
                )}
                <input
                    className={`h-8 w-full rounded-10 border-1 border-gray-330 bg-white py-6 pl-3 ${
                        canRevealValue ? "pr-9" : "pr-2"
                    } text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 focus:border-gray-340 disabled:cursor-not-allowed disabled:bg-opacity-50`}
                    type={hiddenValue ? "password" : "text"}
                    value={currentValue}
                    {...props}
                />
            </label>
        </div>
    );
};

type VariableListProps = {
    variables: Variable[];
    title: string;
    actionButtonLabel: string;
    actionButtonIcon: React.ReactNode;
    disableActionButton?: boolean;
    canDeleteElements?: boolean;
    emptyVariablesLabel?: string;
    canRevealValues?: boolean;
    onActionClick?: () => void;
    onDeleteElement?: (variableId: string) => void;
};

export const VariableList = ({
    variables,
    title,
    actionButtonLabel,
    actionButtonIcon,
    disableActionButton = false,
    canDeleteElements = false,
    canRevealValues = true,
    emptyVariablesLabel = "Aún no tienes variables asignadas",
    onActionClick = () => null,
    onDeleteElement = () => null,
}: VariableListProps) => {
    const displayDeleteButton = useCallback(
        (variableId: string) => {
            return (
                canDeleteElements && (
                    <button className="flex h-4 w-4 items-center justify-center self-center rounded-full border-1 border-[#F95A59] p-4" onClick={() => onDeleteElement(variableId)}>
                        <TrashIcon fill="#F95A59" width="16" height="16" />
                    </button>
                )
            );
        },
        [canDeleteElements]
    );

    if (!variables.length) {
        return (
            <section className="flex flex-col">
                <header className="self-end">
                    <button
                        disabled={disableActionButton}
                        className="flex max-h-[30px] items-center gap-x-1 rounded-full border-1 border-primary-200 px-5 py-2 text-sm font-semibold text-primary-200 transition-all duration-200 hover:bg-primary-350 hover:text-[#009EAF] disabled:border-gray-34 disabled:text-gray-34"
                        onClick={onActionClick}
                    >
                        {actionButtonIcon}
                        {actionButtonLabel}
                    </button>
                </header>

                <div className="flex grow flex-col items-center justify-center gap-y-6">
                    <SettingsStorageIcon />
                    <h4 className="text-2xl font-bold leading-4">{emptyVariablesLabel}</h4>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-y-6">
            <header className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#374361]">{title}</h3>
                <button
                    disabled={disableActionButton}
                    className="flex max-h-[30px] items-center gap-x-1 rounded-full border-1 border-primary-200 px-5 py-2 text-sm font-semibold text-primary-200 transition-all duration-200 hover:bg-primary-350 hover:text-[#009EAF] disabled:border-gray-34 disabled:text-gray-34"
                    onClick={onActionClick}
                >
                    {actionButtonIcon}
                    {actionButtonLabel}
                </button>
            </header>
            <ul className="grid h-fit grid-cols-2 gap-x-10 gap-y-2 overflow-y-auto overflow-x-hidden">
                {variables.map((variable) => (
                    <li key={variable.id} className="flex h-fit gap-2">
                        <span className="w-full">
                            <TextInput name={variable.name} label="" value={variable.name} hasError="" placeholder="" defaultValue={variable.name} readOnly />
                        </span>
                        <TextHideInput
                            value={variable.value}
                            canRevealValue={canRevealValues}
                            initWithHiddenValue={variable.type === VariableType.Secret || variable.type === VariableType.System}
                            readOnly
                        />
                        {displayDeleteButton(String(variable.id))}
                    </li>
                ))}
            </ul>
        </section>
    );
};
