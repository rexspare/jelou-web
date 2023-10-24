import { ArrowIcon, CloseIcon } from "@builder/Icons";
import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { TextInput } from "@builder/common/inputs";
import {
    CONDITIONAL_FILTER_OPTIONS,
    CONDITIONAL_FILTER_OPTIONS_NAMES,
    Condition,
    ConditionalInputName,
    ConditionalOperator,
    ConditionalTerm,
} from "@builder/modules/Nodes/Conditional/domain/conditional.domain";
import { ConditionConfiguration } from "@builder/modules/Nodes/Conditional/infrastructure/ConditionalConfig";
import { useConditionalConfig } from "@builder/modules/Nodes/Conditional/infrastructure/config.hook";
import { ConditionalTermForm } from "./ConditionalTermForm";
import { useConditionalTermForm } from "./conditional-form.hook";

type Props = {
    nodeId: string;
};

export const ConditionalConfig = ({ nodeId }: Props) => {
    const { conditions, handleAddNewCondition, handleAddNewTerm, handleChangeConditionName, handleCollapsedCondition, handleDeleteCondition, handleDeleteTerm } = useConditionalConfig({ nodeId });

    return (
        <main className="flex h-[90%] flex-col gap-y-4 overflow-y-auto border-t-1 border-gray-230 py-4 px-6 text-gray-400">
            {conditions &&
                conditions
                    .filter((condition) => condition.id !== ConditionConfiguration.defaultCondition)
                    .map((condition, index) => {
                        const { terms = [], conditionPanelCollapsed } = condition;

                        return (
                            <div key={condition.id} className="flex flex-col rounded-12 border-1 border-[#DCDEE4]">
                                <header className={`flex justify-between gap-x-2 ${!conditionPanelCollapsed && "border-b-1"} border-[#DCDEE4] p-[1rem]`}>
                                    <p className="flex items-center cursor-pointer w-fit gap-x-2" onClick={() => handleCollapsedCondition(condition)}>
                                        <ArrowIcon className={`${!conditionPanelCollapsed && "-rotate-180"} transition-all duration-200 ease-linear`} height={16} width={16} />
                                    </p>

                                    <div className="w-full">
                                        <TextInput
                                            label="Nombre de la condición"
                                            inline
                                            placeholder="Escribe nombre de la condición"
                                            hasError=""
                                            defaultValue={condition.name}
                                            labelClassName="font-bold text-gray-610 whitespace-nowrap"
                                            onChange={(event) => handleChangeConditionName(condition, event.currentTarget.value)}
                                        />
                                    </div>

                                    <button className="" onClick={() => handleDeleteCondition(condition.id)}>
                                        <CloseIcon width={16} height={16} />
                                    </button>
                                </header>

                                {!conditionPanelCollapsed && (
                                    <div className="flex flex-col gap-y-4 p-[1rem]">
                                        <p>Ingresa las reglas que desea aplicar al registro</p>
                                        {terms &&
                                            terms.map((term, index) => (
                                                <ConditionItem
                                                    key={term.id}
                                                    nodeId={nodeId}
                                                    index={index}
                                                    term={term}
                                                    condition={condition}
                                                    onDelete={(termId) => handleDeleteTerm(condition, termId)}
                                                />
                                            ))}

                                        <footer>
                                            <button onClick={() => handleAddNewTerm(condition)} className="font-semibold text-primary-200">
                                                + Agregar regla
                                            </button>
                                        </footer>
                                    </div>
                                )}
                            </div>
                        );
                    })}

            <footer>
                <button className="flex items-center justify-center h-8 px-3 py-2 font-semibold rounded-full border-1 border-primary-200 text-primary-200" onClick={handleAddNewCondition}>
                    + Nuevo camino
                </button>
            </footer>
        </main>
    );
};

type ConditionItemProps = {
    term: ConditionalTerm;
    condition: Condition;
    nodeId: string;
    index: number;
    onDelete: (termId: string) => void;
};

function ConditionItem({ term, nodeId, condition, index, onDelete = () => null }: ConditionItemProps) {
    const { formDataRef, handleChange, handleChangeText, isOperatorEmptyOrNotEmpty, showOperatorInputSelector } = useConditionalTermForm({ nodeId, term });

    const isFirstTerm = index === 0;
    const initialValue2 = CONDITIONAL_FILTER_OPTIONS_NAMES.find((option) => option.value === term.value2);
    const initialOperator = CONDITIONAL_FILTER_OPTIONS.find((option) => option.value === term.operator) as ListBoxElement<ConditionalOperator>;

    return (
        <ConditionalTermForm
            key={term.id}
            term={{ ...term, filter: term.operator }}
            formDataRef={formDataRef}
            firstInput={{
                labelClassName: "mb-1 block font-medium leading-5",
                label: isFirstTerm ? "Variable" : "",
                placeholder: "Escoge una variable",
                defaultValue: term.value1,
                name: ConditionalInputName.Value1,
                onChange: handleChangeText(condition, term.id, ConditionalInputName.Value1),
            }}
            secondInput={{
                showInput: !isOperatorEmptyOrNotEmpty,
                showInputSelector: showOperatorInputSelector,
                inputProps: {
                    labelClassName: "mb-1 block font-medium leading-5",
                    label: isFirstTerm ? "Valor" : "",
                    placeholder: "Selecciona un valor",
                    defaultValue: term.value2,
                    name: ConditionalInputName.Value2,
                    onChange: handleChangeText(condition, term.id, ConditionalInputName.Value2),
                },
                listProps: {
                    list: CONDITIONAL_FILTER_OPTIONS_NAMES,
                    label: isFirstTerm ? "Valor" : "",
                    value: initialValue2,
                    placeholder: "Selecciona un valor",
                    name: ConditionalInputName.Value2,
                    setValue: handleChange(condition, term.id, ConditionalInputName.Value2),
                },
            }}
            filterInput={{
                slideover: true,
                list: ConditionConfiguration.sortConditionalOperatorsAlphabetically(CONDITIONAL_FILTER_OPTIONS),
                label: isFirstTerm ? "Filtro" : "",
                value: initialOperator,
                placeholder: "Selecciona un filtro",
                name: ConditionalInputName.Operator,
                setValue: handleChange(condition, term.id, ConditionalInputName.Operator),
            }}
            onDelete={(termId) => onDelete(termId)}
        />
    );
}
