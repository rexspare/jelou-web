import { TrashIcon2 } from "@apps/shared/icons";
import { isNil } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";

const TesterPhone = ({ testers, tester, index, setTesters,handleRemovePhoneInput }) =>{
  const [isValid, setIsValid] = useState(true);
  const { t } = useTranslation();
  let idInterval = null;

  if(tester?.length >= 3){
    clearInterval(idInterval);
    idInterval = setTimeout(() => {
      setIsValid(isValidPhoneNumber(tester || ""))
    }, 1000);
  }
  const handleChangePhoneNumber = (index, phoneNumber) => {
    const updatedTesters = [...testers];
    updatedTesters[index] = phoneNumber;
    setTesters(updatedTesters);
};


  return (
        <div key={index} className="w-full">
            <div className="flex w-full flex-row items-center gap-4">
                <div className={`flex h-11 grow rounded-lg border-1  px-4 py-3 font-medium text-gray-610 ${!isValid && tester?.length > 0?"border-semantic-error":"border-neutral-200"}`}>
                    <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="EC"
                        value={isNil(tester) ? "" : tester}
                        onChange={(value) => handleChangePhoneNumber(index, value)}
                    />
                </div>
                <button
                    type="reset"
                    disabled={testers?.length === 1}
                    onClick={() => handleRemovePhoneInput(index)}
                    className={`text-semantic-error ${
                        testers?.length > 2 ? "mr-4" : ""
                    } disabled:cursor-not-allowed disabled:opacity-80`}>
                    <TrashIcon2 className="hover:opacity-80" />
                </button>
            </div>
        {!isValid && tester?.length > 0 && <span className="text-semantic-error font-semibold text-10 text-start pl-14">{t("brain.phoneInvalid")}</span>}
        </div>
    )
}

export default TesterPhone;
