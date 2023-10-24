import { useTranslation } from "react-i18next";
import React from "react";

export const PrincipalTippy = () => {
    const { t } = useTranslation();

    return (
        <aside className="font-normal text-gray-400">
            <p className="font-bold">{t("shop.tippys.PrincipalColorTitle")}</p>
            <ul>
                <li>· Color principal del Gradiente(header)</li>
                <li>· Color de botones</li>
                <li>· Color de Descuento aplicado</li>
            </ul>
        </aside>
    );
};

export const ComplementaryTippy = () => (
    <aside className="font-normal text-gray-400">
        <p className="font-bold">Color complementario incluye:</p>
        <ul>
            <li>· Color secundario del Gradiente (header)</li>
        </ul>
    </aside>
);

export const SecundaryTippy = () => (
    <aside className="font-normal text-gray-400">
        <p className="font-bold">Color secundario incluye:</p>
        <ul>
            <li>· Color del nombre de la empresa</li>
            <li>· Color del ícono o número dentro del botón</li>
        </ul>
    </aside>
);

export const TextTippy = () => (
    <aside className="font-normal text-gray-400">
        <p className="font-bold">Color del texto incluye:</p>
        <ul>
            <li>· Color de los nombres de los productos</li>
            <li>· Color del precio</li>
            <li>· Color de data secundaria</li>
        </ul>
    </aside>
);

export const BgAddressTippy = () => (
    <aside className="font-normal text-gray-400">
        <p className="font-bold">Color fondo dirección incluye:</p>
        <ul>
            <li>· Color de la franja de dirección</li>
        </ul>
    </aside>
);

export const TextAddressTippy = () => (
    <aside className="font-normal text-gray-400">
        <p className="font-bold">Color texto dirección incluye:</p>
        <ul>
            <li>· Color del texto de la dirección</li>
        </ul>
    </aside>
);
