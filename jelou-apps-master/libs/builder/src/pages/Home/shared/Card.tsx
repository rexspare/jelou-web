import React from "react";
import { NavLink } from "react-router-dom";

import { TrashIcon2 } from "@apps/shared/icons";
import { EditPencil } from "@builder/Icons";
import { ActionMenuItem } from "./Layouts/ActionMenuItem";
import { ActionsMenuLayout } from "./Layouts/ActionsMenuLayout";

type SkillsCard = {
    children: React.ReactElement[];
    linkToNav: string;
};

export function SkillsCard({ children, linkToNav }: SkillsCard) {
    return (
        <li className="relative">
            {React.Children.map(children, (child) => {
                if (child.type === Actions) return child;
                return null;
            })}
            <NavLink to={linkToNav}>
                <div className="grid h-full grid-rows-[2rem_4.25rem_3rem] rounded-xl border-3 border-transparent bg-white px-6 py-4 text-gray-610 transition-all duration-200 ease-in-out hover:border-primary-200/15 hover:text-primary-200 hover:shadow-data-card">
                    {React.Children.map(children, (child) => {
                        if (child.type === Title) return child;
                        if (child.type === Description) return child;
                        if (child.type === Footer) return child;

                        return null;
                    })}
                </div>
            </NavLink>
        </li>
    );
}

SkillsCard.Title = Title;
SkillsCard.Description = Description;
SkillsCard.Footer = Footer;
SkillsCard.Actions = Actions;

function Footer({ className, children }: { children: React.ReactElement | React.ReactElement[]; className?: string }) {
    return <footer className={`flex h-12 items-center justify-between gap-3 border-t-2 border-gray-400/15 pt-3 text-right ${className}`}>{children}</footer>;
}

function Description({ className, children }: { className?: string; children: React.ReactElement | string }) {
    return <p className={`break-words text-sm text-gray-400 line-clamp-3 ${className}`}>{children}</p>;
}

function Title({ className, children }: { className?: string; children: React.ReactElement | string }) {
    return <p className={`truncate text-lg font-bold ${className}`}>{children}</p>;
}

type ActionsProps = {
    handleDelete: () => void;
    handleEdit: () => void;
};

function Actions({ handleDelete, handleEdit }: ActionsProps) {
    return (
        <div className="absolute right-[1rem] top-[0.25rem] z-10">
            <ActionsMenuLayout>
                <ActionMenuItem title="Editar" Icon={EditPencil} onClick={handleEdit} />
                <ActionMenuItem title="Eliminar" Icon={TrashIcon2} onClick={handleDelete} />
            </ActionsMenuLayout>
        </div>
    );
}
