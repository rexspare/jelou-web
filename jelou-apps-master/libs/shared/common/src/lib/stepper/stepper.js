import { IconCheck } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";

function Stepper({ stepsObj, children }) {
    const [currentState, setCurrentState] = useState(0);
    const [states, setStates] = useState([]);

    useEffect(() => {
        generateStates();
    }, []);

    const next = () => {
        if (currentState < states.length - 1) {
            setCurrentState((prevState) => prevState + 1);
        }
    };

    const previous = () => {
        if (currentState > 0) {
            setCurrentState((prevState) => prevState - 1);
        }
    };

    const getCurrentState = () => {
        return isEmpty(states[currentState]) ? "step-1" : states[currentState];
    };

    const generateStates = () => {
        const generatedStates = [];
        for (let i = 0; i < stepsObj.length; i++) {
            generatedStates.push(`step-${i + 1}`);
        }
        setStates(generatedStates);
    };
    const StepsThread = () => {
        const currentStateSetps = getCurrentState();
        const currentStepInt = currentState + 1;
        return (
            <ol className="">
                {stepsObj.map(({ step, title }) => {
                    const stateObj = `step-${step}`;
                    return (
                        <li key={step} className={`relative  ${step === stepsObj.length ? "h-4 pb-0" : "pb-5"} `}>
                            <div
                                className={`-ml-px absolute top-0 left-[1.82rem] ${step === stepsObj.length ? "mt-3" : "mt-6"}  h-full w-[0.15rem] ${
                                    stateObj === currentStateSetps && currentStepInt === step - 1 ? "bg-primary-200" : currentStepInt > step ? "bg-secondary-425" : "bg-primary-370"
                                } te`}
                                aria-hidden="true"
                            ></div>

                            <div className="group relative ml-4 flex items-center" aria-current="step">
                                <div className={`flex h-9 ${step === stepsObj.length ? "-mb-4" : ""} items-center`} aria-hidden="true">
                                    <div
                                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                                            stateObj === currentStateSetps && currentStepInt === step ? "bg-primary-200" : currentStepInt > step ? "bg-secondary-425" : "bg-primary-370"
                                        } text-center font-bold text-white`}
                                    >
                                        <div>{currentStepInt > step ? <IconCheck /> : step}</div>
                                    </div>
                                </div>

                                <span className="ml-4 flex w-44 min-w-0 flex-col pt-4">
                                    <h4
                                        className={`text-base font-bold tracking-wide ${
                                            stateObj === currentStateSetps ? "text-primary-200" : currentStepInt > step ? "text-secondary-425" : "text-primary-370"
                                        } `}
                                    >
                                        {title}
                                    </h4>
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        );
    };

    return children({
        currentState,
        next,
        previous,
        getCurrentState,
        StepsThread,
    });
}

export default Stepper;
