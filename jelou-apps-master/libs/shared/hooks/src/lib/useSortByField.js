export const useSortByField = ({ arrayToSort, sortBy, isAscending = true }) => {
  return arrayToSort.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (valueA < valueB) return isAscending ? -1 : 1;
      if (valueA > valueB) return isAscending ? 1 : -1;
      return 0;
  });
};
