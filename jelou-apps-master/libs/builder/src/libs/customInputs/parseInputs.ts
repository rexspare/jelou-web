/**
 * Get the custom inputs with the give `regex`
 */
export function getCustomInputs<T extends Record<string, any>, K extends keyof T>(data: T, regex: RegExp, desiredDeepFields: Array<K> = []) {
    const matchedValues: string[] = [];

    if (desiredDeepFields.length) {
        desiredDeepFields.forEach((field) => {
            const values = getValuesFromObjectOrArray<string>(data[field]);
            const deepestValues = getValuesFromDeepArray<string>(values, regex);
            matchedValues.push(...deepestValues, ...getMatchedInputs(values, regex));
        });
    }

    const values = getValuesFromObjectOrArray(data);
    matchedValues.push(...getMatchedInputs(values, regex));

    return Array.from(new Set(matchedValues));
};

function getValuesFromDeepArray<T = string | object>(values: Array<T>, regex: RegExp) {
    const matchedValues: string[] = [];

    for (const value of values) {
        if (typeof value === "object" && value !== null) {
            matchedValues.push(...getMatchedInputs(getValuesFromObjectOrArray(value), regex));
        }
    }

    return matchedValues;
};

function getValuesFromObjectOrArray<T = string | object>(data: Array<T> | object): Array<T> {
    return (Array.isArray(data) ? data : Object.values(data))
};

export function getMatchedInputs<T = string>(values: Array<T>, regex: RegExp) {
    const matchedValues: string[] = [];

    values.forEach((value) => {
        if (typeof value !== "string") return;

        const matches = matchValueWithRegex(value, regex);
        if (matches?.length) matchedValues.push(...parseMatchedValues(matches));
    });

    return matchedValues;
};

export const matchValueWithRegex = (value: string, regex: RegExp) => value.match(regex);

export const parseMatchedValues = (matches: Array<string>) => {
    return [...matches.map((match) => match.slice(9, -2))];
};
