import React from "react";
import { withTranslation } from "react-i18next";

const Tag = (props) => {
    const { tag, isList = false, readOnly = false, index } = props;
    return (
        <span key={index} className={`h-full`} style={{ cursor: isList && !readOnly && "pointer" }}>
            <span className={`flex h-full items-center rounded-full px-3 text-xs font-semibold text-white`} style={{ backgroundColor: tag.color }}>
                <span className="flex-shrink-0">{tag.name.es}</span>
            </span>
        </span>
    );
};
export default withTranslation()(Tag);
