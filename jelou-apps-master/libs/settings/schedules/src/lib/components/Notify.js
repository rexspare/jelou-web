import React from "react";

import Lottie from "react-lottie";

import warningAnimation from "../Common/warningAnimation.json";

const Notify = (props) => {
    const { msg } = props;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: warningAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className=" relative mt-6 flex min-h-[4rem] items-center space-x-3 rounded-[1.3rem] border-4  border-[#D6806F] border-opacity-40 pl-10">
            <div className="flex ">
                <Lottie options={defaultOptions} width={30} height={30} />
            </div>
            <div className="flex">
                <div className="text-15 font-bold text-[#D6806F]">{msg}</div>
            </div>
        </div>
    );
};

export default Notify;
