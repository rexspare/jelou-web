import React from "react";

const MoreOptionsMobile = (props) => {
    return (
        <select onChange={props.handleSelectChange} defaultValue="..." className="w-4 appearance-none bg-transparent text-lg text-gray-400">
            <option disabled value="...">
                ...
            </option>
            <option value="reply">Responder</option>
            <option value="forward">Reenviar</option>
            <option value="copy">Copiar</option>
        </select>
    );
};

export default MoreOptionsMobile;
