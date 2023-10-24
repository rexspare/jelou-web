import { DebounceInput } from "react-debounce-input";
import { useLocation } from "react-router-dom";

import { BlocksCardIcon, ListCardIcon, SearchIcon } from "@apps/shared/icons";
import { CreateDatabase } from "../Databases/Commponent/CreateDatabase";

export function SearchAndLayout({
    handleActiveBlockView,
    handleActiveListView,
    handleSearch,
    isBlockViewActive,
    isListViewActive,
    path,
    placeholder,
    isDatabasesTab = false,
}) {
    const { pathname } = useLocation();

    return (
        <div className="flex justify-end gap-3">
            {pathname === path && (
                <>
                    {isDatabasesTab && <CreateDatabase />}
                    <div className="relative flex items-center overflow-hidden rounded-full h-9">
                        <div className="absolute top-0 bottom-0 left-0 flex items-center ml-4">
                            <SearchIcon className="fill-current" width="1rem" height="1rem" />
                        </div>

                        <DebounceInput
                            type="search"
                            className="text-sm text-gray-500 border-transparent rounded-full pl-14 ring-transparent focus:border-transparent focus:ring-transparent"
                            minLength={2}
                            onChange={handleSearch}
                            debounceTimeout={500}
                            placeholder={placeholder}
                            autoFocus
                        />
                    </div>
                    <button onClick={handleActiveBlockView}>
                        <BlocksCardIcon isActive={isBlockViewActive} />
                    </button>
                    <button onClick={handleActiveListView}>
                        <ListCardIcon isActive={isListViewActive} />
                    </button>
                </>
            )}
        </div>
    );
}
