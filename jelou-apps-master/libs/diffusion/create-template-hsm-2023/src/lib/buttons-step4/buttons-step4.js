import isEmpty from "lodash/isEmpty";
import ContentAuth from "./buttons-auth";
import ButtonsServMark from "./buttons-service-marketing";
// import styles from "./buttons-step4.module.css";
const MAX_CHAR_BUTTONS_FLOW = 24;
const MINIMUM_CHARACTERS_BUTTONS = 2;
export function ButtonsStep4(props) {
    const {
        auth,
        t,
        hsmCategory,
        templateModalInputNames,
        ArrowSelect,
        buttonTypes,
        selectedType,
        setSelectedType,
        classSelect,
        setButtonsHsm,
        buttonsHsm,
        typeAction,
        setTypeAction,
        setScrollControl,
        setLockStep,
        typeUrl,
        setTypeUrl,
        validationNameChar,
    } = props;

    const handleButtonType = (e) => {
        setSelectedType(e);
        setButtonsHsm([{ text: "", type: "" }]);
        setTypeAction([]);
    };
    const errorWarning = (valuesInput) => {
        return !isEmpty(valuesInput) && valuesInput.length < MINIMUM_CHARACTERS_BUTTONS;
    };

    return (
        <div className="">
            <div className="px-8 pt-12 pb-4">
                <h1 className="pb-5 text-xl font-bold  text-gray-400 ">{templateModalInputNames.addButton}</h1>
                {hsmCategory === auth ? (
                    <ContentAuth
                        setButtonsHsm={setButtonsHsm}
                        t={t}
                        buttonsHsm={buttonsHsm}
                        MAX_CHAR_BUTTONS_FLOW={MAX_CHAR_BUTTONS_FLOW}
                        MINIMUM_CHARACTERS={MINIMUM_CHARACTERS_BUTTONS}
                        errorWarning={errorWarning}
                        setLockStep={setLockStep}
                    />
                ) : (
                    <ButtonsServMark
                        templateModalInputNames={templateModalInputNames}
                        t={t}
                        ArrowSelect={ArrowSelect}
                        buttonTypes={buttonTypes}
                        selectedType={selectedType}
                        handleButtonType={handleButtonType}
                        classSelect={classSelect}
                        setButtonsHsm={setButtonsHsm}
                        buttonsHsm={buttonsHsm}
                        errorWarning={errorWarning}
                        typeAction={typeAction}
                        setTypeAction={setTypeAction}
                        setScrollControl={setScrollControl}
                        typeUrl={typeUrl}
                        setTypeUrl={setTypeUrl}
                        setLockStep={setLockStep}
                        MAX_CHAR_BUTTONS_FLOW={MAX_CHAR_BUTTONS_FLOW}
                        MINIMUM_CHARACTERS={MINIMUM_CHARACTERS_BUTTONS}
                        validationNameChar={validationNameChar}
                    />
                )}
            </div>
        </div>
    );
}
export default ButtonsStep4;
