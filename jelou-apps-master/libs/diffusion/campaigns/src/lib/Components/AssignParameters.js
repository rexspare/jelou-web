import React from "react";
import { BeatLoader } from "react-spinners";
import { PenIcon } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

const AssignParameters = (props) => {
    const { fileRows, selectedHsm, arrayColumns, paramSelected, setParamSelected, checkComplete, loading } = props;
    const { t } = useTranslation();
    const options = !isEmpty(arrayColumns) ? arrayColumns : [];

    const allParams = !isEmpty(selectedHsm.buttonParams) ? [...selectedHsm.params, ...selectedHsm.buttonParams] : selectedHsm.params;

    return (
        <div>
            <div className="flex flex-col">
                <div className="-my-2 sm:-mx-6 lg:-mx-8">
                    <div className="flex min-w-full flex-col py-2 align-middle sm:px-6 lg:px-8">
                        <p className="mb-3 text-xl font-bold text-gray-400">{t("assignParameters.match")}</p>
                        <div className="border-options overflow-x-auto sm:rounded-lg">
                            <table className="divide-y min-h-full min-w-full divide-gray-200">
                                <thead className="bg-gray-10">
                                    <tr>
                                        {[{ param: "0", label: t("assignParameters.phone") }].concat(allParams).map((param, index) => (
                                            <th
                                                key={index.toString()}
                                                scope="col"
                                                className="relative h-10 flex-none px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400 text-opacity-75">
                                                <span className="flex">
                                                    {get(param, "label")}{" "}
                                                    {index !== 0 && (
                                                        <PenIcon className="pointer-events-none z-10 h-4 w-4" fill="none" stroke="currentColor" />
                                                    )}
                                                    <div className="absolute right-0 top-0 flex h-full w-full justify-items-center">
                                                        <label htmlFor={`${index}-select`} className="flex">
                                                            <select
                                                                id={`${index}-select`}
                                                                className="opacity-0"
                                                                value={paramSelected[index]}
                                                                onChange={(e) => {
                                                                    const update = [...paramSelected];
                                                                    update[index] = parseInt(e.target.value);
                                                                    setParamSelected(update);
                                                                    checkComplete(update);
                                                                }}>
                                                                {options.map((option, optionIndex) => {
                                                                    return (
                                                                        <option key={optionIndex} value={option.id}>
                                                                            {option.name}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </label>
                                                    </div>
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr className="mt-1 w-full bg-gray-400/25 leading-9">
                                            {paramSelected.map((item, index) => (
                                                <td key={index} className=" justify-center whitespace-nowrap px-6 py-4">
                                                    <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                                                </td>
                                            ))}
                                        </tr>
                                    ) : (
                                        fileRows.slice(1, fileRows.length > 5 ? 6 : fileRows.length).map((row, index) => (
                                            <tr key={index.toString()} className={`${index % 2}` ? `bg-white` : `bg-gray-400/25`}>
                                                {paramSelected.map((field, fieldIndex) =>
                                                    fieldIndex === 0 ? (
                                                        <td
                                                            key={fieldIndex.toString()}
                                                            className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-375">
                                                            {row[0]}
                                                        </td>
                                                    ) : field === 0 ? (
                                                        <td
                                                            key={fieldIndex.toString()}
                                                            className="whitespace-nowrap px-6 py-4 text-sm text-gray-600"></td>
                                                    ) : (
                                                        <td
                                                            key={fieldIndex.toString()}
                                                            className="whitespace-nowrap px-6 py-4 text-sm font-normal text-gray-600">
                                                            {row[field]}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignParameters;
