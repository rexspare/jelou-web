import { CloseIcon } from "libs/builder/src/Icons";
import { InputSelector, TextInput } from "libs/builder/src/common/inputs";
import { INPUT_STYLE } from "../../../helpers/constants.contact";
import { getInputLabel, getSelectorLabel } from "../../../helpers/utils.contact";
import { useInputFields } from "../hooks/useInputFields";

/**
 * @typedef {Object} SelectorOption
 * @property {string} label
 * @property {string} value
 */

/**
 *
 * @param {{
 * type: string
 * field: ContactField
 * handleDeleteField: () => void
 * handleSaveFields: (contactField: ContactField) => void
 * options: SelectorOption[]
 * }} props
 */
export const FieldCard = ({ type, field, handleDeleteField, handleSaveFields, options }) => {
  const { inputData, inputError, selectorData, handleInputChange, handleSelectorChange } = useInputFields({ field, type, handleSaveFields });

  return (
    <div className="border-gray-330 flex flex-col gap-4 rounded-10 border-2 px-4 pb-6">
      <div className="cursor-pointer self-end pt-2" onClick={handleDeleteField}>
        <CloseIcon />
      </div>
      <InputSelector
        name={type}
        isControlled
        options={options}
        value={selectorData}
        label={getSelectorLabel(type)}
        onChange={handleSelectorChange}
        placeholder="Selecciona una opción"
        labelClassName="text-gray-400 text-sm font-semibold"
      />
      <TextInput
        name={type}
        hasError={inputError}
        defaultValue={inputData}
        label={getInputLabel(type)}
        onChange={handleInputChange}
        placeholder={getInputLabel(type)}
        className={INPUT_STYLE(inputError)}
        labelClassName="text-gray-400 text-sm font-semibold"
      />
    </div>
  );
};
