import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";

import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { CHANNEL, CHANNEL_TYPES } from "../../../../constants";
import { areArraysEqual, areObjectsEqual, getNewArrayElements, getRemovedArrayElements } from "../../../../hooks/helpers";
import { createSwap, deleteSwap, useUpdateChannel } from "../../../../services/brainAPI";
import DeleteChannnel from "../deleteChannel";
import HeaderEditChannel from "./HeaderEditChannel";
import ChannelSettings from "./channelSettings";
import { isValidPhoneNumber } from "react-phone-number-input";

const EditChannel = (props) => {
    const { channelSelected = {}, setChannelSelected, refetchChannels, refetchChannel, isLoadingChannel, initialChannelSelected } = props;

    const { t } = useTranslation();
    const company = useSelector((state) => state.company);
    const { id: channelId = "", name: channelName, company_id, type, brain_id, reference_id, metadata = {}, ...rest } = channelSelected;
    const { inProduction = false, widgetProperties = {} } = metadata || {};
    const viewWidgetConfiguration = type === CHANNEL_TYPES.WEB;

    const [showPrincipalData, setShowPrincipalData] = useState(false);
    const [showSecondTab, setShowSecondTab] = useState(true);
    const [showThirdTab, setShowThirdTab] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
    const [testers, setTesters] = useState([""]);
    const [initialTesters, setInitialTesters] = useState([""]);
    const [selectedWidget, setSelectedWidget] = useState(widgetProperties);
    const [linkFromOnPromise, setLinkFromOnPromise] = useState(null);

    const { mutate: updateChannel, isLoading: updateChannelLoading } = useUpdateChannel({
        datastoreId: brain_id,
        channelId,
    });

    useEffect(() => {
        if (linkFromOnPromise)
            updateChannel(
                {
                    ...rest,
                    name: channelName,
                    company_id,
                    type,
                    client_secret: company.clientSecret,
                    client_id: company.clientId,
                    metadata: {
                        ...metadata,
                        ...(type === CHANNEL_TYPES.WEB && { widgetProperties: selectedWidget }),
                        ...linkFromOnPromise,
                    },
                },
                {
                    onSuccess: (data) => {
                        setChannelSelected(data);
                    },
                }
            );
        // .then(() => {
        //     refetchChannel();
        // });
    }, [linkFromOnPromise]);

    const onPromiseToProduction = (appName,phone) =>{
      updateChannel(
        {
            ...channelSelected,
            company_id,
            client_secret: company.clientSecret,
            client_id: company.clientId,
            metadata: {
                ...metadata,
                inProduction: true,
                properties:{
                  ...metadata.properties,
                  provider:{
                    ...metadata.properties.provider,
                    appName,
                    appId:metadata.app_id,
                    originalSource: phone,
                  }
                },
                gupshup_app_response: {
                  ...metadata.gupshup_app_response,
                  live: true
                }
            },
        },
        {
            onSuccess: (data) => {
                setChannelSelected(data);
            },
        }
    );
    }

    const showFirstView = () => {
        setShowPrincipalData(true);
        setShowSecondTab(false);
        setShowThirdTab(false);
    };

    const showSecondView = () => {
        setShowPrincipalData(false);
        setShowSecondTab(true);
        setShowThirdTab(false);
    };

    const showThirdView = () => {
        setShowPrincipalData(false);
        setShowSecondTab(false);
        setShowThirdTab(true);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const saveTester = async () => {
        try {
            let addPromises, removePromises, allPromises;
            const addedTesters = getNewArrayElements(testers, initialTesters);
            if (!isEmpty(addedTesters)) {
                addPromises = addedTesters.map(async (tester) => {
                    const phone = tester.replace("+", "");
                    return createSwap({ phone, referenceId: channelSelected?.reference_id });
                });
            }
            const removedTesters = getRemovedArrayElements(testers, initialTesters);
            if (!isEmpty(removedTesters)) {
                removePromises = removedTesters.map(async (tester) => {
                    const phone = tester.replace("+", "");
                    return deleteSwap({ phone });
                });
            }
            if (!isEmpty(addedTesters) && !isEmpty(removedTesters)) {
                allPromises = [...addPromises, ...removePromises].filter(Boolean);
            }
            if (!isEmpty(addedTesters)) {
                allPromises = [...addPromises].filter(Boolean);
            }
            if (!isEmpty(removedTesters)) {
                allPromises = [...removePromises].filter(Boolean);
            }

            await Promise.all(allPromises);
            if (areObjectsEqual(channelSelected, initialChannelSelected)) {
                toastMessage({
                    messagePart1: `${t("common.itemUpdated")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                    messagePart2: channelSelected.name,
                    type: MESSAGE_TYPES.SUCCESS,
                    position: TOAST_POSITION.TOP_RIGHT,
                })
            }
        } catch (err) {
            if (areObjectsEqual(channelSelected, initialChannelSelected)) {
                toastMessage({
                    messagePart1: `${t("common.itemNotUpdated")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                    messagePart2: channelSelected.name,
                    type: MESSAGE_TYPES.ERROR,
                    position: TOAST_POSITION.TOP_RIGHT,
                })
            }
        }
    };

    const handleEditChannel = async () => {
        switch (type) {
            case CHANNEL_TYPES.WHATSAPP:
                if (!inProduction) await saveTester();
                break;
            case CHANNEL_TYPES.WEB:
                setChannelSelected((prev) => ({ ...prev, metadata: { ...prev.metadata, widgetProperties: selectedWidget } }));
                break;
            default:
                break;
        }

        if (!areObjectsEqual(channelSelected, initialChannelSelected) || channelSelected.type === CHANNEL_TYPES.WEB) {
            updateChannel(
                {
                    ...rest,
                    name: channelName,
                    company_id,
                    type,
                    client_secret: company.clientSecret,
                    client_id: company.clientId,
                    metadata: {
                      ...metadata,
                      ...(type === CHANNEL_TYPES.WEB && { widgetProperties: selectedWidget }),
                  }
                },
                {
                    onSuccess: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemUpdated")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                            messagePart2: channelSelected.name,
                            type: MESSAGE_TYPES.SUCCESS,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                    onError: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemNotUpdated")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                            messagePart2: channelSelected.name,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                }
            );
        }
    };

    useEffect(() => {
        if (!isEmpty(widgetProperties)) {
            setSelectedWidget(widgetProperties);
        }
    }, [widgetProperties]);

    useEffect(() => {
        if (channelSelected?.type === CHANNEL_TYPES.WHATSAPP) {
            setIsSaveButtonDisabled(areArraysEqual(testers, initialTesters) && areObjectsEqual(channelSelected, initialChannelSelected) || !testers.every((phone) => isValidPhoneNumber(phone || "") ));
        }
    }, [testers, channelSelected?.name]);

    return (
        <div className="flex flex-1 flex-col">
            <HeaderEditChannel
                type={type}
                showPrincipalData={showPrincipalData}
                showSecondTab={showSecondTab}
                showThirdTab={showThirdTab}
                viewWidgetConfiguration={viewWidgetConfiguration}
                showFirstView={showFirstView}
                showSecondView={showSecondView}
                showThirdView={showThirdView}
                handleEditChannel={handleEditChannel}
                updateChannelLoading={updateChannelLoading}
                isSaveButtonDisabled={isSaveButtonDisabled}
                testers={testers}
            />
            <ChannelSettings
                channelSelected={channelSelected}
                setChannelSelected={setChannelSelected}
                showPrincipalData={showPrincipalData}
                showSecondTab={showSecondTab}
                showThirdTab={showThirdTab}
                refetchChannel={refetchChannel}
                openDeleteModal={openDeleteModal}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                closeDeleteModal={closeDeleteModal}
                testers={testers}
                setTesters={setTesters}
                setInitialTesters={setInitialTesters}
                isLoadingChannel={isLoadingChannel}
                selectedWidget={selectedWidget}
                setSelectedWidget={setSelectedWidget}
                handleEditChannel={handleEditChannel}
                setLinkFromOnPromise={setLinkFromOnPromise}
                linkFromOnPromise={linkFromOnPromise}
                onPromiseToProduction={onPromiseToProduction}
            />
            <DeleteChannnel openModal={showDeleteModal} closeModal={closeDeleteModal} channelSelected={channelSelected} refetchChannels={refetchChannels} />
        </div>
    );
};

export default EditChannel;
