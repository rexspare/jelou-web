import { InputErrorMessage } from "../InputErrorMessage";

export const InputText = ({ label, name, hasError, placeholder, defaultValue }) => {
  return (
    <label className="font-medium">
      {label}
      <input
        defaultValue={defaultValue}
        name={name}
        className={`mt-1 block w-full rounded-lg font-normal text-[#707C95] text-opacity-75 placeholder:text-opacity-50 focus:ring-transparent ${
          hasError
            ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
            : "border-none bg-primary-700 bg-opacity-75 focus:border-transparent"
        }`}
        type="text"
        placeholder={placeholder}
      />
      {hasError && <InputErrorMessage hasError={hasError} />}
    </label>
  );
};
