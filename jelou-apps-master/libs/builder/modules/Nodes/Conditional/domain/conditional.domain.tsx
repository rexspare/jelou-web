import { CalendarIcon, ComputerIcon, EmailIcon, HastagIcon, IdentificationIcon, ImageIcon } from "@builder/Icons";
import {
    ContainIcon,
    EmptyIcon,
    EndsWithIcon,
    EqualToIcon,
    GraterThanIcon,
    GraterThanOrEqualIcon,
    LessThanOrEqualToIcon,
    NotContainIcon,
    NotEmptyIcon,
    // NotEndsWithIcon,
    NotEqualToIcon,
    NotStartsWithIcon,
    // RegexIcon,
    RegexMatchIcon,
    RegexNotMatchIcon,
    SmallerThanIcon,
    StartsWithIcon,
} from "@builder/Icons/Operations.Icons";
import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { BaseConfiguration } from "../../domain/nodes";

export enum ConditionalInputName {
    ConditionType = "type",
    Value1 = "value1",
    Value2 = "value2",
    Operator = "operator",
}

export enum ConditionalOperator {
    IS = "is",
    IS_NOT = "is_not",
    STARTS_ON = "starts_on",
    ENDS_ON = "ends_on",
    // BETWEEN = "between",
    // NOT_BETWEEN = "not_between",
    MAX = "max",
    MIN = "min",
    EQUAL = "equal",
    NOT_EQUAL = "not_equal",
    SMALLER = "smaller",
    SMALLER_EQUAL = "smaller_equal",
    LARGER = "larger",
    LARGER_EQUAL = "larger_equal",
    CONTAINS = "contains",
    NOT_CONTAINS = "not_contains",
    ENDS_WITH = "ends_with",
    NOT_ENDS_WITH = "not_ends_with",
    REGEX = "regex",
    REGEX_MATCH = "regex_match",
    REGEX_NOT_MATCH = "regex_not_match",
    STARTS_WITH = "starts_with",
    NOT_STARTS_WITH = "not_starts_with",
    IS_EMPTY = "is_empty",
    IS_NOT_EMPTY = "is_not_empty",
    STARTS_AFTER = "starts_after",
    ENDS_AFTER = "ends_after",
    IS_TRUE = "is_true",
    IS_FALSE = "is_false",
    GREATER_THAN = "greater_than",
    FUZZY = "fuzzy",
    GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
    LESS_THAN = "less_than",
    LESS_THAN_OR_EQUAL = "less_than_or_equal",
}

export enum OptionFilterName {
    NUMBER = "number",
    EMAIL = "email",
    CE = "legal_id",
    URL = "url",
    DATE = "date",
    IMAGE = "image",
    RUC = "ruc",
    // LOCATION = "location",
}

export const CONDITIONAL_FILTER_OPTIONS: ListBoxElement<ConditionalOperator>[] = [
    { id: ConditionalOperator.IS, value: ConditionalOperator.IS, name: "Es" },
    { id: ConditionalOperator.IS_NOT, value: ConditionalOperator.IS_NOT, name: "No es" },
    // { id: ConditionalOperator.STARTS_ON, value: ConditionalOperator.STARTS_ON, name: "Empieza el" },
    // { id: ConditionalOperator.ENDS_ON, value: ConditionalOperator.ENDS_ON, name: "Termina el" },
    // { id: ConditionalOperator.MAX, value: ConditionalOperator.MAX, name: "Máximo" },
    // { id: ConditionalOperator.MIN, value: ConditionalOperator.MIN, name: "Mínimo" },
    { id: ConditionalOperator.EQUAL, value: ConditionalOperator.EQUAL, name: "Igual" },
    { id: ConditionalOperator.NOT_EQUAL, value: ConditionalOperator.NOT_EQUAL, name: "No igual" },
    { id: ConditionalOperator.SMALLER, value: ConditionalOperator.SMALLER, name: "Menor" },
    { id: ConditionalOperator.SMALLER_EQUAL, value: ConditionalOperator.SMALLER_EQUAL, name: "Menor o igual" },
    { id: ConditionalOperator.LARGER, value: ConditionalOperator.LARGER, name: "Mayor" },
    { id: ConditionalOperator.LARGER_EQUAL, value: ConditionalOperator.LARGER_EQUAL, name: "Mayor o igual" },
    { id: ConditionalOperator.CONTAINS, value: ConditionalOperator.CONTAINS, name: "Contiene" },
    { id: ConditionalOperator.NOT_CONTAINS, value: ConditionalOperator.NOT_CONTAINS, name: "No contiene" },
    { id: ConditionalOperator.ENDS_WITH, value: ConditionalOperator.ENDS_WITH, name: "Termina con" },
    // { id: ConditionalOperator.NOT_ENDS_WITH, value: ConditionalOperator.NOT_ENDS_WITH, name: "No termina con" },
    { id: ConditionalOperator.REGEX_MATCH, value: ConditionalOperator.REGEX_MATCH, name: "Regex match" },
    { id: ConditionalOperator.REGEX_NOT_MATCH, value: ConditionalOperator.REGEX_NOT_MATCH, name: "Regex not match" },
    { id: ConditionalOperator.STARTS_WITH, value: ConditionalOperator.STARTS_WITH, name: "Empieza con" },
    { id: ConditionalOperator.NOT_STARTS_WITH, value: ConditionalOperator.NOT_STARTS_WITH, name: "No empieza con" },
    { id: ConditionalOperator.IS_EMPTY, value: ConditionalOperator.IS_EMPTY, name: "Vacio" },
    { id: ConditionalOperator.IS_NOT_EMPTY, value: ConditionalOperator.IS_NOT_EMPTY, name: "No vacio" },
];

