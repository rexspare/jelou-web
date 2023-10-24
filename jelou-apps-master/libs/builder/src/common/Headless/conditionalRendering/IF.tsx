import React from "react";

type Props = {
    condition: boolean;
    children: React.ReactElement | React.ReactElement[];
};

export function IF({ children, condition }: Props) {
    let thenElement: React.ReactElement | null = null;
    let elseElement: React.ReactElement | null = null;

    React.Children.forEach(children, (child: React.ReactElement) => {
        if (React.isValidElement(child) && child.type === Then) {
            thenElement = child;
        } else if (React.isValidElement(child) && child.type === Else) {
            elseElement = child;
        }
    });

    return condition ? thenElement : elseElement;
}

export const Then = ({ children }: { children: React.ReactElement }) => {
    return children;
};

export const Else = ({ children }: { children: React.ReactElement }) => {
    return children;
};

IF.Then = Then;
IF.Else = Else;
