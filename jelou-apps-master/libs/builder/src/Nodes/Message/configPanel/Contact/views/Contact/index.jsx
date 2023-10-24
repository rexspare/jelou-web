import { TextInput } from "libs/builder/src/common/inputs";
import { FIELDS_INFO, INPUT_STYLE, NAMES_INPUTS_CONTACT_BLOCK } from "../../helpers/constants.contact";
import { FieldInfo } from "./components/FieldInfo";

/**
 * @param {{
 * handleChangeView: (value: string) => void
 * handleChangeInputs: (event: React.FormEvent<HTMLFormElement>) => void
 * contact: Contact
 * }} props
 */

export const ContactForm = ({ handleChangeView, handleChangeInputs, contact }) => {
  const {
    name: { first_name: firstName, last_name: lastName },
    org: { title, company },
  } = contact;

  return (
    <form onChange={handleChangeInputs} className="mb-6 flex w-full flex-col gap-4 text-13 font-medium text-gray-400">
      <TextInput
        label="Nombres"
        hasError={null}
        placeholder="Nombres"
        defaultValue={firstName}
        className={INPUT_STYLE()}
        name={NAMES_INPUTS_CONTACT_BLOCK.FIRST_NAME}
      />

      <TextInput
        hasError={null}
        label="Apellidos"
        placeholder="Apellidos"
        defaultValue={lastName}
        className={INPUT_STYLE()}
        name={NAMES_INPUTS_CONTACT_BLOCK.LAST_NAME}
      />

      <TextInput
        label="Cargo"
        hasError={null}
        placeholder="Cargo"
        defaultValue={title}
        className={INPUT_STYLE()}
        name={NAMES_INPUTS_CONTACT_BLOCK.TITLE}
      />

      <TextInput
        hasError={null}
        label="Compañía"
        placeholder="Compañía"
        defaultValue={company}
        className={INPUT_STYLE()}
        name={NAMES_INPUTS_CONTACT_BLOCK.COMPANY}
      />

      {FIELDS_INFO.map((field) => (
        <FieldInfo
          key={field.id}
          Icon={field.icon}
          view={field.view}
          value={field.value}
          title={field.title}
          list={contact[field.list] ?? []}
          handleChangeView={handleChangeView}
        />
      ))}
    </form>
  );
};
