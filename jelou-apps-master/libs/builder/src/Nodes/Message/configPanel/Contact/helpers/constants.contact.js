import { LocationIcon, MailIcon, PhoneIcon, SocialIcon } from "../../../../../Icons";

export const NAMES_INPUTS_CONTACT_BLOCK = {
  FIRST_NAME: "first_name",
  LAST_NAME: "last_name",
  PHONE: "phone",
  EMAIL: "email",
  STREET: "street",
  COMPANY: "company",
  TITLE: "title",
  URL: "url",
};

export const CONTACT_VIEW = {
  CONTACT: "contact",
  EMAIL: "emails",
  PHONE: "phones",
  ADDRESS: "addresses",
  URLS: "urls",
};

export const CONTACT_BLOCK_TYPES = {
  WORK: "WORK",
  HOME: "HOME",
  MAIN: "MAIN",
};

export const SELECT_OPTIONS = [
  {
    label: "Trabajo",
    value: CONTACT_BLOCK_TYPES.WORK,
  },
  {
    label: "Personal",
    value: CONTACT_BLOCK_TYPES.HOME,
  },
];

export const PHONE_SELECT_OPTIONS = [
  ...SELECT_OPTIONS,
  {
    label: "Principal",
    value: CONTACT_BLOCK_TYPES.MAIN,
  },
];

export const FIELDS_INFO = [
  {
    id: 1,
    icon: PhoneIcon,
    title: "Teléfono",
    list: "phones",
    value: "phone",
    view: CONTACT_VIEW.PHONE,
  },
  {
    id: 2,
    icon: MailIcon,
    title: "Correo electrónico",
    list: "emails",
    value: "email",
    view: CONTACT_VIEW.EMAIL,
  },
  {
    id: 3,
    icon: LocationIcon,
    title: "Dirección",
    list: "addresses",
    value: "street",
    view: CONTACT_VIEW.ADDRESS,
  },
  {
    id: 4,
    icon: SocialIcon,
    title: "Sitios Web",
    list: "urls",
    value: "url",
    view: CONTACT_VIEW.URLS,
  },
];

export const FIELDS_ERRORS = {
  [CONTACT_VIEW.URLS]: {
    regex: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/,
    textError: "Esta URL no es válida",
  },
  [CONTACT_VIEW.EMAIL]: {
    regex: /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    textError: "Este email no es válido",
  },
  [CONTACT_VIEW.ADDRESS]: {
    regex: /^.{1,50}$/,
    textError: "Esta dirección no es válida",
  },
  [CONTACT_VIEW.PHONE]: {
    regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    textError: "Este número no es válido",
  },
};

export const INPUT_STYLE = (hasError = "") => {
  return `bg-white px-2 py-6 rounded-10 border-1 border-gray-330 ${hasError && "border-red-500 bg-red-500"}}`;
};
