import React from "react";
import { Trans, useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";

//import { CloudIcon, OnPremiseIcon } from "@apps/shared/icons";
import { CREATE_PRODUCTION_STEP, PRODUCTION_TYPE_WA } from "../../../../constants";
import ModalFooter1 from "../../../../Modal/modalFooter1";
import OnPremiseIcon from "../../../../assets/WA_On_Premise.png";
import CloudIcon from "../../../../assets/WA_Cloud.png";

const ChooseEnvironment = (props) => {
    const { environment, setEnvironment, closeModal, handlePrimaryClick, isLoadingProductionPremise } = props;
    const { t } = useTranslation();

    return (
        <section className="flex flex-col space-y-6 p-8">
            <span className="text-sm text-gray-400">
                <Trans i18nKey="brain.Para pasar el canal al ambiente de produccion, asi podras conectar y asignar un numero telefonico al mismo. Selecciona una opcion para realizar el proceso" />
            </span>
            <div className="flex justify-around space-x-4">
                <button
                    className={`flex flex-col items-center justify-around rounded-xl ${
                        environment === PRODUCTION_TYPE_WA.ON_PREMISE ? "border-1 border-primary-200" : "border-1 border-gray-34"
                    }`}
                    style={{ width: 200, height: 200 }}
                    onClick={() => setEnvironment(PRODUCTION_TYPE_WA.ON_PREMISE)}>
                    <img
                        src={OnPremiseIcon}
                        alt="On Premise"
                    />
                    <span className="font-bold text-gray-610">On Premise</span>
                </button>
                <button
                    className={`flex flex-col items-center justify-around rounded-xl ${
                        environment === PRODUCTION_TYPE_WA.CLOUD ? "border-1 border-primary-200" : "border-1 border-gray-34"
                    }`}
                    style={{ width: 200, height: 200 }}
                    onClick={() => setEnvironment(PRODUCTION_TYPE_WA.CLOUD)}>
                    <img
                        src={CloudIcon}
                        alt="Cloud"
                    />
                    <span className="font-bold text-gray-610">Cloud</span>
                </button>
            </div>
            <ModalFooter1
                closeModal={closeModal}
                loading={isLoadingProductionPremise}
                primaryText={t("common.next")}
                disableButton={isEmpty(environment)}
                primaryAction={() => handlePrimaryClick(CREATE_PRODUCTION_STEP.ENVIRONMENT)}
            />
        </section>
    );
};
export default ChooseEnvironment;
