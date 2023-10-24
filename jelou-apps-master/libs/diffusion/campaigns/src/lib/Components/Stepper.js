import React from "react";

const Stepper = (props) => {
    return (
        <div>
            <div className="bg-gray-45 mx-auto flex h-10 w-10 items-center justify-center rounded-full text-center font-bold text-primary-200">
                <div>{props.number || 1}</div>
            </div>
        </div>
    );
};

export default Stepper;
