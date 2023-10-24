import React from "react";

const CardWrapper = ({ className, titleColor = "text-gray-400", title, children }) => {
    return (
        <div className={className}>
            <div className="flex w-full items-center border-b-default border-gray-100/50 py-2 px-5">
                <p className={`text-xl font-bold ${titleColor}`}>{title}</p>
            </div>
            {children}
        </div>
    );
};

export default CardWrapper;
