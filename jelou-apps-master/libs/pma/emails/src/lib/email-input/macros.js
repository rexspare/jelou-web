import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import parse from "html-react-parser";
import { BarLoader } from "react-spinners";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { FormModal, ReactSelect } from "@apps/pma/ui-shared";

const Macros = (props) => {
    const { copyMacro, macros, closeModal, isLoading } = props;
    const { t } = useTranslation();

    const [macroPreview, setMacroPreview] = useState("");

    const parseMacrosToOption = (macrosList) => {
        const [companyMacros, teamMacros] = macrosList;
        const companyOptions = companyMacros.map((macro) => {
            return { value: macro.body, label: macro.displayName, id: macro.id, group: "company" };
        });
        const teamOptions = teamMacros.map((macro) => {
            return { value: macro.body, label: macro.displayName, id: macro.id, group: "team" };
        });
        return [
            {
                label: t("pma.Macros de las compañías"),
                options: companyOptions,
            },
            {
                label: t("pma.Macros de los equipos"),
                options: teamOptions,
            },
        ];
    };

    const handleChange = (macroSelected) => {
        const [companyMacros, teamMacros] = macros;
        const findMacro = macroSelected.group === "company" ? companyMacros : teamMacros;
        const macro = findMacro.find((macro) => macro.id === macroSelected.id);
        !isEmpty(macro) ? setMacroPreview(macro) : setMacroPreview("<p>Macro no selecionada</p>");
    };

    return (
        <FormModal title={t("Macros")} onClose={closeModal} maxWidth={"max-w-3xl"} canOverflow={true}>
            <div className="flex min-w-[24rem] flex-col">
                <div className="flex w-full flex-col">
                    <div className="mr-0 flex flex-col md:mr-12">
                        <div className="mid:w-350 mb-8 flex flex-col overflow-visible sm:mb-12">
                            <h2 className="block pb-2 font-bold text-gray-100 md:pb-6">{t("pma.Escoger macro")}</h2>
                            {isLoading ? (
                                <div className="flex h-12 w-full flex-row items-center justify-center border-b-default border-gray-35">
                                    <BarLoader size={30} color="#00b3c7" />
                                </div>
                            ) : !isEmpty(macros) ? (
                                <ReactSelect
                                    className="mx-auto w-full text-15"
                                    options={parseMacrosToOption(macros)}
                                    onChange={handleChange}
                                    placeholder={t("pma.Seleccionar un macro")}
                                />
                            ) : (
                                <div className="flex flex-row items-center border-b-default border-gray-35">
                                    <div className="flex h-12 w-full items-center truncate py-2 text-15 font-normal text-gray-450">
                                        {t("pma.No se encontró macros")}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {!isEmpty(macros) && !isEmpty(macroPreview) && (
                            <div className="order-1">
                                <h2 className="mb-1 block font-bold text-gray-100 md:mb-6">{t("pma.Vista Previa")}</h2>
                                <div className="ProseMirror max-h-201 md:max-w-600 overflow-y-auto overflow-x-hidden rounded-7.5 p-2">
                                    {parse(trim(macroPreview.body))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-modal-footer flex w-full items-center justify-center gap-3 rounded-b-lg pt-4 md:justify-end md:pt-8">
                    <button className="h-10 w-28 rounded-full bg-gray-10 font-bold text-gray-400 focus:outline-none" onClick={closeModal}>
                        {t("pma.Cancelar")}
                    </button>
                    <button
                        onClick={() => copyMacro({ macroPreview })}
                        disabled={isEmpty(macros)}
                        className="h-10 w-28 rounded-full bg-primary-200 font-bold text-white focus:outline-none">
                        {t("pma.Copiar")}
                    </button>
                </div>
            </div>
        </FormModal>
    );
};

export default Macros;