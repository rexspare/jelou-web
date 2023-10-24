import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

const LoadingFilter = () => {
    return (
        <div className="jl-flex jl-items-center jl-py-2 jl-pl-4">
            <BeatLoader color="#adb8c8" size={10} />
        </div>
    );
};

export default LoadingFilter;
