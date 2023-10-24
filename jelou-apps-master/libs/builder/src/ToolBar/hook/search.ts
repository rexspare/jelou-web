import Fuse from "fuse.js";
import { useEffect, useState } from "react";

const mapSearch = <T>(result: Fuse.FuseResult<T>[]) => result.map((ops) => ops.item);

type Search<T> = {
    search: string;
    searchResults: T[];
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useSearch<T>(list: T[], keys = ["text"]): Search<T> {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState(list);

    useEffect(() => {
        if (list.length === 0) return;
        setSearchResults(list);
    }, [list]);

    const jelouActionsFuse = new Fuse(list, {
        keys,
        threshold: 0.3,
    });

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearch(value);

        if (value === "") {
            setSearchResults(list);
            return;
        }

        const jelouActionsResult = jelouActionsFuse.search(value);

        setSearchResults(mapSearch<T>(jelouActionsResult));
    };

    return { search, searchResults, handleSearch };
}
