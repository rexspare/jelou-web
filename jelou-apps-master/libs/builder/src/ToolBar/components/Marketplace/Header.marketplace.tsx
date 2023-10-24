import { CloseIcon } from "@builder/Icons";
import { SearchTool } from "@builder/common/Headless/Search";

type HeaderMarkertPlaceProps = {
    onClose: () => void;
    search: string;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function HeaderMarkertPlace({ handleSearch, onClose, search }: HeaderMarkertPlaceProps) {
    return (
        <>
            <div className="flex w-full items-center justify-end pt-5 pr-5 text-primary-200">
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <div className="mt-2 flex items-center">
                <h3 className="w-[17.8rem] text-base font-semibold text-gray-400">Descubre tools</h3>
                <SearchTool
                    formClassName="py-3 px-4 h-[3.75rem] w-full"
                    handleSearch={handleSearch}
                    search={search}
                    labelClassName="flex items-center text-grey-75 border-1 border-grey-34 rounded-lg h-9 pl-4 gap-2 text-opacity-75 text-gray-400"
                />
            </div>
        </>
    );
}
