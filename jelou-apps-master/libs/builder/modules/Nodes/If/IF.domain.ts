import { BaseConfiguration } from "../domain/nodes";

export type IF = {
    configuration: BaseConfiguration & {
        terms: Term[];
        operator: Operator;
    };
};

export type OperatorsTerms = "equal" | "not_equal" | "smaller" | "smaller_equal" | "larger" | "larger_equal" | "is_empty" | "contains" | "not_contains" | "regex";

export type TermType = "number" | "string" | "boolean";
export type Operator = "and" | "or";

export type Term = {
    id: string;
    type: TermType;
    value1: string | number;
    operator: OperatorsTerms;
    value2: string | number;
};

export const EMPTY_OR_NOT_OPERATORS = {
    EMPTY: "is_empty",
    NOT_EMPTY: "is_not_empty",
};
