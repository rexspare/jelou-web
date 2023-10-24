import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { BeatLoader } from "react-spinners";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

// import "../../i18n";
import { DashboardServer } from "@apps/shared/modules";
import { Input } from "@apps/platform/ui-shared";
import { JelouLogoIcon, CloseIcon } from "@apps/shared/icons";
import ModalCommingSoon from "../../premium/premium";

const renderErrors = (errors, t) => {
    if (!isEmpty(errors)) {
        return <span className="text-xs font-normal text-red-675">{errors}</span>;
    }
};

const CreateBot = (props) => {
    const { setOpen, setShowTab1, setShowTab2, hasBot } = props;
    const [loading, setLoading] = useState(false);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [openPremium, setOpenPremium] = useState(false);
    const [name, setName] = useState("");
    const [template, setTemplate] = useState("");
    const [templatesList, setTemplatesList] = useState([]);
    const [errors, setErrors] = useState("");
    const ref = useRef();
    const { t } = useTranslation();

    //useOnClickOutside(ref, () => setOpen(false));

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "name") {
            setName(value);
        }
    };

    const onClose = () => {
        setOpen(false);
        setShowTab1(false);
    };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const escFunction = (event) => {
        if (event.keyCode === 27) {
            setOpen(false);
        }
    };

    const loadTemplates = async () => {
        setLoadingTemplates(true);
        const response = await DashboardServer.get(`/bot_templates`).catch((error) => {
            console.log(error);
        });
        const data = get(response, "data.data", []);
        setLoadingTemplates(false);
        setTemplatesList(data);
    };

    useEffect(() => {
        loadTemplates();
        if (localStorage.getItem("templateId")) {
            setTemplate(localStorage.getItem("templateId"));
        }
        if (localStorage.getItem("bot")) {
            setName(localStorage.getItem("bot"));
        }
    }, []);

    const handleSubmit = () => {
        setLoading(true);
        setErrors("");
        if (name === "" || template === "") {
            setLoading(false);
            name === "" ? setErrors(t("botsCreate.pleaseInsertBot")) : setErrors(t("botsCreate.chooseTemplate"));
        } else {
            localStorage.setItem("bot", name);
            localStorage.setItem("templateId", template);
            setShowTab1(false);
            setShowTab2(true);
        }
        setLoading(false);
    };

    const handleTemplate = (e) => {
        const type = e.currentTarget.id;
        setErrors("");
        if (type !== "2") {
            setTemplate(type);
        }
    };

    const handleModal = () => {
        setOpenPremium(true);
    };

    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="min-w-125 transform rounded-lg bg-white px-6 pb-4 pt-5 shadow-modal transition-all" ref={ref}>
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className="bg-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 md:mr-4">
                            <JelouLogoIcon width="1.875rem" height="2.5rem" />
                        </div>
                        <div className="max-w-md text-base font-bold text-gray-400 md:text-2xl">
                            {hasBot ? t("botsCreate.createBot") : t("botsCreate.createFirstBot")}
                        </div>
                    </div>
                    <span onClick={() => onClose()}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-75" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative">
                    <div>
                        <div className="mx-auto w-full max-w-sm pb-10">
                            <div>
                                <div className="mb-4">
                                    <div className="text-gray-400 text-opacity-75">{t("botsCreate.choose")}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="mb-6">
                                        <label htmlFor="Nombre">
                                            <Input
                                                className="input-login"
                                                value={name ? name : ""}
                                                id="nombre"
                                                type="text"
                                                required={true}
                                                placeholder={t("botsCreate.botName")}
                                                name="name"
                                                onChange={handleChange}
                                            />
                                        </label>
                                        {!isEmpty(errors) && <div className="mt-1 text-right">{renderErrors(errors)}</div>}
                                    </div>
                                    <div className="mb-4 text-gray-400 text-opacity-75">{t("botsCreate.template")}</div>
                                    <div className="mb-6 flex h-cardBot">
                                        {!loadingTemplates ? (
                                            <div className="grid w-full grid-cols-2 gap-8">
                                                {templatesList.map((temp, key) => (
                                                    <div
                                                        className="block text-center align-middle text-15 text-gray-400 text-opacity-75"
                                                        key={`box-${key}`}>
                                                        {!temp.properties.disabled ? (
                                                            <Tippy content={temp.description} placement="bottom-start" theme="light">
                                                                <div className="relative">
                                                                    <button
                                                                        className={`rounded-lg border-3 border-transparent bg-gray-20 p-5 focus:outline-none ${
                                                                            template === `${temp.id}` && "border-3 border-primary-200"
                                                                        }`}
                                                                        id={`${temp.id}`}
                                                                        onClick={handleTemplate}>
                                                                        <img
                                                                            src={temp.imageUrl}
                                                                            alt="template"
                                                                            className="h-32 w-full object-cover"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </Tippy>
                                                        ) : (
                                                            <Tippy content={temp.description} placement="bottom-start" theme="light">
                                                                <div
                                                                    className={`cursor-pointer rounded-lg bg-gray-20 p-5 focus:outline-none`}
                                                                    onClick={handleModal}
                                                                    id="web">
                                                                    <img
                                                                        src={temp.imageUrl}
                                                                        alt="template"
                                                                        className="disabledBox h-32 w-full object-cover"
                                                                    />
                                                                </div>
                                                            </Tippy>
                                                        )}

                                                        <div className="pt-2 font-medium">{temp.displayName}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex w-full items-center justify-center">
                                                <BeatLoader color={"#00B3C7"} size={"0.938rem"} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-14 flex flex-col justify-end md:flex-row">
                                    <div className="mt-6 md:mt-0">
                                        <button
                                            type="submit"
                                            className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                            disabled={loading}
                                            onClick={onClose}>
                                            {t("botsCreate.cancel")}
                                        </button>
                                    </div>
                                    <div className="ml-4 mt-6 md:mt-0">
                                        <button type="submit" className="button-primary w-32" disabled={loading} onClick={handleSubmit}>
                                            {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsCreate.next")}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Transition
                show={openPremium}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <ModalCommingSoon setOpen={setOpenPremium} />
            </Transition>
        </div>
    );
};

export default CreateBot;
