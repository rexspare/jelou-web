import { ContactIcon } from "@builder/Icons";

export const ContactBlock = ({ data }) => {
    const {
        name: { formatted_name: formattedName },
        org: { company, title },
    } = data.contacts[0];

    return (
        <div className="shadow-nodo flex gap-4 rounded-10 border-1 border-gray-330 bg-white p-4">
            <div className="grid place-content-center">
                <ContactIcon width={32} height={32} />
            </div>
            <div className="flex w-full flex-col">
                <p className="w-28 text-sm font-semibold">{formattedName === "" ? "Nombre" : formattedName}</p>
                <p className="text-sm">{title === "" ? "Titulo" : title}</p>
                <p className="text-sm">{company === "" ? "Compañía" : company}</p>
            </div>
        </div>
    );
};
