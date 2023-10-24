export type Option<T = string> = {
    label: string;
    value: T;
};

export type InputNumberProps = {
    disabled?: boolean;
    value?: string;
    defaultValue: string | undefined;
    onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    labelClassName: string;
    className?: string;
    hasError: string | null;
    label: string;
    name: string;
    placeholder: string;
};

export type CheckboxProps = {
    // className?: string;
    // disabled?: boolean;
    hasError?: string | null;
    // onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // name: string;
    // value?: boolean;
    label?: string;
    // defaultChecked?: boolean;
    labelClassName?: string;
};

export type SelectorInputProps = {
    hasError?: string | undefined;
    label?: string | JSX.Element;
    name: string;
    placeholder: string | JSX.Element;
    options: Option[];
    defaultValue?: null | string | string[];
    disabled?: boolean;
    onChange?: (valueSelected: Option<any>) => void | undefined;
    value?: Option | Option[] | string | undefined | null;
    isSearchable?: boolean;
    inline?: boolean;
    color?: string;
    isControlled?: boolean;
    labelClassName?: string;
    selectorRef?: React.RefObject<any>;
};
