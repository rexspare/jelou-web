import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";

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
        const reportsFilters = result.map((item) => item.item);
        setSearchData(reportsFilters);
    };

    const resetData = () => {
        setSearchData(dataForSearch);
    };

    return { handleSearch, resetData, searchData };
}
