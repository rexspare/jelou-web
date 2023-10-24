import { DatumQuery, QueryInputName } from "@builder/modules/Nodes/Datum/domain/datum.domain";

import { SpinnerIcon } from "@builder/Icons";
import { ConditionalTermForm } from "@builder/Nodes/Conditional/ConditionalTermForm";
import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TextInput } from "@builder/common/inputs";
import { ConditionalOperator, DATUM_FILTER_OPTIONS } from "@builder/modules/Nodes/Conditional/domain/conditional.domain";
import { useDatumNode } from "@builder/modules/Nodes/Datum/infrastructure/datumNode.hook";
import { useRef, useState } from "react";

type Props = {
    nodeId: string;
    databaseId?: number;
    query?: DatumQuery[];
    variable?: string;
};

export function SearchActionDatum({ databaseId, nodeId, query, variable }: Props) {
    const { dbColums, isLoading, handleAddNewQuery, handleDeleteQuery, handleUpdateVariable } = useDatumNode({ nodeId, databaseId });

    return (
        <div className="h-[calc(100vh-20rem)] overflow-y-scroll">
            <Switch>
                <Switch.Case condition={isLoading}>
                    <div className="flex h-20 items-center justify-center text-primary-200">
                        <SpinnerIcon />
                    </div>
                </Switch.Case>
                <Switch.Case condition={dbColums.length > 0}>
                    <>
                        <div className="mb-3 flex flex-col gap-y-4 border-b-1 border-gray-230 p-[1rem]">
                            <p>Ingresa las reglas que desea aplicar al registro</p>
                            {query &&
                                query.map((term, index) => (
                                    <QueryItem key={term.id} nodeId={nodeId} index={index} query={term} onDelete={(termId) => handleDeleteQuery(termId)} dbColumns={dbColums} />
                                ))}

                            <footer>
                                <button onClick={() => handleAddNewQuery()} className="font-semibold text-primary-200">
                                    + Agregar regla
                                </button>
                            </footer>
                        </div>
                        <div className="p-3">
                            <TextInput
                                onChange={handleUpdateVariable}
                                name="variable"
                                labelClassName="mb-1 text-xs font-semibold block"
                                label="Ingresa el nombre con el que guardarás este nuevo resultado"
                                defaultValue={variable}
                                placeholder="Ingresa {{}} para agregar variables"
                            />
                        </div>
                    </>
                </Switch.Case>
            </Switch>
        </div>
    );
}

type QueryItemProps = {
    query: DatumQuery;
    nodeId: string;
    index: number;
    onDelete: (termId: string) => void;
    dbColumns: ListBoxElement<string>[];
};

const HIDDEN_SECOND_INPUT = [ConditionalOperator.IS_EMPTY, ConditionalOperator.IS_NOT_EMPTY, ConditionalOperator.IS_FALSE, ConditionalOperator.IS_TRUE];

function QueryItem({ query, nodeId, index, onDelete = () => null, dbColumns }: QueryItemProps) {
    const { handleUpdateQuery } = useDatumNode({ nodeId });

    const term = query;
    const formDataRef = useRef<HTMLFormElement>({} as HTMLFormElement);

    const [isOperatorEmptyOrNotEmpty, setIsOperatorEmptyOrNotEmpty] = useState<boolean>(HIDDEN_SECOND_INPUT.includes(term?.operator as ConditionalOperator));

    const isFirstTerm = index === 0;
    const initialValue = dbColumns.find((option) => option.value === query.field);

    const initialOperator = DATUM_FILTER_OPTIONS.find((option) => option.value === query.operator) as ListBoxElement<ConditionalOperator>;

    return (
        <ConditionalTermForm
            key={term.id}
            term={{ id: term.id, value1: term.field, value2: term.value, filter: term.operator }}
            formDataRef={formDataRef}
            firstInput={{
                listProps: {
                    list: dbColumns,
                    label: isFirstTerm ? "Columna" : "",
                    value: initialValue,
                    placeholder: "Selecciona una columna",
                    name: QueryInputName.Field,
                    setValue: (evt: ListBoxElement) => {
                        handleUpdateQuery(term.id, QueryInputName.Field, evt.value);
                    },
                },
                showColumns: true,
            }}
            secondInput={{
                showInput: !isOperatorEmptyOrNotEmpty,
                showInputSelector: false,
                inputProps: {
                    labelClassName: "",
                    label: isFirstTerm ? "Valor" : "",
                    placeholder: "Selecciona un valor",
                    defaultValue: term.value,
                    name: QueryInputName.Value,
                    onChange: (evt) => {
                        handleUpdateQuery(term.id, QueryInputName.Value, evt.target.value);
                    },
                },
            }}
            filterInput={{
                list: DATUM_FILTER_OPTIONS,
                label: isFirstTerm ? "Filtro/Regla" : "",
                value: initialOperator,
                placeholder: "Selecciona un filtro",
                name: QueryInputName.Operator,

                setValue: (evt: ListBoxElement) => {
                    handleUpdateQuery(term.id, QueryInputName.Operator, evt.value);
                    setIsOperatorEmptyOrNotEmpty(HIDDEN_SECOND_INPUT.includes(evt.value as ConditionalOperator));
                },
            }}
            onDelete={(termId) => onDelete(termId)}
        />
    );
}
