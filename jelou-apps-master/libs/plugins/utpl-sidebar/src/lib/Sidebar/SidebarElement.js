import React from "react";

import toLower from "lodash/toLower";
import get from "lodash/get";

import uniqid from "uniqid";

import EmailSettings from "./EmailSetting";
import NumberSettings from "./NumberSetting";
import TextSettings from "./TextSetting";
import TextBoxSettings from "./TextBoxSettings";
import SelectSettings from "./SelectSettings";
import DatepickerSettings from "./DatepickerSettings";

const SidebarElement = (props) => {
    const name = props.name;
    const id = uniqid();
    const parseLabel = (label) => {
        const rules = get(props, "rules", false);
        if (!rules) {
            return label;
        }
        const isObligatory = get(rules, "isObligatory", false);
        if (isObligatory) {
            const rule = get(rules, "rules", "");
            if (rule.search("required_with_all") === 0) {
                return label;
            } else {
                return label + " *";
            }
        }
        return label;
    };
    const label = parseLabel(props.label);

    switch (toLower(props.type)) {
        case "email":
            return (
                <EmailSettings
                    name={name}
                    id={id}
                    label={label}
                    onChange={props.onChange}
                    value={get(props.storeParams, `${name}`, "")}
                    getErrorMessage={props.getErrorMessage}
                    readOnly={props.readOnly}
                />
            );
        case "text":
            return (
                <TextSettings
                    name={props.name}
                    id={id}
                    label={label}
                    placeholder={props.placeholder ? props.placeholder : ""}
                    onChange={props.onChange}
                    value={get(props.storeParams, `${name}`, "")}
                    getErrorMessage={props.getErrorMessage}
                    readOnly={props.readOnly}
                />
            );
        case "textbox":
            return (
                <TextBoxSettings
                    name={props.name}
                    id={id}
                    label={label}
                    onChange={props.onChange}
                    value={get(props.storeParams, `${name}`, "")}
                    getErrorMessage={props.getErrorMessage}
                    readOnly={props.readOnly}
                />
            );
        case "number":
            return (
                <NumberSettings
                    name={props.name}
                    id={id}
                    label={label}
                    onChange={props.onChange}
                    value={get(props.storeParams, `${name}`, "")}
                    getErrorMessage={props.getErrorMessage}
                    readOnly={props.readOnly}
                />
            );
        case "select":
            return (
                <SelectSettings
                    name={props.name}
                    label={label}
                    id={id}
                    onChange={props.handleSelect}
                    value={get(props.storeParams, `${name}`, "")}
                    options={props.options}
                    getErrorMessage={props.getErrorMessage}
                    readOnly={props.readOnly}
                />
            );
        case "datepicker":
            return (
                <DatepickerSettings
                    name={props.name}
                    label={label}
                    id={id}
                    onChange={props.onChange}
                    value={get(props.storeParams, `${props.storeParams.name}`, "")}
                    options={props.options}
                    getErrorMessage={props.getErrorMessage}
                    readOnly={props.readOnly}
                />
            );
        default:
            return <div />;
    }
};

export default SidebarElement;
