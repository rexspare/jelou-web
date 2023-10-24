import * as React from "react";
//import styles from "./msg-category-step2.module.css";

export function MsgCategoryStep2(props) {
    const {
        hsmCategoryOptions,
        setHsmCategory,
        templateModalInputNames,
        hsmCategory,
        setLockStep,
        setSelectedType,
        t,
        setButtonsHsm,
        allowChangeCat,
        setAllowChangeCat,
        inputCheckboxClassName,
        values,
        setValues,
        setFinallySteps,
        finallySteps,
        setParamsNew,
    } = props;

    const handleCheckAllowChangeCat = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        if (e.target.type === "checkbox") {
            if (value) {
                setAllowChangeCat(true);
            } else {
                setAllowChangeCat(false);
            }
        }
    };

    React.useEffect(() => {
        setLockStep(false);
        const newfinally = { ...finallySteps, step2: true };
        setFinallySteps(newfinally);
    }, []);

    React.useEffect(() => {
        let newValues = {};
        if (hsmCategory === "AUTHENTICATION") {
            setSelectedType({ id: "NONE", name: t("hsm.none") });
            setButtonsHsm([{ text: "", type: "" }]);
            newValues = { ...values, paramsNumber: "0", template: "", templateExample: "", footer: "" };
            setParamsNew([]);
            setValues(newValues);
        }
    }, [hsmCategory]);

    const inputCheckboxCheck =
        "mt-1 mr-2 h-5 w-5 rounded-[50%] border-2 mt-[0.7rem] border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";
    return (
        <div className="px-12 pt-12 pb-4">
            <h1 className="pb-5 text-xl font-bold  text-gray-400 ">{templateModalInputNames.category}</h1>
            <div className="flex flex-1 cursor-pointer flex-col sm:col-span-2">
                {hsmCategoryOptions.map((param, index) => {
                    return (
                        <div className={"mb-1 flex flex-1"} key={index} onClick={() => setHsmCategory(param.id)}>
                            <input
                                checked={hsmCategory === param.id}
                                onChange={() => {
                                    setHsmCategory(param.id);
                                }}
                                name="isVisible"
                                type="checkbox"
                                className={inputCheckboxCheck}
                            />
                            <div className="flex max-w-xs flex-1 flex-col p-2 ">
                                <p className={`text-base font-bold ${hsmCategory === param.id ? "text-primary-200" : "text-black"} `}>{param.name}</p>
                                <p className="text-sm text-gray-400">{param.info}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center pt-3">
                <input checked={allowChangeCat} onChange={handleCheckAllowChangeCat} name="allowChangeCategory" type="checkbox" className={inputCheckboxClassName} value={allowChangeCat} />
                <p className="pl-4 text-[0.9rem]">{t("hsm.createTemplateModal.letMetaChangeTmpl")}</p>
            </div>
        </div>
    );
}
export default MsgCategoryStep2;
