/* eslint-disable @nx/enforce-module-boundaries */
import { useState } from "react";
import { t } from "i18next";

import { Modal } from "libs/brain/src/lib/Modal";
import { NavigationModal } from "libs/shop/src/lib/components/CreateProduct/Manually/Navigations";

import { FillData } from "./FillData";
import { PrincipalData } from "./PrincipalData";
import { SelectTypeData } from "./SelectionType";
import { INIT_STEPS_LIST } from "./consts";
import { DATASOURCE } from "libs/brain/src/lib/constants";
import { Datasource, NextStep, STEPS } from "./types";

type Props = {
    isOpen: boolean;
    closeModal: () => void;
    handleAddChannel: () => void;
};

export const CreateDataSource = ({ isOpen, closeModal, handleAddChannel }: Props) => {
    const [step, setStep] = useState(STEPS.PRINCIPAL_DATA);
    const [stepsList, setStepsList] = useState(INIT_STEPS_LIST);
    const [datasource, setDatasource] = useState<Datasource>({} as Datasource);

    const customCloseModal = () => {
        setStep(STEPS.PRINCIPAL_DATA);
        setStepsList(INIT_STEPS_LIST);
        setDatasource({} as Datasource);
        closeModal();
    };

    const nextStep = ({ currentStep, nextStep, data }: NextStep) => {
        setDatasource({ ...datasource, ...data });
        setStep(nextStep);
        setStepsList((preState) =>
            preState.map((step) => {
                if (step.id === currentStep) {
                    return { ...step, isActive: false, isComplete: true };
                }
                if (step.id === nextStep) {
                    return { ...step, isActive: true };
                }
                return { ...step, isActive: false };
            })
        );
    };

    const backStep = ({ currentStep, nextStep }: Omit<NextStep, "data">) => {
        setStep(nextStep);
        setStepsList((preState) =>
            preState.map((step) => {
                if (step.id === currentStep) {
                    return { ...step, isActive: false, isComplete: false };
                }
                if (step.id === nextStep) {
                    return { ...step, isActive: true, isComplete: false };
                }
                return { ...step, isActive: false };
            })
        );
    };

    const PANELS = {
        [STEPS.PRINCIPAL_DATA]: <PrincipalData datasource={datasource} closeModal={customCloseModal} nextStep={nextStep} />,
        [STEPS.SELECT_TYPE]: <SelectTypeData datasource={datasource} closeModal={customCloseModal} nextStep={nextStep} backStep={backStep} />,
        [STEPS.FILL_DATA]: (
            <FillData datasourceState={{ datasourceValues: datasource, setDatasource }} closeModal={customCloseModal} nextStep={nextStep} backStep={backStep} handleAddChannel={handleAddChannel} />
        ),
    };

    return (
        <Modal closeModal={() => null} openModal={isOpen} className="h-[637px] w-[55rem] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]" classNameActivate="">
            <div className="grid h-full grid-cols-[17rem_auto]">
                <section className="h-[637px] bg-primary-350">
                    <h3 className="py-9 pl-12 text-xl font-semibold text-primary-200">{`${t("common.create")} ${DATASOURCE.SINGULAR_CAPITALIZED}`}</h3>
                    {/* {isUpdate ? ( */}
                    {/* <UptatingNav stepsList={stepsList} navigateWithSteps={navigateWithSteps} /> */}
                    {/* ) : ( */}
                    <NavigationModal stepsList={stepsList} />
                    {/* )} */}
                </section>
                <section className="h-[637px] p-9">{PANELS[step]}</section>
            </div>
        </Modal>
    );
};
