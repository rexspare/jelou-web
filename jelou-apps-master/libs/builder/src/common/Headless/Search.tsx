import { SearchIcon } from "@builder/Icons";

type SearchToolProps = {
    search: string;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
};

export const SearchTool = ({
    search,
    handleSearch,
    formClassName = "py-3 px-2 h-[3.75rem]",
    inputClassName = "placeholder:text-grey-75 placeholder:text-opacity-75 focus:outline-none border-none h-7 focus-within:ring-transparent",
    labelClassName = "flex items-center text-grey-75 border-1.5 border-grey-75 rounded-lg h-10 pl-4 gap-2 border-opacity-50 text-opacity-75 text-gray-400",
}: SearchToolProps): JSX.Element => {
    return (
        <form role="search" className={formClassName}>
            <label className={labelClassName}>
                <SearchIcon />
                <input autoFocus type="text" value={search} placeholder="Buscar" className={inputClassName} onChange={handleSearch} />
            </label>
        </form>
    );
};
