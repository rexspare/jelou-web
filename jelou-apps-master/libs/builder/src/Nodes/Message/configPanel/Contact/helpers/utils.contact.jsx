import { HomeIcon, LocationIcon, MailIcon, PhoneIcon, PrincipalPhoneIcon, SocialIcon, WorkIcon } from "@builder/Icons";

import { CONTACT_BLOCK_TYPES, CONTACT_VIEW, PHONE_SELECT_OPTIONS, SELECT_OPTIONS } from "./constants.contact";

/**
 * Returns the header of the contact view depending on the type
 * @param {string} type
 * @returns JSX.Element
 */

export const getTypeHeader = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
            return (
                <>
                    <MailIcon />
                    <span className="font-semibold">Correo electrónico</span>
                </>
            );
        case CONTACT_VIEW.PHONE:
            return (
                <>
                    <PhoneIcon />
                    <span className="font-semibold">Teléfono</span>
                </>
            );
        case CONTACT_VIEW.ADDRESS:
            return (
                <>
                    <LocationIcon />
                    <span className="font-semibold">Dirección</span>
                </>
            );
        case CONTACT_VIEW.URLS:
            return (
                <>
                    <SocialIcon />
                    <span className="font-semibold">Sitios Web</span>
                </>
            );
        default:
            return "";
    }
};

/**
 * Returns the title of the contact view depending on the type
 * @param {string} type
 * @returns string
 */

export const getTypeTitle = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
            return "2 correos electrónicos";
        case CONTACT_VIEW.PHONE:
            return "3 teléfonos";
        case CONTACT_VIEW.ADDRESS:
            return "2 direcciones";
        case CONTACT_VIEW.URLS:
            return "2 sitios web";
        default:
            return "";
    }
};

/**
 * Returns the label of the selector depending on the type
 * @param {string} type
 * @returns string
 * */

export const getSelectorLabel = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
            return "Tipo de correo electrónico";
        case CONTACT_VIEW.PHONE:
            return "Tipo de teléfono";
        case CONTACT_VIEW.ADDRESS:
            return "Tipo de dirección";
        case CONTACT_VIEW.URLS:
            return "Tipo de sitio web";
        default:
            return "";
    }
};

/**
 * Returns the label of the input depending on the type
 * @param {string} type
 * @returns string
 * */

export const getInputLabel = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
            return "Correo electrónico";
        case CONTACT_VIEW.PHONE:
            return "Número de teléfono";
        case CONTACT_VIEW.ADDRESS:
            return "Dirección";
        case CONTACT_VIEW.URLS:
            return "Sitio web";
        default:
            return "";
    }
};

/**
 * Returns the options of the selector depending on the type
 * @param {string} type
 * @returns String[]
 * */

export const getSelectorOptions = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
        case CONTACT_VIEW.ADDRESS:
        case CONTACT_VIEW.URLS:
            return SELECT_OPTIONS;

        case CONTACT_VIEW.PHONE:
            return PHONE_SELECT_OPTIONS;

        default:
            return [];
    }
};

/**
 * Returns the label of the add button depending on the type
 * @param {string} type
 * @returns string
 * */

export const getAddLabel = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
            return "Agrega nuevo correo electrónico";
        case CONTACT_VIEW.PHONE:
            return "Agrega nuevo teléfono";
        case CONTACT_VIEW.ADDRESS:
            return "Agrega nueva dirección";
        case CONTACT_VIEW.URLS:
            return "Agrega nuevo sitio web";
        default:
            return "";
    }
};

/**
 * Returns the name of the field depending on the type
 * @param {string} type
 * @returns string
 * */
export const getFieldName = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
            return "email";
        case CONTACT_VIEW.PHONE:
            return "phone";
        case CONTACT_VIEW.ADDRESS:
            return "street";
        case CONTACT_VIEW.URLS:
            return "url";
        default:
            return "";
    }
};

/**
 * Returns the icon of the field depending on the type
 * @param {string} type
 * @returns JSX.Element
 * */

export const getFieldTypeIcon = (type) => {
    switch (type) {
        case CONTACT_BLOCK_TYPES.WORK:
            return <WorkIcon />;
        case CONTACT_BLOCK_TYPES.HOME:
            return <HomeIcon />;
        case CONTACT_BLOCK_TYPES.MAIN:
            return <PrincipalPhoneIcon />;
        default:
            return "";
    }
};

/**
 * Returns the max number of fields allowed depending on the type
 * @param {string} type
 * @returns number
 * */

export const getMaxNumberAllowed = (type) => {
    switch (type) {
        case CONTACT_VIEW.EMAIL:
        case CONTACT_VIEW.ADDRESS:
        case CONTACT_VIEW.URLS:
            return 2;
        case CONTACT_VIEW.PHONE:
            return 3;
        default:
            return 0;
    }
};

/**
 * It takes a contact from object and parses it, when it is ready, to be sent to the server.
 * @param {object} contact - The contact object not parsed yet.
 * @param {Contact} contactBlock - The contact block object not parsed yet.
 * @returns {Contact} - The contact object parsed.
 */
export const parseContactBlock = (contact, contactBlock) => {
  if (!contact) {
    return contactBlock;
  }

    return {
        ...contactBlock,
        name: {
            first_name: contact.first_name || contactBlock.name.first_name,
            last_name: contact.last_name || contactBlock.name.last_name,
            formatted_name:
                (contact.first_name || contactBlock.name.first_name) +
                " " +
                (contact.last_name || contactBlock.name.last_name),
        },
        org: {
            company: contact.company || contactBlock.org.company,
            title: contact.title || contactBlock.org.title,
            department: contact.department || contactBlock.org.department,
        },
    };
};

/**
 * It takes a contact object that is not parsed yet and checks if all the fields are filled
 * so that it can be sent to the server.
 * @param {object} [contact] - The contact object not parsed yet.
 * @returns {boolean} - A boolean value that indicates if all the fields are filled.
 */
export const checkContactFieldsFull = (contact) => {
    return Object.values(contact).every((value) => value !== "");
};
