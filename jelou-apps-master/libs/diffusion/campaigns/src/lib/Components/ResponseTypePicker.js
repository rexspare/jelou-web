import React from "react";
// import { Switch } from "@headlessui/react";
import { RESPONSE_TYPES } from "@apps/shared/constants";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";

const ResponseTypePicker = (props) => {
    const { responseType, setResponseType, setResponse, ACTION_QUICKREPLY, setFlagSwitchPick } = props;
    const { t } = useTranslation();

    return (
        <div className="mb-6 flex max-w-sm">
            <Switch
                checked={responseType === RESPONSE_TYPES.FLOW}
                onChange={(event) => {
                    setFlagSwitchPick(true);
                    if (event) {
                        setResponseType(RESPONSE_TYPES.FLOW);
                    } else {
                        setResponseType(null);
                        setResponse(null);
                    }
                }}
                className="react-switch"
                onColor="#00B3C7"
                offColor="#e2e8f0"
                uncheckedIcon={false}
                checkedIcon={false}
            />
            <span className="text-md mx-3 pt-1 font-medium text-gray-400 text-opacity-75">{t("ResponseTypePicker.flow")}</span>
            <Switch
                checked={responseType === RESPONSE_TYPES.INPUT}
                onChange={(event) => {
                    setFlagSwitchPick(true);
                    if (event) {
                        setResponseType(RESPONSE_TYPES.INPUT);
                    } else {
                        setResponseType(null);
                        setResponse(null);
                    }
                }}
                className="react-switch"
                onColor="#00B3C7"
                offColor="#e2e8f0"
                uncheckedIcon={false}
                checkedIcon={false}
            />
            <span className="text-md mx-3 pt-1 font-medium text-gray-400 text-opacity-75">{t("ResponseTypePicker.question")}</span>
            <Switch
                checked={responseType === RESPONSE_TYPES.OPTIONS}
                onChange={(event) => {
                    setFlagSwitchPick(true);
                    if (event) {
                        setResponseType(RESPONSE_TYPES.OPTIONS);
                    } else {
                        setResponseType(null);
                        setResponse(null);
                    }
                }}
                className="react-switch"
                onColor="#00B3C7"
                offColor="#e2e8f0"
                uncheckedIcon={false}
                checkedIcon={false}
            />
            <span className="text-md mx-3 pt-1 font-medium text-gray-400 text-opacity-75">{t("ResponseTypePicker.options")}</span>
            {ACTION_QUICKREPLY && (
                <>
                    <Switch
                        checked={responseType === RESPONSE_TYPES.BUTTONS}
                        onChange={(event) => {
                            setFlagSwitchPick(true);
                            if (event) {
                                setResponseType(RESPONSE_TYPES.BUTTONS);
                            } else {
                                setResponseType(null);
                                setResponse(null);
                            }
                        }}
                        className="react-switch"
                        onColor="#00B3C7"
                        offColor="#e2e8f0"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                    <span className="text-md mx-3 pt-1 font-medium text-gray-400 text-opacity-75">{t("ResponseTypePicker.buttons")}</span>
                </>
            )}
        </div>
    );
};

export default ResponseTypePicker;
