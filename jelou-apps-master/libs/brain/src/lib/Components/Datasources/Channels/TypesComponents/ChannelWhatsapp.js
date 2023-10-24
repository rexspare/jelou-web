import { CharacterCounter } from "@apps/shared/common";
import { WarningIcon2 } from "@apps/shared/icons";
import { NAME_MAX_LENGTH } from "../../../../constants";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-number-input";

function ChannelWhatsapp(props) {
    const { phone, setPhone, handleChange, maxLength, length, channelValues } = props;
    const { t } = useTranslation();

    return (
        <>
            <div className="mb-4 text-sm text-gray-610">
                <label className="mb-[0.3rem] font-bold">
                    <span className="ml-3 font-bold text-gray-610">{t("common.name")}</span>
                    <div
                        className={`flex h-11 w-full rounded-lg border-1 px-4 py-3 font-medium text-gray-610 ${
                            length > 0 && length === maxLength ? "border-semantic-error" : "border-neutral-200"
                        }`}>
                        <input
                            className="h-full w-full font-medium text-gray-610 placeholder:text-sm focus-visible:outline-none"
                            placeholder={`${t("common.forExample")}`}
                            name={"name"}
                            onChange={handleChange}
                            maxLength={maxLength}
                        />
                        {length > 0 && length === maxLength && (
                            <WarningIcon2 width="1.5rem" height="1.5rem" className="fill-current text-semantic-error" />
                        )}
                    </div>
                    <CharacterCounter
                        className={` ${length > 0 && length === maxLength ? "text-semantic-error" : "text-[#B0B6C2]"}`}
                        colorCircle={length > 0 && length === maxLength ? "#F95A59" : "#959DAF"}
                        count={channelValues?.name?.length}
                        max={NAME_MAX_LENGTH}
                        width={15}
                        height={15}
                        right
                    />
                </label>
            </div>

            <div className="flex flex-col space-y-2">
                <span className="text-sm font-bold text-gray-610">Testers</span>
                <span className="text-sm text-gray-400">Ingresa los teléfonos de los testers que probarán el ambiente sandbox:</span>
            </div>

            <div className="mt-2 mb-4 text-sm text-gray-610">
                <div className="flex h-11 w-full items-center rounded-lg border-1 border-neutral-200 px-4 py-1 font-medium text-gray-610">
                    <PhoneInput international countryCallingCodeEditable={false} defaultCountry="EC" value={phone} onChange={setPhone} />
                </div>
            </div>
        </>
    );
}

export default ChannelWhatsapp;
