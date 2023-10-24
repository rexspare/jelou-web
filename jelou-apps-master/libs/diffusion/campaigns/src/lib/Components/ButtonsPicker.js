/* eslint-disable react-hooks/exhaustive-deps */
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import Buttons from "./Buttons";

const ButtonsPicker = (props) => {
    const { buttonsObj, flows, flowId, arrayButton, setArrayButton } = props;
    const { buttons = [], buttonText = [] } = buttonsObj;

    useEffect(() => {
        const array = [];
        if (isEmpty(arrayButton)) {
            if (buttons.length > 0) {
                buttons.forEach((button) => {
                    const obj = {};
                    obj["flowId"] = "";
                    obj["action"] = button.text;
                    array.push(obj);
                });
            } else {
                buttonText.forEach((button) => {
                    const obj = {};
                    obj["flowId"] = "";
                    obj["action"] = button;
                    array.push(obj);
                });
            }
        }
        setArrayButton(array);
    }, [buttonsObj]);

    return (
        <div className="mb-6">
            {Array.isArray(arrayButton) &&
                arrayButton.map((button, index) => (
                    <Buttons key={index} button={button} keys={index} flows={flows} flowId={flowId} setArrayButton={setArrayButton} />
                ))}
        </div>
    );
};

export default ButtonsPicker;
