import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { CHANNEL, CHANNEL_TYPES, NAME_MIN_LENGTH_WHATSAPP } from "../../../../constants";
import { TriangleOfCircles } from "@apps/shared/icons";
import { validateObjectParams } from "../../../../hooks/helpers";
import { createSwap, useCreateChannel } from "../../../../services/brainAPI";
import { Modal } from "../../../../Modal";
import ModalHeader from "../../../../Modal/modalHeader";
import ChannelTypeCarousel from "./channelTypeCarousel";
import ModalFooter from "../../../../Modal/modalFooter";
import HandleChannels from "../HandleChannels";

const CreateChannelModal = (props) => {
    const navigate = useNavigate();
    const { openModal, closeModal, setShowQrSettings } = props;
    const { t } = useTranslation();
    const { datastoreId } = useParams();
    const company = useSelector((state) => state?.company);
    const [disableButton, setDisableButton] = useState(true);
    const [areAllPhoneNumbersValid, setAreAllPhoneNumbersValid] = useState(false);
    const [channelSelected, setChannelSelected] = useState("");
    const [showChannelTypeCarousel, setShowChannelTypeCarousel] = useState(true);
    const [testers, setTesters] = useState([""]);
    const [authWithFacebook, setAuthWithFacebook] = useState({});
    const [instagramRequirementsView, setInstagramRequirementsView] = useState(true);
    const [channelValues, setChannelValues] = useState({
        name: "",
        type: "",
        company_id: company?.id,
        client_secret: company?.clientSecret,
        client_id: company?.clientId,
    });

    const { mutateAsync: mutateChannel, isLoading } = useCreateChannel({ datastoreId, body: channelValues });

    const resetValues = () => {
        setShowChannelTypeCarousel(true);
        setChannelValues({
            name: "",
            type: "",
            company_id: company?.id,
            client_secret: company?.clientSecret,
            client_id: company?.clientId,
        });
        setTesters([""]);
        setChannelSelected("");
        setDisableButton(true);
        setAreAllPhoneNumbersValid(false);
    };

    const handleCloseModal = () => {
        resetValues();
        closeModal();
    };

    const handleUpdateChannelValues = (e) => {
        let { name, value } = e.target;
        value = name === "name" ? value.replace(/[^a-zA-Z0-9 ]/g, '') : value
        setChannelValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        !isEmpty(channelSelected) ? setShowChannelTypeCarousel(false) : setShowChannelTypeCarousel(true);
        if (!showChannelTypeCarousel) {
            await mutateChannel(
                {},
                {
                    onSuccess: async (data) => {
                        if (channelValues.type === CHANNEL_TYPES.WHATSAPP) {
                            const referenceId = get(data, "reference_id", "");
                            const swapPromises = testers.map(async (tester) => {
                                const phone = tester.replace("+", "");
                                return createSwap({ phone, referenceId });
                            });
                            await Promise.all(swapPromises);
                        }
                        !window.location.pathname.endsWith("knowledge") && navigate(`${data?.id}/edit`);
                        toastMessage({
                            messagePart1: `${t("common.itemCreated")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                            messagePart2: channelSelected.name,
                            type: MESSAGE_TYPES.SUCCESS,
                            position: TOAST_POSITION.TOP_RIGHT,
                        });
                    },
                    onError: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemNotCreated")} ${t(CHANNEL.SINGULAR_LOWER)}`,
                            messagePart2: channelSelected.name,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                }
            );
            resetValues();
            closeModal();
            channelValues.id === CHANNEL_TYPES.WHATSAPP && setShowQrSettings(true);
        }

        setDisableButton(true);
        setAreAllPhoneNumbersValid(false);
    };

    const handleSelectChannel = (channel) => {
        setChannelSelected(channel);
        setDisableButton(false);
        setAreAllPhoneNumbersValid(true);
        if (channel.id === CHANNEL_TYPES.WEB) {
            setChannelValues((prevValues) => ({
                ...prevValues,
                type: channel?.id,
                metadata: { ...prevValues.metadata, widgetProperties: widget },
            }));
        } else {
            setChannelValues((prevValues) => ({
                ...prevValues,
                type: channel?.id,
            }));
        }
    };

    useEffect(() => {
        if (!showChannelTypeCarousel) {
            const isValid = validateObjectParams({ obj: channelValues, validate: { name: true } });
            setDisableButton(!isValid);
        }
    }, [channelValues]);

    const isDisabled = () => {
        switch (channelSelected?.id) {
            case CHANNEL_TYPES.WHATSAPP:
                return disableButton || !areAllPhoneNumbersValid;
            case CHANNEL_TYPES.FACEBOOK:
                return !(channelValues?.metadata !== undefined || channelValues.metadata?.access_token !== undefined) && !showChannelTypeCarousel;
            case CHANNEL_TYPES.INSTAGRAM:
                return !(channelValues?.metadata !== undefined || channelValues.metadata?.access_token !== undefined) && !showChannelTypeCarousel;
            case CHANNEL_TYPES.WEB: {
                return disableButton;
            }
            default:
                return disableButton || !areAllPhoneNumbersValid;
        }
    };

    return (
        <Modal closeModal={() => null} openModal={openModal} className="h-min w-1/3 !overflow-visible rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]" classNameActivate="">
            <div className="h-full flex-row">
                <ModalHeader icon={<TriangleOfCircles />} title={`${t("common.create")} ${t(CHANNEL.SINGULAR_LOWER)} ${channelSelected?.id || ""}`} closeModal={() => handleCloseModal()} />
                <form onSubmit={handleSubmit}>
                    <div className="max-h-view overflow-y-auto px-10 py-8">
                        {showChannelTypeCarousel ? (
                            <ChannelTypeCarousel handleSelectChannel={handleSelectChannel} channelSelected={channelSelected} />
                        ) : (
                            <HandleChannels
                                channelSelected={channelSelected}
                                channelValues={channelValues}
                                handleUpdateChannelValues={handleUpdateChannelValues}
                                testers={testers}
                                setTesters={setTesters}
                                setAreAllPhoneNumbersValid={setAreAllPhoneNumbersValid}
                                areAllPhoneNumbersValid={areAllPhoneNumbersValid}
                                authWithFacebook={authWithFacebook}
                                setAuthWithFacebook={setAuthWithFacebook}
                                instagramRequirementsView={instagramRequirementsView}
                            />
                        )}
                        <ModalFooter
                            closeModal={() => handleCloseModal()}
                            loading={isLoading}
                            disableButton={isDisabled()}
                            isEditing={false}
                            instagramRequirementsView={instagramRequirementsView}
                            setInstagramRequirementsView={setInstagramRequirementsView}
                            showChannelTypeCarousel={showChannelTypeCarousel}
                            channelSelected={channelSelected}
                        />
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateChannelModal;

const widget = {
    theme: {
        vars: {
            font: "Manrope",
            size: {},
            color: {
                grey: {
                    200: "#F2F7FD",
                    400: "#A6B4D0",
                    600: "#374361",
                    800: "#251d1c",
                },
                infoBg: "#00A2CF",
                errorBg: "#D6806F",
                infoTxt: "#00677F",
                primary: "#00B3C7",
                errorTxt: "#A83927",
                userText: "#5b6376",
                hoverText: "#262A30",
                secondary: "#33b7dd",
                successBg: "#209F8B",
                warningBg: "#F4DB96",
                successTxt: "#08705C",
                userBubble: "linear-gradient(315deg, #e6f6fb 0%, #e6f6f3 80%)",
                warningTxt: "#D39C00",
                selectedText: "#262A30",
                primaryDarker: "#00637f",
                secondaryLight: "#33b7dd",
            },
        },
        position: "br",
    },
    startButton: {
        logoUrl: "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/JelouLogo.svg",
        logoSize: "md",
        size: "sm",
        backgroundColor: "#000000",
        overflow: false,
        border: {
            borderWidth: "0px",
            borderColor: "#000000",
        },
        showUnreadMessages: false,
    },
    topMenu: {
        options: [],
    },
    headerPanel: {
        logo: {
            url: "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/document/ffcc3289-6efd-44f5-b6f4-9d60817f0a6a-jeloubotito2_2.png",
            hover: false,
            position: "l",
        },
        color: "#009EAF",
        title: {
            text: "Jelou!",
            type: "TXT",
        },
        message: {
            header: "",
            description: "Soy el agente virtual de soporte\nJelou y estoy aquí para ayudarte.",
            descriptionTextColor: "#374361",
        },
        background: "#BFECF1",
        distribution: "HORIZONTAL",
        stateTextColor: "#768097",
        returnBtn: true,
    },
    bodyPanel: {
        topBorder: "FLAT",
    },
    tooltipPanel: {
        // backgroundColor: "linear-gradient(315deg, #33b7dd 0%, #33b5a2 80%)",
        backgroundColor: "",
        logo: {
            url: "",
            enabled: false,
        },
        message: {
            text: "¡Soy tu agente virtual!\nlisto para ayudarte",
            title: "👋🏻\t ¡Hola!",
            textColor: "light",
            backgroundColor: "none",
        },
        closeIcon: "",
        size: false,
        openOnClick: false,
        maintain: false,
    },
    properties: {
        autoShow: false,
        allowClose: true,
        type: "normal",
        enabledHeader: true,
        enabledLocation: false,
        language: "es",
        showName: false,
        hideOnClose: false,
        noHistory: false,
        switchEnable: {
            enabled: false,
            logoUrl: "",
        },
        faqTab: false,
        onlyText: false,
        headless: false,
    },
    faqMenu: {
        topFilters: [],
        options: [],
        open: false,
    },
    homeMenu: {
        showHomeMenuOnEmptyRoom: false,
        showHomeMenuOnEmptyMessages: false,
        disableInputs: false,
        homeMenuTitle: "",
        options: [],
    },
};
