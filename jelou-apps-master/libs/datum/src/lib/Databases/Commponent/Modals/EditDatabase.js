import { useTranslation } from "react-i18next";

import { ModalHeadlessSimple } from "@apps/shared/common";
import { CloseIcon1, ErrorIcon } from "@apps/shared/icons";
import { CircularProgressbar } from "react-circular-progressbar";
import "./css/circularProgress.css";

import { DATABASE_NAME_MAX_CHARACTERS, DATABASE_DESCRIPTION_MAX_CHARACTERS } from "../../../constants";

const MINIMUM_CHARACTERS = 4;

const EditDatabase = (props) => {
    const {
        modalEditCards,
        setModalEditCards,
        handleNameChange,
        valueName,
        handleDescrChange,
        valueDescr,
        SaveNameDescr,
        id,
        countName,
        countDescr,
        percentageName,
        percentageDescr,
    } = props;

    const { t } = useTranslation();

    const onCloseModal = () => {
        setModalEditCards(false);
    };

    const conditionMinCharacters = countName < MINIMUM_CHARACTERS || countDescr < MINIMUM_CHARACTERS;

    const onSendEdit = () => {
        SaveNameDescr({ databaseId: id });
        onCloseModal();
    };

    return (
        <ModalHeadlessSimple
            className="h-[33rem] w-[26rem] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            isShow={modalEditCards}
            closeModal={() => null}>
            <div className="items-center justify-between px-8 py-7 sm:flex">
                <div className=" text-cyan-500 sm:flex">
                    <h4 className="text-xl font-semibold text-primary-200">{t("datum.titleEditCard")}</h4>
                </div>
                <button onClick={onCloseModal}>
                    <CloseIcon1 className="fill-current text-xl text-primary-200" width="18" height="18" />
                </button>
            </div>
            <div className="grid place-content-center">
                <form onClick={(evt) => evt.stopPropagation()}>
                    <div className={conditionMinCharacters ? "h-[23rem] overflow-y-scroll pr-[0.6rem]" : ""}>
                        <div className="relative">
                            <h3 className="pl-2 pb-1 font-bold text-gray-400">{t("datum.name")}</h3>
                            <textarea
                                className={` border h-[5rem] resize-none  rounded-lg py-3 px-4 text-gray-610  focus:ring-transparent focus-visible:outline-none ${
                                    countName < MINIMUM_CHARACTERS
                                        ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                        : "border-gray-34 bg-white focus:border-gray-39"
                                }`}
                                onChange={handleNameChange}
                                type="text"
                                maxLength={DATABASE_NAME_MAX_CHARACTERS}
                                value={valueName}
                                rows="1"
                                cols="36"
                            />
                            {countName < MINIMUM_CHARACTERS && (
                                <div className="flex items-center gap-2 font-medium">
                                    <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                                </div>
                            )}
                            <div className="flex items-end justify-end ">
                                <span className="pr-1 text-xs">{countName + `/${DATABASE_NAME_MAX_CHARACTERS}`}</span>
                                <div className="" style={{ width: 18, height: 18 }}>
                                    <CircularProgressbar value={percentageName} />
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-[0.6rem]">
                            <h3 className="pl-2 pb-1 font-bold text-gray-400">{t("datum.descr")}</h3>
                            <textarea
                                className={`border h-[11rem] resize-none  rounded-lg py-3 px-4 text-gray-610  focus:ring-transparent focus-visible:outline-none ${
                                    countDescr < MINIMUM_CHARACTERS
                                        ? "!border-red-950 bg-red-1010 bg-opacity-10"
                                        : "border-gray-34 bg-white focus:border-gray-39"
                                }`}
                                onChange={handleDescrChange}
                                type="text"
                                maxLength={DATABASE_DESCRIPTION_MAX_CHARACTERS}
                                value={valueDescr}
                                rows="5"
                                cols="36"
                            />
                            {countDescr < MINIMUM_CHARACTERS && (
                                <div className="flex items-center gap-2 font-medium">
                                    <ErrorIcon /> <span className="text-xs text-red-1010">{t("datum.limiCharacter")}</span>
                                </div>
                            )}
                            <div className="flex items-end justify-end">
                                <span className="pr-1 text-xs">{countDescr + `/${DATABASE_DESCRIPTION_MAX_CHARACTERS}`}</span>
                                <div className="" style={{ width: 18, height: 18 }}>
                                    <CircularProgressbar value={percentageDescr} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="">
                        <div className="absolute bottom-0 left-[20%] mb-4 flex justify-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    onCloseModal();
                                }}
                                className="rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none">
                                {t("botsComponentDelete.cancel")}
                            </button>
                            <button
                                type="submit"
                                disabled={conditionMinCharacters}
                                className={`${
                                    conditionMinCharacters ? "h-[2.5rem] w-[10rem] rounded-20 bg-gray-35 px-2 text-gray-325" : "button-gradient-xl"
                                }  disabled:cursor-not-allowed disabled:bg-opacity-60`}
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    onSendEdit();
                                }}>
                                {t("datum.saveChanges")}
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </ModalHeadlessSimple>
    );
};

export default EditDatabase;
