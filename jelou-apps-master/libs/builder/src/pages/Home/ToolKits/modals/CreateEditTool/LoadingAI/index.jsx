import Lottie from "react-lottie";

import { ModalHeadless } from "@builder/common/Headless/Modal";
import animation from "./helpers/loading.json";
import "./index.scss";

/**
 * @typedef {Object} Props
 * @property {boolean} isLoadingAITool - Indicates whether the AI tool is currently loading or not.
 */
export const LoadingAIModal = ({ isLoadingAITool }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <ModalHeadless showBtns={false} isDisable={false} showClose={false} isOpen={isLoadingAITool} className="h-[36rem] w-[46rem]">
            <div className="flex flex-col items-center justify-center gap-4">
                <Lottie options={defaultOptions} height={375} width={455} />
                <h1 className="text-xl text-gray-400">
                    <span className="font-bold">Creando</span> Tool
                </h1>
                {/* <h1 className="font-medium text-lg text-primary-100">{loadingPhrase}</h1> */}
                <div className="z-10 mx-6 my-2 h-12 w-[43rem] self-start rounded-lg border-1 border-gray-200 p-4">
                    <div className="relative w-full rounded-md bg-gray-200">
                        <div className="shim-loading absolute top-0 h-4 w-full rounded-md"></div>
                    </div>
                </div>
            </div>
        </ModalHeadless>
    );
};
