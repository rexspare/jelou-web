import isEmpty from "lodash/isEmpty";
import { BeatLoader } from "react-spinners";
import { withTranslation } from "react-i18next";
import { HexColorPicker, HexColorInput } from "react-colorful";

import { Modal } from "@apps/shared/common";
import { Label, Input } from "@apps/shared/common";
import { MultiCombobox } from "@apps/shared/common";
import { HelpTooltip, CloseIcon } from "@apps/shared/icons";

const CreateTag = (props) => {
    const {
        t,
        bots,
        title,
        color,
        teams,
        onClose,
        loading,
        onSubmit,
        setColor,
        addButton,
        handleAll,
        handleChange,
        onChangeBots,
        selectedBots,
        onChangeTeams,
        selectedTeams,
        cleanBotFilter,
        cleanTeamFilter,
        messageErrorName,
        messageErrorCheckBox,
    } = props;

    const inputCheckboxCheck =
        "h-5 w-5 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-490/75" />
                </div>
                <div className="min-w-350 transform rounded-lg bg-white px-6 pt-5 pb-4 transition-all">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="max-w-md font-bold text-gray-400">{title}</div>
                        </div>
                        <button onClick={onClose}>
                            <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                        </button>
                    </div>
                    <form action="" onSubmit={onSubmit}>
                        <div className="mt-5 flex flex-col space-y-8 md:mt-0">
                            <div>
                                <Label name={t("monitoring.Nombre")} />
                                <div className="flex-1 pt-1">
                                    <Input
                                        className="input"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder={"ej: Tag de prueba"}
                                        name="name"
                                        required
                                    />
                                </div>
                                {!isEmpty(messageErrorName) && (
                                    <span className="pt-px text-right text-xs italic text-red-500">{messageErrorName}</span>
                                )}
                            </div>
                            <div>
                                <Label name={t("monitoring.Color")} />
                                <div className="flex-1 space-y-4 pt-1">
                                    <HexColorInput className="input" color={color} onChange={setColor} />
                                    <div className="flex justify-center">
                                        <HexColorPicker color={color} onChange={setColor} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 flex space-x-8">
                                <div className="relative flex items-center pb-2">
                                    <HelpTooltip message={t("monitoring.Esta etiqueta se creara para todos tus bots y equipos")} />
                                    <Label name={t("monitoring.Todos")} />
                                </div>
                                <div className="w-full items-center sm:col-span-2">
                                    <input checked={addButton} onChange={handleAll} name="addButton" type="checkbox" className={inputCheckboxCheck} />
                                </div>
                            </div>
                            {!addButton && (
                                <>
                                    <div className="flex flex-col space-y-3">
                                        <Label name={t("monitoring.Equipo")} />
                                        <MultiCombobox
                                            handleChange={onChangeTeams}
                                            value={selectedTeams}
                                            name={"teams"}
                                            placeholder={t("monitoring.Equipos")}
                                            options={teams}
                                            background={"#fff"}
                                            clearFilter={cleanTeamFilter}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Label name={"Bots"} />
                                        <MultiCombobox
                                            handleChange={onChangeBots}
                                            value={selectedBots}
                                            name={"bots"}
                                            options={bots}
                                            background={"#fff"}
                                            clearFilter={cleanBotFilter}
                                            placeholder="Bots"
                                        />
                                    </div>
                                </>
                            )}
                            <span className="pt-px text-right text-xs italic text-red-500">{messageErrorCheckBox}</span>
                            <div className="flex flex-row items-center justify-end sm:mt-6">
                                <span className="mr-2 w-32">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="w-full rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none">
                                        {t("monitoring.Cerrar")}
                                    </button>
                                </span>
                                <span className="w-32">
                                    <button type="submit" className={`button-primary w-full`} disabled={loading}>
                                        {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("monitoring.Crear")}`}
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default withTranslation()(CreateTag);
