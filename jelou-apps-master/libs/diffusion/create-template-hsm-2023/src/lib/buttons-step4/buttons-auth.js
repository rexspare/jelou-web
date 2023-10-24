import { Input, Label } from "@apps/shared/common";
import { ErrorIcon } from "@apps/shared/icons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import CircularProgress from "../circular-progress/circular-progress";

export function ContentAuth(props) {
    const { t, setLockStep, setButtonsHsm, buttonsHsm, errorWarning, MAX_CHAR_BUTTONS_FLOW, MINIMUM_CHARACTERS } = props;

    let nameBoton = get(buttonsHsm[0], "text", "");

    const handleInputAuthButton = (e) => {
        const { value } = e.target;
        setButtonsHsm([{ text: value, type: "OTP" }]);
    };

    React.useEffect(() => {
        if (nameBoton.length < MINIMUM_CHARACTERS) {
            setLockStep(true);
        } else {
            setLockStep(false);
        }
    }, [nameBoton]);

    return (
        <div className="relative my-3 rounded-10 border-1 border-gray-36 px-[1.3rem] pt-7 pb-6">
            <Label name={t("hsm.createTemplateModal.nameButton")} textColor="text-black" />
            <Input
                type="text"
                required={true}
                name="text"
                className={` w-full rounded-[0.8125rem] text-15 text-black  ${
                    errorWarning(!isEmpty(buttonsHsm[0].text) ? nameBoton : "") ? "!border-red-950 bg-red-1010 bg-opacity-10" : "border-gray-34 bg-white focus:border-gray-39"
                }`}
                onChange={(e) => handleInputAuthButton(e)}
                value={nameBoton || ""}
                placeholder={t("hsm.createTemplateModal.palceHolderNameButton")}
                maxLength={MAX_CHAR_BUTTONS_FLOW}
            />
            <div className="pt-1">
                <CircularProgress MINIMUM_CHARACTERS={MINIMUM_CHARACTERS} MAXIMUM_CHARACTERS={MAX_CHAR_BUTTONS_FLOW} countFieldLength={!isEmpty(buttonsHsm[0].text) ? nameBoton.length : 0} />
            </div>
            {errorWarning(nameBoton) && (
                <div className="flex items-center gap-2 pt-1 font-medium">
                    <ErrorIcon /> <span className="text-xs text-red-1010">{t("hsm.createTemplateModal.limitTwoCharacter")}</span>
                </div>
            )}
        </div>
    );
}
export default ContentAuth;
