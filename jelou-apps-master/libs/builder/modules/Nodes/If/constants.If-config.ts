export enum NAMES_IF_INPUTS {
  CONDITION_TYPE= 'type',
  VALUE_1= 'value1',
  VALUE_2= 'value2',
  OPERATOR= 'operator'
}

export enum CONDITIONS_TYPE {
  NUMBER= 'number',
  STRING= 'string',
  BOOLEAN= 'boolean'
}

export const OPTIONS_CONDITION_TYPE = [
  { value: CONDITIONS_TYPE.NUMBER, label: 'Número' },
  { value: CONDITIONS_TYPE.STRING, label: 'String' },
  { value: CONDITIONS_TYPE.BOOLEAN, label: 'Booleano' }
]

export enum IF_OPERATORS_NAMES {
  EQUAL= 'equal',
  NOT_EQUAL= 'not_equal',
  SMALLER= 'smaller',
  SMALLER_EQUAL= 'smaller_equal',
  LARGER= 'larger',
  LARGER_EQUAL= 'larger_equal',
  CONTAINS= 'contains',
  NOT_CONTAINS= 'not_contains',
  ENDS_WITH= 'ends_with',
  NOT_ENDS_WITH= 'not_ends_with',
  REGEX= 'regex',
  REGEX_MATCH= 'regex_match',
  REGEX_NOT_MATCH= 'regex_not_match',
  STARTS_WITH= 'starts_with',
  NOT_STARTS_WITH= 'not_starts_with',
  IS_EMPTY= 'is_empty',
  IS_NOT_EMPTY= 'is_not_empty'
}

export const OPTIONS_OPERATOR = {
  [CONDITIONS_TYPE.BOOLEAN]: [
    { value: IF_OPERATORS_NAMES.EQUAL, label: 'Igual' },
    { value: IF_OPERATORS_NAMES.NOT_EQUAL, label: 'No igual' }
  ],
  [CONDITIONS_TYPE.NUMBER]: [
    { value: IF_OPERATORS_NAMES.SMALLER, label: 'Menor' },
    { value: IF_OPERATORS_NAMES.SMALLER_EQUAL, label: 'Menor o igual' },
    { value: IF_OPERATORS_NAMES.EQUAL, label: 'Igual' },
    { value: IF_OPERATORS_NAMES.NOT_EQUAL, label: 'No igual' },
    { value: IF_OPERATORS_NAMES.LARGER, label: 'Mayor' },
    { value: IF_OPERATORS_NAMES.LARGER_EQUAL, label: 'Mayor o igual' }
  ],
  [CONDITIONS_TYPE.STRING]: [
    { value: IF_OPERATORS_NAMES.EQUAL, label: 'Igual' },
    { value: IF_OPERATORS_NAMES.NOT_EQUAL, label: 'No igual' },
    { value: IF_OPERATORS_NAMES.CONTAINS, label: 'Contiene' },
    { value: IF_OPERATORS_NAMES.NOT_CONTAINS, label: 'No contiene' },
    { value: IF_OPERATORS_NAMES.ENDS_WITH, label: 'Termina con' },
    { value: IF_OPERATORS_NAMES.NOT_ENDS_WITH, label: 'No termina con' },
    { value: IF_OPERATORS_NAMES.REGEX, label: 'Regex' },
    { value: IF_OPERATORS_NAMES.REGEX_MATCH, label: 'Regex match' },
    { value: IF_OPERATORS_NAMES.REGEX_NOT_MATCH, label: 'Regex not match' },
    { value: IF_OPERATORS_NAMES.STARTS_WITH, label: 'Empieza con' },
    { value: IF_OPERATORS_NAMES.NOT_STARTS_WITH, label: 'No empieza con' },
    { value: IF_OPERATORS_NAMES.IS_EMPTY, label: 'Vacio' },
    { value: IF_OPERATORS_NAMES.IS_NOT_EMPTY, label: 'No vacio' }
  ]
}
export enum OPERATOR_ALL_COMBINATION {
  AND= 'and',
  OR= 'or'
}
export const COMBINATIONS_OPTIONS = [
  { value: OPERATOR_ALL_COMBINATION.AND, label: 'Todos' },
  { value: OPERATOR_ALL_COMBINATION.OR, label: 'Cualquiera' }
]

export enum COMBINATION_COMMENT {
  and= 'Solo si todas las condiciones se cumplen',
  or= 'Solo si alguna de las condiciones se cumple'
}
