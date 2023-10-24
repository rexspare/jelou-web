import { InputErrorMessage } from "../InputErrorMessage";

export const InputCheckbox = ({ name, label, hasError, defaultValue }) => {
  return (
    <label className="check flex select-none items-center gap-4 font-semibold text-primary-200">
      <input defaultChecked={Boolean(defaultValue)} name={name} className="rounded-default border-primary-200 text-primary-200" type={"checkbox"} />
      {label}
      {hasError && <InputErrorMessage hasError={hasError} />}
    </label>
  );
};
