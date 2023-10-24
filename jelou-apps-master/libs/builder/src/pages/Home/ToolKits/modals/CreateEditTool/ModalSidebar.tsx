import React, { Children, Fragment, cloneElement, isValidElement } from "react";

import { CheckIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { getDIVStyle, getLIEditStyle, getLINEStyle, getLIStyle } from "../../utils.tools";

type TitleProps = {
    className?: string;
    title: string;
};

function Title({ title, className = "" }: TitleProps) {
    return <h4 className={`text-xl font-semibold text-primary-200 ${className}`}>{title}</h4>;
}

type ListProps = {
    className?: string;
    children: React.ReactNode;
    isEdit?: boolean;
};

function List({ className, isEdit, children }: ListProps) {
    return (
        <ul className={`flex flex-col justify-center gap-12 ${className}`}>
            {Children.map(children, (child) => {
                if (isValidElement(child) && child.type === ItemList) return cloneElement(child as React.ReactElement, { isEdit });
                return null;
            })}
        </ul>
    );
}

type ItemListProps<ID extends React.Key> = {
    id: ID;
    name: string;
    number: string | number;
    onClick: (id: ID) => void;
    isComplete: boolean;
    isActive: boolean;
    hasLine: boolean;
    isEdit?: boolean;
};

function ItemList<ID extends React.Key>({ id, name, onClick, number, isEdit, isComplete, hasLine, isActive }: ItemListProps<ID>) {
    const styleLI = isEdit ? getLIEditStyle(isActive) : getLIStyle(isActive, isComplete);
    const styleDIV = getDIVStyle(isActive, isComplete);
    const styleLine = getLINEStyle(hasLine);

    return (
        <Fragment key={id}>
            <Switch>
                <Switch.Case condition={Boolean(isEdit)}>
                    <li onClick={() => onClick(id)} className={`flex h-16 w-70 cursor-pointer items-center gap-2 px-10 transition-all duration-300 ease-in ${styleLI}`}>
                        <p className="font-semibold">{name}</p>
                    </li>
                </Switch.Case>
                <Switch.Default>
                    <li className={`flex gap-2 transition-all duration-300 ease-in ${styleLI}`}>
                        <div className={`relative grid h-6 w-6 place-content-center rounded-full text-base text-white transition-all duration-300 ease-in ${styleDIV} ${styleLine}`}>
                            {isComplete ? <CheckIcon /> : <span>{number}</span>}
                        </div>
                        <p className={`font-semibold transition-all duration-300 ease-in`}>{name}</p>
                    </li>
                </Switch.Default>
            </Switch>
        </Fragment>
    );
}

type ModalSidebarProps = {
    isEdit: boolean;
    className?: string;
    children: React.ReactNode[];
};

export function SidebarModal({ isEdit, children, className = "" }: ModalSidebarProps) {
    return (
        <nav className={`flex h-full w-78 flex-col gap-4 rounded-l-1 bg-[#F3FBFC] p-10 ${className}`}>
            {Children.map(children, (child) => {
                if (isValidElement(child) && child.type === Title) return child;
                return null;
            })}

            {Children.map(children, (child) => {
                if (isValidElement(child) && child.type === List) return cloneElement(child as React.ReactElement, { isEdit });
                return null;
            })}
        </nav>
    );
}

SidebarModal.Title = Title;
SidebarModal.List = List;
SidebarModal.ItemList = ItemList;
