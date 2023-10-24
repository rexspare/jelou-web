/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

import { DATASOURCE, DATASOURCE_TYPES } from "../../../../constants";
import { Datasource, NextStep, STEPS, stateUser } from "./types";

import { toastMessage } from "@apps/shared/common";
import { CloseIcon1, SpinnerIcon } from "@apps/shared/icons";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";

import FileComponent from "libs/brain/src/lib/Modal/fileComponent";
import FlowComponent from "libs/brain/src/lib/Modal/flowComponent";
import SkillComponent from "libs/brain/src/lib/Modal/skillComponent";
import TextComponent from "libs/brain/src/lib/Modal/textComponent";
import WebComponent from "libs/brain/src/lib/Modal/webComponent";
import { validateObjectParams } from "libs/brain/src/lib/hooks/helpers";
import { useCreateDatasource } from "libs/brain/src/lib/services/brainAPI";

type FillDataProps = {
    closeModal: () => void;
    handleAddChannel: () => void;
    nextStep: (data: NextStep) => void;
    backStep: (data: Omit<NextStep, "data">) => void;
    datasourceState: {
        datasourceValues: Datasource;
        setDatasource: React.Dispatch<React.SetStateAction<Datasource>>;
    };
};

export function FillData({ backStep, closeModal, handleAddChannel, datasourceState }: FillDataProps) {
    const [disableButton, setDisableButton] = useState(true);
    const { datasourceValues, setDatasource } = datasourceState;
    const type = get(datasourceValues, "type", "");

    const { t } = useTranslation();

    const datastore = useSelector<stateUser, stateUser["datastore"]>((state) => state.datastore);

    const { isLoading, mutateAsync } = useCreateDatasource({ datastoreId: datastore?.id, datasourceInfo: datasourceValues });

    const TypeFrom: Record<string, JSX.Element> = {
        [DATASOURCE_TYPES.TEXT]: <TextComponent setDatasourceValues={setDatasource} datasourceValues={datasourceValues} />,
        [DATASOURCE_TYPES.FILE]: <FileComponent setDatasourceValues={setDatasource} datasourceValues={datasourceValues} />,
        [DATASOURCE_TYPES.WEBPAGE]: <WebComponent setDatasourceValues={setDatasource} datasourceValues={datasourceValues} />,
        [DATASOURCE_TYPES.WEBSITE]: <WebComponent setDatasourceValues={setDatasource} datasourceValues={datasourceValues} />,
        [DATASOURCE_TYPES.WORKFLOW]: <FlowComponent setDatasourceValues={setDatasource} datasourceValues={datasourceValues} handleAddChannel={handleAddChannel} />,
        [DATASOURCE_TYPES.SKILL]: <SkillComponent setDatasourceValues={setDatasource} datasourceValues={datasourceValues} />,
    };

    const back = () => {
        backStep({ currentStep: STEPS.FILL_DATA, nextStep: STEPS.SELECT_TYPE });
    };

    const handleSaveOrUpdate = async () => {
        try {
            await mutateAsync();
            toastMessage({
                messagePart1: `${t("common.itemCreated")} ${DATASOURCE.SINGULAR_LOWER}`,
                messagePart2: datasourceValues?.name,
                type: MESSAGE_TYPES.SUCCESS,
                position: TOAST_POSITION.TOP_RIGHT,
            });
        } catch (error) {
            toastMessage({
                messagePart1: `${t("common.itemNotCreated")} ${DATASOURCE.SINGULAR_LOWER}`,
                messagePart2: datasourceValues?.name,
                type: MESSAGE_TYPES.ERROR,
                position: TOAST_POSITION.TOP_RIGHT,
            });
        }
        closeModal();
    };

    useEffect(() => {
        let validate = {};
        if (type === DATASOURCE_TYPES.WORKFLOW || type === DATASOURCE_TYPES.SKILL) {
            validate = { metadata: true, description: true };
        } else {
            validate = { metadata: true };
        }
        const isValid = validateObjectParams({ obj: datasourceValues, validate });
        setDisableButton(!isValid);
    }, [datasourceValues]);

    return (
        <main className="flex h-full flex-col">
            <header className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-medium text-primary-200">{`${t("common.fillIn")} ${DATASOURCE.SINGULAR_LOWER}`}</h3>
                <button onClick={closeModal}>
                    <CloseIcon1 fill="currentColor" className="text-primary-200" width={14} heigth={14} />
                </button>
            </header>

            <div className="">{TypeFrom[type] || <div>Not found</div>}</div>

            <footer className="mt-auto mb-0 flex items-center justify-end gap-x-4">
                <button type="button" onClick={back} className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400">
                    {`${t("common.back")}`}
                </button>
                <button
                    onClick={handleSaveOrUpdate}
                    type="submit"
                    disabled={isLoading || disableButton}
                    className="min-w-fit button-primary flex h-9 w-28 items-center justify-center px-5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? <SpinnerIcon /> : `${t("common.create")}`}
                </button>
            </footer>
        </main>
    );
}
