import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { useSortByField } from "./useSortByField";

export function useSearchData({ dataForSearch = [], keysForSearch = [] } = {}) {
    const [searchData, setSearchData] = useState([]);
    const fuse = useRef(null);

    useEffect(() => {
        if (dataForSearch && dataForSearch.length === 0) return;

        fuse.current = new Fuse(dataForSearch, { keys: keysForSearch, threshold: 0.3 });
        setSearchData(dataForSearch);
    }, [dataForSearch]);

    const handleSearch = (evt) => {
        const { value= "" } = evt?.target || {}

        if (value.length === 0) return setSearchData(dataForSearch);

        const result = fuse.current?.search(value);
        const reportsFilters = result?.map((item) => item?.item);
        setSearchData(reportsFilters);
    };

    const resetData = () => {
        setSearchData(dataForSearch);
    };

    const sortBySearch = (item, isAscending) => {
      const sortedArray = useSortByField({
        arrayToSort: searchData,
        sortBy: item,
        isAscending: !isAscending
      });
      setSearchData(sortedArray);
    }

    return { handleSearch, resetData, searchData, sortBySearch };
}