export const DATUM_FILTER_OPTIONS: ListBoxElement<ConditionalOperator>[] = [
    // { id: ConditionalOperator.BETWEEN, value: ConditionalOperator.BETWEEN, name: "Está entre" },
    { id: ConditionalOperator.CONTAINS, value: ConditionalOperator.CONTAINS, name: "Contiene" },
    { id: ConditionalOperator.ENDS_AFTER, value: ConditionalOperator.ENDS_AFTER, name: "Finaliza después de" },
    { id: ConditionalOperator.ENDS_ON, value: ConditionalOperator.ENDS_ON, name: "Finaliza el" },
    { id: ConditionalOperator.ENDS_WITH, value: ConditionalOperator.ENDS_WITH, name: "Termina con" },
    { id: ConditionalOperator.EQUAL, value: ConditionalOperator.EQUAL, name: "Igual" },
    { id: ConditionalOperator.FUZZY, value: ConditionalOperator.FUZZY, name: "Fussy" },
    { id: ConditionalOperator.GREATER_THAN, value: ConditionalOperator.GREATER_THAN, name: "Mayor que" },
    { id: ConditionalOperator.GREATER_THAN_OR_EQUAL, value: ConditionalOperator.GREATER_THAN_OR_EQUAL, name: "Mayor o igual que" },
    { id: ConditionalOperator.IS_EMPTY, value: ConditionalOperator.IS_EMPTY, name: "Vacio" },
    { id: ConditionalOperator.IS_FALSE, value: ConditionalOperator.IS_FALSE, name: "Es falso" },
    { id: ConditionalOperator.IS_NOT_EMPTY, value: ConditionalOperator.IS_NOT_EMPTY, name: "No vacio" },
    { id: ConditionalOperator.IS_TRUE, value: ConditionalOperator.IS_TRUE, name: "Es verdadero" },
    { id: ConditionalOperator.LESS_THAN, value: ConditionalOperator.LESS_THAN, name: "Menor que" },
    { id: ConditionalOperator.LESS_THAN_OR_EQUAL, value: ConditionalOperator.LESS_THAN_OR_EQUAL, name: "Menor o igual que" },
    // { id: ConditionalOperator.NOT_BETWEEN, value: ConditionalOperator.NOT_BETWEEN, name: "No está entre" },
    { id: ConditionalOperator.NOT_CONTAINS, value: ConditionalOperator.NOT_CONTAINS, name: "No contiene" },
    { id: ConditionalOperator.NOT_ENDS_WITH, value: ConditionalOperator.NOT_ENDS_WITH, name: "No termina con" },
    { id: ConditionalOperator.NOT_EQUAL, value: ConditionalOperator.NOT_EQUAL, name: "No igual" },
    { id: ConditionalOperator.NOT_STARTS_WITH, value: ConditionalOperator.NOT_STARTS_WITH, name: "No empieza con" },
    { id: ConditionalOperator.REGEX_MATCH, value: ConditionalOperator.REGEX_MATCH, name: "Regex match" },
    { id: ConditionalOperator.REGEX_NOT_MATCH, value: ConditionalOperator.REGEX_NOT_MATCH, name: "Regex not match" },
    { id: ConditionalOperator.STARTS_AFTER, value: ConditionalOperator.STARTS_AFTER, name: "Comienza después de" },
    { id: ConditionalOperator.STARTS_ON, value: ConditionalOperator.STARTS_ON, name: "Comienza el" },
    { id: ConditionalOperator.STARTS_WITH, value: ConditionalOperator.STARTS_WITH, name: "Empieza con" },
];

