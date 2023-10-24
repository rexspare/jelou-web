import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import isNil from "lodash/isNil";

import ModalFooter from "../../../../Modal/modalFooter";

const WhatsappProductionSettings = (props) => {
    const { setShowChannelSettings } = props;

    const { t } = useTranslation();
    const [phone, setPhone] = useState(null);
    const [isValidPhone, setIsValidPhone] = useState(false);

    const handleChangePhoneNumber = (phoneNumber) => {
        setPhone(phoneNumber);
    };

    const handleCloseModal = () => {
        setPhone(null);
        setShowChannelSettings(true);
    };

    const handleConectChannelToPhone = () => {
        handleCloseModal();
    };

    useEffect(() => {
        if (!isNil(phone)) {
            setIsValidPhone(isValidPhoneNumber(phone));
        }
    }, [phone]);

    return (
        <section className="max-h-view space-y-6 overflow-y-auto px-10 pt-8 pb-8 text-sm">
            <div>{t("common.channelConectionInstruction")}</div>
            <form onSubmit={handleConectChannelToPhone}>
                <div className="mb-1 font-bold text-gray-610">{t("common.phone")}</div>
                <div className="mb-8 flex h-11 grow rounded-lg  border-1 border-neutral-200 px-4 py-3 font-medium text-gray-610">
                    <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="EC"
                        value={isNil(phone) ? "" : phone}
                        onChange={(value) => handleChangePhoneNumber(value)}
                    />
                </div>
                <ModalFooter
                    closeModal={handleCloseModal}
                    disableButton={!isValidPhone}
                    primaryText={t("common.connect")}
                />
            </form>
        </section>
    );
};

export default WhatsappProductionSettings;
