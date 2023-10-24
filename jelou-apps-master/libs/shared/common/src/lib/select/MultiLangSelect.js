import Select from "react-select";

import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

const MultiLangSelect = (props) => {
    const { onChange, placeholder, loading, hasAll, value } = props;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const groupStyles = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };
    const groupBadgeStyles = {
        backgroundColor: "#EBECF0",
        borderRadius: "2em",
        color: "#172B4D",
        display: "inline-block",
        fontSize: 12,
        fontWeight: "normal",
        lineHeight: "1",
        minWidth: 1,
        padding: "0.16666666666667em 0.5em",
        textAlign: "center",
    };

    const formatGroupLabel = (data) => (
        <div style={groupStyles}>
            <span>{data.label}</span>
            <span style={groupBadgeStyles}>{data.options.length}</span>
        </div>
    );

    let options = isEmpty(props.options) ? [] : props.options;

    options = options.map((opt) => {
        const name = isEmpty(opt.displayNames) ? opt.displayName : opt.displayNames[lang];
        return { ...opt, value: opt.id.toString(), label: name };
    });

    options = hasAll ? [{ value: "-1", label: "Todos" }, ...options] : options;

    return <Select classNamePrefix="mn-react-select" options={options} formatGroupLabel={formatGroupLabel} onChange={onChange} placeholder={placeholder} isLoading={loading} value={value} />;
};

export default MultiLangSelect;
