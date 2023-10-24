import React from "react";

import { BeatLoader } from "react-spinners";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import { SearchSelect } from "@apps/shared/common";
import { useTranslation } from "react-i18next";

const ParamsInput = (props) => {
    const {
        params,
        hsm,
        hasMoreBots,
        currentOption,
        options,
        paramSelected,
        setParamSelected,
        paramsValue,
        setParamsValue,
        setSelectAllParams,
        setHasParams,
        isLoading,
    } = props;
    const { t } = useTranslation();
    const checkComplete = (arrayCheck) => {
        if (!isEmpty(arrayCheck.slice(1))) {
            let count = 0;
            const exist = arrayCheck.slice(1);
            exist.forEach((element) => {
                if (element === "0") {
                    count++;
                }
            });
            if (count === 0) setSelectAllParams({ value: true });
            else setSelectAllParams({ value: false });
        }
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;
        const updated = { ...paramsValue, [name]: value };

        /**
         * Will search for every element inside the paramsValue updated object. Trim the value
         * Returns true if a param got an empty value. returns True if all are filled or there's no one to fill
         */
        let count = 0;
        const values = Object.keys(updated);
        values.forEach((value) => {
            const val = updated[value].trim();
            if (isEmpty(val)) {
                count++;
            }
        });
        setParamsValue({ ...paramsValue, [name]: value });
        if (count === 0) {
            setHasParams({ value: false });
        } else {
            setHasParams({ value: true });
        }
    };

    if (!isEmpty(params) && !isEmpty(hsm))
        return (
            <div className={`flex ${hasMoreBots ? "flex-col md:flex-row md:pb-8" : "flex-col md:pb-0"}`}>
                <div className="flex w-full flex-col pb-4">
                    <div className={`${!hasMoreBots && "mr-8"}`}>
                        <label className={`mb-2 block font-bold text-gray-400`}>{t("pma.Parámetros")}</label>
                        {isLoading ? (
                            <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                        ) : (
                            params.map((param, index) => {
                                return (
                                    <div className="flex flex-col" key={index}>
                                        {currentOption === 1 ? (
                                            <input
                                                type="text"
                                                placeholder={`{{${param.param}}} ${param.label}`}
                                                value={get(paramsValue, `${param.label}`, "")}
                                                name={param.label}
                                                onChange={handleChange}
                                                className="mb-2 flex h-9 appearance-none items-center rounded-none border-0 border-b-default border-gray-35 text-15 font-medium focus:border-gray-35 focus:ring-transparent"
                                            />
                                        ) : (
                                            <div className="mb-2 flex flex-col mid:w-325">
                                                <label className="text-gray-450 block text-sm">{`{{${param.param}}} ${param.label}`}</label>
                                                <SearchSelect
                                                    className="hidden w-full text-15 sm:flex mid:w-325"
                                                    options={options}
                                                    value={paramSelected[index + 1] === "0" ? 0 : paramSelected[index + 1]}
                                                    hasAll={false}
                                                    onChange={(option) => {
                                                        const update = [...paramSelected];
                                                        update[index + 1] = option;
                                                        setParamSelected(new Array(...update));
                                                        checkComplete(update);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
};

export default ParamsInput;
