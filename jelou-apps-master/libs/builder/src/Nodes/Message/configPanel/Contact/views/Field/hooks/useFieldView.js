/** @typedef {"addresses" | "emails" | 'phones' | 'urls'} TypeContact */

/**
 * @template T
 * @typedef {[T, React.Dispatch<React.SetStateAction<T>>]} State
 */

import { nanoid } from "nanoid";
import { useState } from "react";
import { getFieldName } from "../../../helpers/utils.contact";

/**
 * @param {{
 *  contact: Contact
 *  type: string
 *  handleSaveContactBlock: (contact: Contact) => void
 * }} props
 *
 * @returns {{
 *  fieldOptions: ContactField[]
 *  handleAddField: () => void
 *  handleSaveFields: (contactField: ContactField) => void
 *  handleDeleteField: (id: string) => void
 * }}
 */

export const useFieldView = ({ contact, type, handleSaveContactBlock }) => {
  /**
   * @type {State<ContactField[]>}
   */
  const [fieldOptions, setFieldOptions] = useState(contact[type] ?? []);

  /**
   * Function that adds a new field to the list
   */
  const handleAddField = () => {
    /** @type {ContactField} */
    const newField = {
      type: "",
      id: nanoid(),
      [getFieldName(type)]: "",
    };
    setFieldOptions([...fieldOptions, newField]);
  };

  /**
   * Function that deletes a field from the list
   * @param {string} id
   */
  const handleDeleteField = (id) => {
    const newFields = fieldOptions.filter((field) => field.id !== id);
    const updatedContactBlock = {
      ...contact,
      [type]: newFields,
    };
    handleSaveContactBlock(updatedContactBlock);
    setFieldOptions(newFields);
  };

  /**
   * Function that saves the fields
   * @param {ContactField} contactField
   * */
  const handleSaveFields = (contactField) => {
    const updatedContactBlock = {
      ...contact,
      [type]: fieldOptions.map((field) => (field.id === contactField.id ? contactField : field)),
    };
    handleSaveContactBlock(updatedContactBlock);
  };

  return {
    fieldOptions,
    handleAddField,
    handleSaveFields,
    handleDeleteField,
  };
};