export const CONDITIONAL_FILTER_OPTIONS_NAMES: ListBoxElement<OptionFilterName>[] = [
    { id: OptionFilterName.NUMBER, value: OptionFilterName.NUMBER, name: "Número", Icon: () => <HastagIcon /> },
    { id: OptionFilterName.EMAIL, value: OptionFilterName.EMAIL, name: "Email", Icon: () => <EmailIcon /> },
    { id: OptionFilterName.CE, value: OptionFilterName.CE, name: "Cédula", Icon: () => <IdentificationIcon /> },
    { id: OptionFilterName.URL, value: OptionFilterName.URL, name: "Url", Icon: () => <ComputerIcon /> },
    { id: OptionFilterName.DATE, value: OptionFilterName.DATE, name: "Fecha", Icon: () => <CalendarIcon /> },
    { id: OptionFilterName.IMAGE, value: OptionFilterName.IMAGE, name: "Imagen", Icon: () => <ImageIcon /> },
    { id: OptionFilterName.RUC, value: OptionFilterName.RUC, name: "RUC", Icon: () => <ComputerIcon /> },
    // { id: OptionFilterName.LOCATION, value: OptionFilterName.LOCATION, name: "Ubicación", Icon: () => <LocationIcon height={24} width={24} /> },
];

type Icon = ({ width, height, color }: { width?: number; height?: number; color?: string }) => JSX.Element;

export const ConditionalIconsByOperator: Record<string, Icon> = {
    [ConditionalOperator.IS]: EqualToIcon,
    [ConditionalOperator.IS_NOT]: NotEqualToIcon,
    // [ConditionalOperator.STARTS_ON]: ContainIcon,
    // [ConditionalOperator.ENDS_ON]: ContainIcon,
    // [ConditionalOperator.BETWEEN]: ContainIcon,
    // [ConditionalOperator.NOT_BETWEEN]: ContainIcon,
    // [ConditionalOperator.MAX]: ContainIcon,
    // [ConditionalOperator.MIN]: ContainIcon,
    [ConditionalOperator.CONTAINS]: ContainIcon,
    [ConditionalOperator.NOT_CONTAINS]: NotContainIcon,
    [ConditionalOperator.EQUAL]: EqualToIcon,
    [ConditionalOperator.NOT_EQUAL]: NotEqualToIcon,
    [ConditionalOperator.LARGER]: GraterThanIcon,
    [ConditionalOperator.LARGER_EQUAL]: GraterThanOrEqualIcon,
    [ConditionalOperator.SMALLER]: SmallerThanIcon,
    [ConditionalOperator.SMALLER_EQUAL]: LessThanOrEqualToIcon,
    [ConditionalOperator.STARTS_WITH]: StartsWithIcon,
    [ConditionalOperator.NOT_STARTS_WITH]: NotStartsWithIcon,
    [ConditionalOperator.ENDS_WITH]: EndsWithIcon,
    // [ConditionalOperator.NOT_ENDS_WITH]: NotEndsWithIcon,
    [ConditionalOperator.REGEX_MATCH]: RegexMatchIcon,
    [ConditionalOperator.REGEX_NOT_MATCH]: RegexNotMatchIcon,
    // [ConditionalOperator.REGEX]: RegexIcon,
    [ConditionalOperator.IS_EMPTY]: EmptyIcon,
    [ConditionalOperator.IS_NOT_EMPTY]: NotEmptyIcon,
};

// export type ConditionalTermType = string;

export type ConditionalTerm = {
    id: string;
    type?: OptionFilterName;
    value1: string | number;
    value2: string | number;
    operator: ConditionalOperator;
};

export type Condition = {
    id: string;
    name: string;
    terms: ConditionalTerm[];
    conditionPanelCollapsed: boolean;
};

export interface ConditionNode {
    configuration: BaseConfiguration & {
        conditions: Condition[];
    };
}
