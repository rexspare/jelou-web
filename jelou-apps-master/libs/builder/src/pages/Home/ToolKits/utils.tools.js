/**
 * Function to check if a step is completed
 * @param {string} step
 * @param {string} currentStep
 * @returns {boolean}
 */

export const isStepCompleted = (step, currentStep, STEPS) => {
    if (step === currentStep) return false;

    const stepIndex = STEPS.findIndex(({ id }) => id === step);

    const currentStepIndex = STEPS.findIndex(({ id }) => id === currentStep);

    return stepIndex < currentStepIndex;
};

/**
 * Function to get the style of the LI element of the edit sidebar
 * @param {boolean} isActive
 * @returns {string}
 */

export const getLIEditStyle = (isActive) => {
    return isActive ? "text-primary-200 bg-[#BFEFF0] border-r-8 border-primary-200" : "text-primary-200";
};

/**
 * Function to get the style of the LI element
 * @param {boolean} isActive
 * @param {boolean} isComplete
 * @returns {string}
 */

export const getLIStyle = (isActive, isComplete) => {
    return isComplete ? "text-[#209F8B]" : isActive ? "text-primary-200" : "text-primary-800";
};

/**
 * Function to get the style of the DIV element
 * @param {boolean} isActive
 * @param {boolean} isComplete
 * @returns {string}
 */

export const getDIVStyle = (isActive, isComplete) => {
    return isComplete ? "bg-[#209F8B] after:bg-[#209F8B]" : isActive ? "bg-primary-200 after:bg-primary-200" : "after:bg-primary-800 bg-primary-800";
};

/**
 * Function to get the style of the line element
 * @param {boolean} hasLine
 * @returns {string}
 */

export const getLINEStyle = (hasLine) => {
    return hasLine ? 'after:absolute after:-bottom-[1.5rem] after:-left-[0.625rem] after:h-0.5 after:w-11 after:rotate-90 after:content-[""]' : "";
};

/**
 * Function to test if a string is a valid hex color
 * @param {string} color
 * @returns {boolean}
 */

export const testHexColor = (color) => {
    const regex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/;
    return regex.test(color);
};
