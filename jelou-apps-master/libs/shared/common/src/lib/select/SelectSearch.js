import SelectSearch, { fuzzySearch } from "react-select-search";
import truncate from "lodash/truncate";
import isEmpty from "lodash/isEmpty";
import { withTranslation } from "react-i18next";

/**
 * option props should be like { id, name }
 */
const SearchSelect = (props) => {
    const { padding = "", title, t } = props;
    let options = isEmpty(props.options) ? [] : props.options;
    options = options.map((opt) => {
        const name = opt.title ? opt.title : opt.name || opt.names;
        return { ...opt, value: opt.id.toString(), name: name };
    });
    let hasAll = true;
    hasAll = props.hasAll;

    let value = !isEmpty(props.value) ? props.value.toString() : [];

    return (
        <div className={`relative ${props.className}`}>
            {!isEmpty(title) && <div className="my-2 ml-5 text-sm font-bold leading-5 text-gray-500 xxl:text-15">{title}</div>}
            <SelectSearch
                options={isEmpty(options) && hasAll ? [{ value: props.value, name: t("Todos") }] : options}
                name={props.name}
                search
                filterOptions={fuzzySearch}
                className={`select-search ${padding}`}
                renderValue={(valueProps) => {
                    const value = truncate(valueProps.value, {
                        length: 40,
                        separator: "...",
                    });
                    return <input {...valueProps} value={value} className="select-search__input" />;
                }}
                onChange={(evt) => {
                    props.onChange(evt);
                }}
                value={isEmpty(value) ? value : value.toString()}
                placeholder={props.placeholder}
            />
        </div>
    );
};

export default withTranslation()(SearchSelect);
