import { AppIcon, Chat, Dots, Facebook, Instagram, SettingsIcon, Twitter, WebIcon, Whatsapp } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import { Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { usePopper } from "react-popper";
import { useDispatch } from "react-redux";
import Switch from "react-switch";
import "tippy.js/dist/tippy.css";

import ModalCommingSoon from "../premium/premium";
import DeleteBot from "./Components/DeleteBot";
import SetToProduction from "./Components/SetToProduction";

import { updateBot } from "@apps/redux/store";
import { useOnClickOutside } from "@apps/shared/hooks";
import ModelCard from "./Components/ModelCard";

const CardBot = (props) => {
    const { colours, bot, loadBots, index, permissionsList, notify, notifyError, companyId, dispatch } = props;
    const { inProduction } = bot;
    const [popperRef] = useState(null);
    const [referenceRef] = useState(null);
    const [botInProduction, setBotInProduction] = useState(!!inProduction);

    const [open, setOpen] = useState(false);
    const [showProductionModal, setShowProductionModal] = useState(false);
    const [openComming, setOpenComming] = useState(false);
    const [deleteBot, setDeleteBot] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef();
    const renameRef = useRef();
    const { attributes } = usePopper(referenceRef, popperRef);
    const deletePermission = !!permissionsList.find((data) => data === "bot:delete_bot");
    const canSwitchToProd = !!permissionsList.find((data) => data === "bot:canSwitchToProduction");

    //?Estados cambiar nombre, se comenta por si a futuro se necesitan
    //  const [name, setName] = useState("");
    //  const [inputName, setInputName] = useState(false);
    //  const [loadingName, setLoadingName] = useState(false);

    const jwt = localStorage.getItem("jwt-master") ? localStorage.getItem("jwt-master") : localStorage.getItem("jwt");

    // const dispatch = useDispatch();
    const { t } = useTranslation();

    const openMenu = (e) => {
        setOpen(true);
    };

    //?Funcion editar nombre, se comenta por si necesita a futuro

    // const handleUpdate = async (e) => {
    //     if (isEmpty(name)) {
    //         return;
    //     }
    //     try {
    //       if(e.keyCode === 13){
    //         setLoadingName(true);
    //         const dataIn = {
    //             botId: bot.id,
    //             name,
    //         };

    // const handleChange = ({ target }) => {
    //     const { value, name } = target;

    //     if (name === "name") {
    //         setName(value);
    //     }
    // };

    // const handleUpdate = async () => {
    //     if (isEmpty(name)) {
    //         return;
    //     }
    //     try {
    //         setLoadingName(true);
    //         const dataIn = {
    //             botId: bot.id,
    //             name,
    //         };

    //         await DashboardServer.patch(`companies/${companyId}/bots/${bot.id}`, dataIn);
    //         dispatch(updateBot({ ...bot, name }));
    //         notify(t("botsSettingsCategoriesGeneral.changesSaves"));
    //         setInputName(false);
    //         setLoadingName(false);
    //     } catch (error) {
    //         setLoadingName(false);
    //         console.log(error);
    //     }
    // };

    const onConfirm = async () => {
        try {
            setLoading(true);
            await DashboardServer.delete(`companies/${companyId}/bots/${bot.id}`);
            loadBots();
            setLoading(false);
            setDeleteBot(false);
            notify(t("botsComponentDelete.deleteConfirm"));
        } catch (error) {
            setLoading(false);
            notifyError(t("botsSettingsCategoriesGeneral.changesNotSaves"));
            setDeleteBot(false);
            console.log(error);
        }
    };

    function onCloseBot() {
        setDeleteBot(false);
    }

    useOnClickOutside(dropdownRef, () => setOpen(false));

    const closeModal = () => {
        setShowProductionModal(false);
        setBotInProduction(!botInProduction);
    };

    const sendBotToProd = async () => {
        const dataIn = { botId: bot.id, inProduction: botInProduction };
        setLoading(true);
        try {
            await DashboardServer.patch(`companies/${companyId}/bots/${bot.id}`, dataIn);
            botInProduction ? notify(`${bot.name} ${t("setToProduction.inProduction")}`) : notify(`${bot.name} ${t("setToProduction.inSandbox")}`);
            loadBots();
            setShowProductionModal(false);
            setLoading(false);
        } catch (error) {
            notifyError(t("botsSettingsCategoriesGeneral.changesNotSaves"));
            setLoading(false);
        }
    };

    const handleChangeSw = (checked) => {
        if (canSwitchToProd) {
            setShowProductionModal(true);
            setBotInProduction(checked);
        } else {
            setOpenComming(true);
        }
    };

    const goToBuilder = () => {
        window.open(`https://builder.jelou.ai/impersonate/${jwt}/${bot.id}`, "_blank");
    };

    const botType = {
        FACEBOOK: <Facebook width="0.938rem" height="0.938rem" />,
        FACEBOOK_FEED: <Facebook width="0.938rem" height="0.938rem" />,
        WHATSAPP: <Whatsapp width="0.875rem" height="0.875rem" />,
        TWITTER: <Twitter width="1.063rem" height="1.063rem" />,
        TWITTER_REPLIES: <Twitter width="1.063rem" height="1.063rem" />,
        INSTAGRAM: <Instagram width="1.063rem" height="1.063rem" />,
        WEB: <WebIcon width="1.063rem" height="1.063rem" />,
        WIDGET: <AppIcon width="1.063rem" height="1.063rem" />,
    };

    return (
        <ModelCard
            attributes={attributes}
            dropdownRef={dropdownRef}
            openComming={openComming}
            setOpenComming={setOpenComming}
            deletePermission={deletePermission}
            showProductionModal={showProductionModal}
            loading={loading}
            deleteBot={deleteBot}
            botInProduction={botInProduction}
            openMenu={openMenu}
            handleChangeSw={handleChangeSw}
            bot={bot}
            id={bot.id}
            colours={colours}
            renameRef={renameRef}
            botType={botType}
            open={open}
            goToBuilder={goToBuilder}
            sendBotToProd={sendBotToProd}
            onCloseBot={onCloseBot}
            closeModal={closeModal}
            onConfirm={onConfirm}
            setDeleteBot={setDeleteBot}
        />
    );
};

export default CardBot;
