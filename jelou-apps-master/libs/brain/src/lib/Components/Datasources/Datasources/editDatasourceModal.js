import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { DatabaseIcon2 } from "@apps/shared/icons";
import { DATASOURCE, DATASOURCE_TYPES, DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../constants";
import { validateObjectParams } from "../../../hooks/helpers";
import { useUpdateDatasource } from "../../../services/brainAPI";
import { Modal } from "../../../Modal";
import DescriptionComponent from "../../../Modal/descriptionComponent";
import ModalFooter from "../../../Modal/modalFooter";
import ModalHeader from "../../../Modal/modalHeader";
import NameComponent from "../../../Modal/nameComponent";

const EditDatasourceModal = (props) => {
    const { openModal, closeModal, refetchDatasources } = props;
    const { t } = useTranslation();
    const datastore = useSelector((state) => state.datastore);
    const datasource = useSelector((state) => state.datasource);
    const [disableButton, setDisableButton] = useState(true);
    const [isDatasourceTypeFlow, setIsDatasourceTypeFlow] = useState(false);
    const [datasourceValues, setDatasourceValues] = useState({
        name: "",
        description: "",
        type: DATASOURCE_TYPES.TEXT,
        metadata: {},
    });

    const { mutateAsync: updateExistingDatasource, isLoading: isUpdatingDatasource } = useUpdateDatasource({
        datastoreId: datastore?.id,
        datasourceId: datasource?.id,
        newDatasourceInfo: datasourceValues,
    });

    const resetDatasourceParams = () => {
        setDatasourceValues({
            name: datasource?.name,
            description: datasource?.description,
            type: datasource?.type,
            metadata: datasource?.metadata,
        });
    };

    const handleUpdateDatasourceParams = (e) => {
        const { name, value } = e.target;
        setDatasourceValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateExistingDatasource(datasourceValues);
            toastMessage({
                messagePart1: `${t("common.itemUpdated")} ${DATASOURCE.SINGULAR_LOWER}`,
                messagePart2: datasourceValues.name,
                type: MESSAGE_TYPES.SUCCESS,
                position: TOAST_POSITION.TOP_RIGHT,
            });
            refetchDatasources();
        } catch (error) {
            toastMessage({
                messagePart1: `${t("common.itemNotUpdated")} ${DATASOURCE.SINGULAR_LOWER}`,
                messagePart2: datasourceValues.name,
                type: MESSAGE_TYPES.ERROR,
                position: TOAST_POSITION.TOP_RIGHT,
            });
        }
        resetDatasourceParams();
        closeModal();
    };

    const handleCloseModal = () => {
        resetDatasourceParams();
        closeModal();
    };

    useEffect(() => {
        let validate = { name: true };
        if (isDatasourceTypeFlow) {
            validate.description = true;
        }
        const isValid = validateObjectParams({ obj: datasourceValues, validate });
        setDisableButton(!isValid);
    }, [datasourceValues, isDatasourceTypeFlow]);

    useEffect(() => {
        resetDatasourceParams();
        setIsDatasourceTypeFlow(datasource?.type === DATASOURCE_TYPES.WORKFLOW);
    }, [datasource]);

    return (
        <Modal closeModal={() => null} openModal={openModal} className="h-min w-[584px] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]" classNameActivate="">
            <div className="h-full flex-row">
                <ModalHeader
                    icon={<DatabaseIcon2 width="21px" height="24px" className="text-primary-200" />}
                    title={`${t("common.update")} ${DATASOURCE.SINGULAR_LOWER}`}
                    closeModal={() => handleCloseModal()}
                />
                <form onSubmit={handleSubmit}>
                    <div className="px-10 py-8">
                        <div className="text-sm text-gray-400">
                            <div className="font-base mb-5">{`${t("common.updateInstruction")} ${DATASOURCE.SINGULAR_LOWER}.`}</div>
                            <div className="flex flex-row gap-x-5">
                                <div className="w-full">
                                    <NameComponent
                                        placeholder={DATASOURCE.SINGULAR_CAPITALIZED}
                                        onChange={handleUpdateDatasourceParams}
                                        itemValues={datasourceValues}
                                        maxLength={NAME_MAX_LENGTH}
                                        length={datasourceValues?.name?.length}
                                        minLength={NAME_MIN_LENGTH}
                                    />
                                </div>
                            </div>
                            <DescriptionComponent
                                placeholder={DATASOURCE.SINGULAR_LOWER}
                                onChange={handleUpdateDatasourceParams}
                                itemValues={datasourceValues}
                                maxLength={DESCRIPTION_MAX_LENGTH}
                                minLength={DESCRIPTION_MIN_LENGTH}
                                length={datasourceValues?.description?.length}
                            />
                        </div>
                    </div>
                    <ModalFooter closeModal={() => handleCloseModal()} loading={isUpdatingDatasource} disableButton={disableButton} isEditing={true} className="mx-10 pb-8" />
                </form>
            </div>
        </Modal>
    );
};

export default EditDatasourceModal;
