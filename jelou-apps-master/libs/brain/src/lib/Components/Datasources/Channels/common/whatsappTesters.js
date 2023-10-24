import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { TrashIcon2 } from "@apps/shared/icons";
import TesterPhone from "./testerPhone";

const WhatsappTesters = (props) => {
    const { testers, setTesters, setAreAllPhoneNumbersValid, areAllPhoneNumbersValid, isChannelEdition } = props;
    const { t } = useTranslation();

    const handleChangePhoneNumber = (index, phoneNumber) => {
        const updatedTesters = [...testers];
        updatedTesters[index] = phoneNumber;
        setTesters(updatedTesters);
    };

    const handleAddPhoneInput = () => {
        setTesters([...testers, ""]);
    };

    const handleRemovePhoneInput = (index) => {
        const updatedTesters = [...testers];
        updatedTesters.splice(index, 1);
        setTesters(updatedTesters);
    };

    useEffect(() => {
        setAreAllPhoneNumbersValid(
            testers.every((phone) => isValidPhoneNumber(phone || "") )
        );
    }, [testers]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col space-y-2">
                <span className="text-sm font-bold text-gray-610">Testers</span>
                <span className="text-sm text-gray-400">{t("brain.testersPhones")}</span>
            </div>
            <div
                className="h-auto my-3 flex flex-col items-center gap-3 overflow-y-scroll text-sm text-gray-610">
                {testers.map((tester, index) => {
                    return <TesterPhone
                              testers={testers}
                              setTesters={setTesters}
                              tester={tester}
                              index={index}
                              handleRemovePhoneInput={handleRemovePhoneInput}
                              />;
                })}
            </div>
            <button
                type="button"
                disabled={!areAllPhoneNumbersValid}
                onClick={handleAddPhoneInput}
                className="min-w-auto flex h-9 w-20 items-center justify-center rounded-3xl border-1 border-primary-200 p-4 py-3.5 text-sm font-bold text-primary-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80">
                {t("common.add2")}
            </button>
        </div>
    );
};

export default WhatsappTesters;
