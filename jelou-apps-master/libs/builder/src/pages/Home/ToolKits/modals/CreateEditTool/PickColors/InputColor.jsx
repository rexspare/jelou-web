import { SketchPicker } from "react-color";

import { TextInput } from "@builder/common/inputs";

/**
 * @typedef {Object} InputColorProps
 * @property {string} title - The title of the input color component.
 * @property {boolean} showPicker - Whether or not to show the color picker.
 * @property {string} color - The current color value.
 * @property {boolean} hasError - Whether or not the input has an error.
 * @property {(color: string) => void} onChange - The function to call when the color changes.
 * @property {() => void} onClick - The function to call when the input is clicked.
 * @property {() => void} onClose - The function to call when the color picker is closed.
 */
export const InputColor = ({ showPicker, color, onChange, onClick, onClose, title, hasError = false }) => {
    return (
        <div className="grid h-8 grid-cols-2 items-center gap-4">
            <p className="text-md font-semibold text-gray-400">{title}</p>
            <TextInput
                name="color"
                placeholder="#000000"
                isControlled
                maxLength={7}
                defaultValue={color}
                onChange={onChange}
                label={<div onClick={onClick} style={{ backgroundColor: color }} className="pointer absolute left-1.5 top-[0.65rem] h-[20px] w-[20px] rounded-sm shadow" />}
                className={`self-end rounded-10 border-1 bg-white px-2 py-5 pl-10 ${hasError ? "border-error" : "border-gray-330"}`}
            />
            <div>
                {showPicker && (
                    <div className="absolute right-[-12rem] top-[7rem] z-20">
                        <div className="fixed bottom-0 left-0 right-0 top-0" onClick={onClose} />
                        <SketchPicker color={color} onChange={(color) => onChange(color)} />
                    </div>
                )}
            </div>
        </div>
    );
};
