import React from "react";

const Label = (props) => {
    const { name, className = "", labelClassName, textColor } = props;

    return (
        <div className={className}>
            <label name={name} className={labelClassName ? labelClassName : `text-sm font-bold ${textColor ? textColor : "text-gray-400"} `}>
                {name}
            </label>
        </div>
    );
};

export default Label;
