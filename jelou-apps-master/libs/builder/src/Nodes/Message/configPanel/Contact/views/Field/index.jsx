/** @typedef {"addresses" | "emails" | 'phones' | 'urls'} TypeContact */

import { ArrowIcon } from "libs/builder/src/Icons";
import { getAddLabel, getMaxNumberAllowed, getSelectorOptions, getTypeHeader, getTypeTitle } from "../../helpers/utils.contact";
import { FieldCard } from "./components/FieldCard";
import { useFieldView } from "./hooks/useFieldView";

/**
 * @param {{
 * handleReturnView: () => void
 * contact: Contact
 * type: string,
 * handleSaveContactBlock: (contact: Contact) => void
 * }} props
 */
export const FieldView = ({ handleReturnView, contact, type, handleSaveContactBlock }) => {
    const { fieldOptions, handleAddField, handleSaveFields, handleDeleteField } = useFieldView({ contact, type, handleSaveContactBlock });

    return (
        <div className="flex flex-col gap-4 px-6 py-4 pb-4">
            <div className="border-gray-230 flex items-center gap-6 border-b-1 pb-4 text-primary-200">
                <div className="rotate-90 cursor-pointer" onClick={handleReturnView}>
                    <ArrowIcon width={12} height={12} />
                </div>
                <div className="flex items-center gap-3">{getTypeHeader(type)}</div>
            </div>
            <span className="text-sm text-gray-400">Solo puedes agregar hasta {getTypeTitle(type)}</span>
            <div className="flex flex-col gap-4">
                {fieldOptions.map((field) => (
                    <FieldCard
                        type={type}
                        field={field}
                        key={field.id}
                        options={getSelectorOptions(type)}
                        handleSaveFields={handleSaveFields}
                        handleDeleteField={() => handleDeleteField(field.id)}
                    />
                ))}
            </div>
            {fieldOptions.length < getMaxNumberAllowed(type) && (
                <span className="cursor-pointer font-bold text-primary-200" onClick={handleAddField}>
                    + {getAddLabel(type)}
                </span>
            )}
        </div>
    );
};
