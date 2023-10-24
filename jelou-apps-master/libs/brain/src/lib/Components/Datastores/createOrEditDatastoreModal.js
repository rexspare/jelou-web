import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";

import { toastMessage } from "@apps/shared/common";
import { BBDDIcon } from "@apps/shared/icons";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { DATASTORE, DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../constants";
import { validateObjectParams } from "../../hooks/helpers";
import { useCreateDatastore, useUpdateDatastore } from "../../services/brainAPI";
import { Modal } from "../../Modal";
import ModalHeader from "../../Modal/modalHeader";
import NameComponent from "../../Modal/nameComponent";
import DescriptionComponent from "../../Modal/descriptionComponent";
import ModalFooter from "../../Modal/modalFooter";

const CreateOrEditDatastoreModal = (props) => {
    const { openModal, closeModal, isEditing, revalidate } = props;
    const { t } = useTranslation();
    const datastore = useSelector((state) => state.datastore);
    const [disableButton, setDisableButton] = useState(true);
    const [datastoreValues, setDatastoreValues] = useState({ name: "", description: "" });

    const { mutateAsync: createNewDatastore, isLoading: isCreatingDatastore } = useCreateDatastore({
        datastoreInfo: datastoreValues,
    });

    const { mutateAsync: updateExistingDatastore, isLoading: isUpdatingDatastore } = useUpdateDatastore({
        datastoreId: datastore?.id,
        datastoreInfo: datastoreValues,
    });

    const resetDatastoreParams = () => {
        setDatastoreValues({
            name: isEditing ? datastore?.name : "",
            description: isEditing ? datastore?.description : "",
        });
    };

    const handleUpdateDatastoreParams = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setDatastoreValues({
            ...datastoreValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            isEditing ? await updateExistingDatastore(datastoreValues) : await createNewDatastore(datastoreValues);
            toastMessage({
                messagePart1: `${isEditing ? t("common.itemUpdated") : t("common.itemCreated")} ${DATASTORE.SINGULAR_LOWER}`,
                messagePart2: datastoreValues.name,
                type: MESSAGE_TYPES.SUCCESS,
                position: TOAST_POSITION.TOP_RIGHT,
            });
            if (isEditing) {
                revalidate();
            }
        } catch (error) {
            toastMessage({
                messagePart1: `${isEditing ? t("common.itemNotUpdated") : t("common.itemNotCreated")} ${DATASTORE.SINGULAR_LOWER}`,
                messagePart2: datastoreValues.name,
                type: MESSAGE_TYPES.ERROR,
                position: TOAST_POSITION.TOP_RIGHT,
            });
        } finally {
            resetDatastoreParams();
            closeModal();
        }
    };

    const handleCloseModal = () => {
        resetDatastoreParams();
        closeModal();
    };

    useEffect(() => {
        const isValid = validateObjectParams({ obj: datastoreValues, validate: { name: true } });
        setDisableButton(!isValid);
    }, [datastoreValues]);

    useEffect(() => {
        resetDatastoreParams();
    }, [isEditing, datastore]);

    return (
        <Modal
            closeModal={() => null}
            openModal={openModal}
            className="h-min w-[584px] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            classNameActivate="">
            <div className="h-full flex-row">
                <ModalHeader
                    title={`${isEditing ? t("common.update") : t("common.create")} ${DATASTORE.SINGULAR_LOWER}`}
                    closeModal={() => handleCloseModal()}
                    icon={<BBDDIcon width="1.6rem" height="1.6rem" />}
                />
                <form onSubmit={handleSubmit}>
                    <div className="px-10 py-8">
                        <div className="text-sm text-gray-400">
                            <div className="font-base mb-5">
                                {`${isEditing ? t("common.updateInstruction") : t("common.createInstruction")} ${DATASTORE.SINGULAR_LOWER}.`}
                            </div>
                            <NameComponent
                                placeholder={DATASTORE.SINGULAR_CAPITALIZED}
                                onChange={handleUpdateDatastoreParams}
                                itemValues={datastoreValues}
                                maxLength={NAME_MAX_LENGTH}
                                length={datastoreValues?.name?.length}
                                minLength={NAME_MIN_LENGTH}
                            />
                            <DescriptionComponent
                                placeholder={DATASTORE.SINGULAR_LOWER}
                                onChange={handleUpdateDatastoreParams}
                                itemValues={datastoreValues}
                                maxLength={DESCRIPTION_MAX_LENGTH}
                                length={datastoreValues?.description?.length}
                            />
                        </div>
                    </div>
                    <ModalFooter
                        closeModal={() => handleCloseModal()}
                        loading={isCreatingDatastore || isUpdatingDatastore}
                        disableButton={disableButton}
                        isEditing={isEditing}
                        className={"mx-10 pb-8"}
                    />
                </form>
            </div>
        </Modal>
    );
};

export default CreateOrEditDatastoreModal;
