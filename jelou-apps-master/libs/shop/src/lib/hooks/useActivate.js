import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { useSelector, useDispatch } from "react-redux";

import ActivateAnimation from "../pages/Activate/animacion/animacion.json";

import { setCompany } from "@apps/redux/store";

const IMAGES_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function useActivate() {
    const [emptyValue, setEmptyValue] = useState("");
    const [handleErrorImg, setHandleErrorImg] = useState({});
    const [imagesLogo, setImagesLogo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [nameCompany, setNameCompany] = useState("Nombre");

    const dispatch = useDispatch();
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");

    const navigate = useNavigate();

    useEffect(() => {
        if (!isEmpty(company?.properties?.shopCredentials) && !isEqual(company, {})) navigate("/shop/products");
    }, [company.properties]);

    const InputImageLogo = useRef(null);

    const onClose = () => {
        setShowActivateModal(false);
        setEmptyValue("");
        setHandleErrorImg({});
        setImagesLogo([]);
    };

    const handleChangeInputText = (evt) => {
        const { name } = evt.target;
        if (evt.target.value.length > 16) {
            setEmptyValue((preState) => ({
                ...preState,
                [name]: "Este campo solo admite hasta 16 caracteres",
            }));

            window.setTimeout(() => {
                setEmptyValue("");
            }, 2000);

            return;
        }
        setNameCompany(evt.target.value);
    };

    const handleInputImageChange = (evt) => {
        const { files } = evt.target;
        const file = files[0];
        const isImageType = IMAGES_TYPES.includes(file?.type);
        if (!isImageType) {
            setHandleErrorImg({
                error: true,
                message: `${[file.name]} no es una imagen`,
            });

            return;
        }

        setHandleErrorImg({});
        setImagesLogo([file]);
    };

    const validateFormData = (fromD) => {
        const emptyfield = {};
        fromD.forEach((value, key) => {
            if (isEmpty(value) && key !== "name") emptyfield[key] = `Este campo está vacío`;
        });
        setEmptyValue(emptyfield);

        const isEmptyImgLogo = isEmpty(imagesLogo);
        if (isEmptyImgLogo) {
            setHandleErrorImg({
                error: true,
                message: "Debes adjuntar una imágen como logo",
            });
        }

        return { hasSomeError: !isEmpty(emptyfield), isEmptyImgLogo };
    };

    const handleActivateShop = async (evt) => {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);

        const { hasSomeError, isEmptyImgLogo } = validateFormData(formData);
        if (hasSomeError || isEmptyImgLogo) {
            window.setTimeout(() => {
                setEmptyValue("");
                setHandleErrorImg({});
            }, 3000);
            return;
        }

        setLoading(true);

        const company_id = companyId;
        formData.set("company_id", company_id);
        formData.set("logo", imagesLogo[0]);
        formData.set("contact_mail", "soporte@01lab.co");

        try {
            const { jelou_ecommerce, jelou_pay } = await activateShop({ formData });
            await addCredentials({ jelou_ecommerce, jelou_pay });
            navigate("/shop/products");
            setLoading(false);
        } catch (error) {
            console.log("handleActivateShop", error);
        }
    };

    const addCredentials = async (shopCredentials) => {
        const jwt = window.localStorage.getItem("jwt");
        const company_id = companyId;

        try {
            axios.post(
                `https://api.apps.jelou.ai/api/companies/${company_id}/ecommerce`,
                { shopCredentials },
                {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                }
            );
            const newProperties = { ...company.properties, shopCredentials };
            dispatch(setCompany({ ...company, properties: newProperties }));
        } catch (error) {
            setLoading(false);
            console.error("addCredentials", error);
        }
    };

    const activateShop = async ({ formData }) => {
        try {
            const { data } = await axios.post("https://ecommerce.jelou.ai/api/v1/bootstrap", formData, {
                headers: {
                    Accept: "application/json",
                },
            });
            const { jelou_ecommerce, jelou_pay } = data;
            return { jelou_ecommerce, jelou_pay };
        } catch (err) {
            setLoading(false);
            console.error("activateShop", err);
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: ActivateAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return {
        defaultOptions,
        emptyValue,
        handleActivateShop,
        handleChangeInputText,
        handleErrorImg,
        handleInputImageChange,
        imagesLogo,
        InputImageLogo,
        loading,
        nameCompany,
        onClose,
        setImagesLogo,
        setShowActivateModal,
        showActivateModal,
    };
}
