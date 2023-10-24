/**
 * It takes a name of a column and a list of filters, and returns a list of options for that column
 * @param {string} nameColumn - The name of the column you want to get the options for.
 * @param {object[]} filters - the filters object from the API response
 * @returns {object[]} An array of objects with the label and value properties.
 */
export const getOptionsKeyword = (nameColumn, filters) => {
    if (filters && filters.length <= 0) return [];

    const filter = filters.find((filter) => filter.name === nameColumn) || null;
    if (!filter) return [];

    return filter.options.map((option) => ({
        label: option.name,
        value: option.value,
    }));
};
