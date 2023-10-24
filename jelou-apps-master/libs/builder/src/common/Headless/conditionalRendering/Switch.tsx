import React from "react";

type Props = {
    children: React.ReactElement | React.ReactElement[];
};

type ChildProps = {
    condition: boolean;
};

export function Switch({ children }: Props) {
    let matchChild: React.ReactElement<ChildProps> | null = null;
    let defaultChild: React.ReactElement<ChildProps> | null = null;

    React.Children.forEach(children, (child: React.ReactElement<ChildProps>) => {
        if (!matchChild && React.isValidElement(child) && child.type === Case) {
            const { condition } = child.props;
            const conditionResult = Boolean(condition);

            if (conditionResult) {
                matchChild = child;
            }
        } else if (!defaultChild && React.isValidElement(child) && child.type === Default) {
            defaultChild = child;
        }
    });

    return matchChild ?? defaultChild ?? <div></div>;
}

type CaseProps = {
    children: React.ReactElement;
    condition: boolean;
};

export function Case({ children }: CaseProps) {
    return children;
}

type DefaultProps = {
    children: React.ReactElement;
};

export function Default({ children }: DefaultProps) {
    return children;
}

Switch.Case = Case;
Switch.Default = Default;
