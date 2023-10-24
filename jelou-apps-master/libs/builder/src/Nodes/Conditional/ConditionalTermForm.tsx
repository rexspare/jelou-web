import isEmpty from "lodash/isEmpty";
import { Ref } from "react";

import { TrashDelete } from "@builder/Icons";
import { ListBoxHeadless, ListBoxHeadlessProps } from "@builder/common/Headless/Listbox/Listbox";
import { InputTextPorps, TextInput } from "@builder/common/inputs/Text.Input";

type ExtendedInputTextPorps<T = string> = InputTextPorps & {
    listProps?: ListBoxHeadlessProps<T>;
    showColumns?: boolean;
};

type SecondTermProps<T = string> = {
    showInput?: boolean;
    showInputSelector?: boolean;
    inputProps?: InputTextPorps;
    listProps?: ListBoxHeadlessProps<T>;
};

type ConditionalTermProps = {
    term: { id: string; value1: string | number; value2: string | number; filter: string };
    firstInput: ExtendedInputTextPorps;
    secondInput: SecondTermProps;
    filterInput: ListBoxHeadlessProps<string>;
    formDataRef?: Ref<HTMLFormElement>;
    initialText?: string;
    onDelete?: (termId: string) => void;
};

export function ConditionalTermForm({
    term,
    initialText,
    firstInput = { showColumns: false },
    secondInput = { showInput: false, showInputSelector: false },
    filterInput,
    formDataRef,
    onDelete = () => null,
}: ConditionalTermProps) {
    const initialValue = firstInput.listProps?.list.find((option) => option.value === term.value1);
    const initialValue2 = secondInput.listProps?.list.find((option) => option.value === term.value2);

    const FirstInputValueElement = firstInput.showColumns ? <ListBoxHeadless {...(firstInput.listProps as ListBoxHeadlessProps<string>)} value={initialValue} /> : <TextInput {...firstInput} />;

    const InputValueElement = secondInput.showInputSelector ? (
        <ListBoxHeadless {...(secondInput.listProps as ListBoxHeadlessProps<string>)} value={initialValue2} />
    ) : (
        <TextInput {...secondInput.inputProps} />
    );

    return (
        <section className="flex items-center gap-x-2">
            <form ref={formDataRef} className="flex w-full gap-x-2">
                {!isEmpty(initialText) && <p className="mb-3 flex h-6 w-8 items-center justify-center self-end rounded-md bg-gray-325 p-2 text-sm text-[#727C94]">{initialText}</p>}
                <div className="w-full">{FirstInputValueElement}</div>
                <div className="w-full">
                    <ListBoxHeadless {...filterInput} />
                </div>
                {secondInput.showInput && <div className="w-full">{InputValueElement}</div>}
            </form>
            <button className="self-end mb-3 text-semantic-error" onClick={() => onDelete(term.id)}>
                <TrashDelete width={24} />
            </button>
        </section>
    );
}
