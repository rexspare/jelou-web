/**
 * @typedef {Object} SelectorOption
 * @property {string} label
 * @property {string} value
 */

import { debounce } from "lodash";
import { useEffect, useState } from "react";

import { FIELDS_ERRORS } from "../../../helpers/constants.contact";
import { getFieldName } from "../../../helpers/utils.contact";

/**
 * @param {{
 *  field: ContactField
 *  type: string
 *  handleSaveFields: (contactField: ContactField) => void
 * }} props
 *
 * @returns {{
 *  inputData: string
 *  inputError: string
 *  selectorData: string
 *  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
 *  handleSelectorChange: (option: SelectorOption) => void
 * }}
 */

export const useInputFields = ({ field, type, handleSaveFields }) => {
  const [selectorData, setSelectorData] = useState(field?.type);

  const [inputData, setInputData] = useState(field[getFieldName(type)] ?? "");
  const [inputError, setInputError] = useState(null);

  const [hasFieldChange, setHasFieldChange] = useState(false);

  useEffect(() => {
    if (!inputData) {
      setInputError(null);
      return;
    }

    if (!FIELDS_ERRORS[type].regex.test(inputData)) {
      setInputError(FIELDS_ERRORS[type].textError);
      return;
    }

    if (FIELDS_ERRORS[type].regex.test(inputData)) {
      setInputError(null);
    }

    if (hasFieldChange) {
      handleUpdateFields();
    }
  }, [selectorData, inputData, inputError]);

  /**
   * Function that handles the change of the selector
   * @param {SelectorOption} option
   * return {void}
   */

  const handleSelectorChange = (option) => {
    setSelectorData(option?.value);
    setHasFieldChange(true);
  };

  /**
   * Function that handles the change of the input
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * return {void}
   */

  const handleInputChange = debounce((event) => {
    setInputData(event.target.value);
    setHasFieldChange(true);
  }, 800);

  /**
   * Function that updates the field
   * return {void}
   */

  const handleUpdateFields = () => {
    if (inputData && selectorData && inputError === null) {
      const updatedField = {
        ...field,
        type: selectorData,
        [getFieldName(type)]: inputData,
      };
      handleSaveFields(updatedField);
      setHasFieldChange(false);
    }
  };

  return {
    inputData,
    inputError,
    selectorData,
    handleInputChange,
    handleSelectorChange,
  };
};
