import { Search } from "../search/search";

export function NotesFilters(props) {
    const { loadingSearch, handleChange, handleKeyDown } = props;

    return (
        <div className="border-b-default border-b-[#DCDEE4] py-4">
            <Search loadingSearch={loadingSearch} handleChange={handleChange} handleKeyDown={handleKeyDown} />
        </div>
    );
}
export default NotesFilters;
