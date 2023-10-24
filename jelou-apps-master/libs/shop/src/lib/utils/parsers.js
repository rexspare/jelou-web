import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

/**
 * It takes a filter object and returns a query string
 * @param [selected] - the selected object from the filter
 */
export const parserObjFilter = (selected = {}) => {
    // the selected has the following structure:
    //  value: {
    //         filters: [
    //             {
    //                 field: "has_tax",
    //                 operator: "=",
    //                 value: 0,
    //             },
    //         ],
    //     },

    if (selected === null || isEqual(selected, {})) return {};

    const params = {};

    Object.values(selected).forEach((filter) => {
        Object.entries(filter).forEach(([key, value]) => {
            params[key] = params[key] ? [...params[key], ...value] : value;
        });
    });

    return params;
};

/**
 * It takes an array of categories and returns an array of objects with the label and value properties
 * @param {object[]} categories - The categories that are passed in from the parent component.
 * @returns {{label: string, value: any}} An array of objects with the label and value properties.
 */
export const parseDefaultCategories = (categories) => {
    if (isEmpty(categories)) return [];

    return categories.map((category) => ({ label: category.name, value: category.id }));
};

/**
 * Find the option that matches the value, or return null if no option matches.
 * @param value - The value of the selected option.
 * @param {Object[]} options - An array of objects that contain the value and label for each option.
 * @returns the value of the option that matches the value passed in.
 */
export const findDefaultValue = (value, options) => {
    return options.find((option) => option.value === value) || null;
};
