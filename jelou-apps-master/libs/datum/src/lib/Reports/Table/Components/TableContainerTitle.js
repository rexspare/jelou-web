import React from "react";

const TableContainerTitle = (props) => {
    const { title } = props;
    return <h2 className="2xl:mb-0 mb-4 mr-3 flex-1 text-3xl font-medium text-purple-900">{title}</h2>;
};

export default TableContainerTitle;
