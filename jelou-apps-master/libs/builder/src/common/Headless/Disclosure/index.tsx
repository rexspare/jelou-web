import { Disclosure } from "@headlessui/react";

import { ArrowIcon } from "@builder/Icons";

export interface DisclosureProps {
    idButton: string;
    LabelButton: React.FC | string;
    MenuBtn?: React.FC;
    children: React.ReactNode;
    classNamePanel?: string;
    classNameButton?: string;
    defaultOpen?: boolean;
}

export function DiclosureHeadless({ idButton, LabelButton, MenuBtn, children, classNamePanel = "", classNameButton = "", defaultOpen = true }: DisclosureProps) {
    const isStrignLabelBtn = typeof LabelButton === "string";

    return (
        <Disclosure as="aside" className="w-full" defaultOpen={defaultOpen}>
            {({ open }) => (
                <>
                    <div className={`flex items-center ${classNameButton}`}>
                        <Disclosure.Button id={idButton} className="flex w-full items-center gap-2">
                            {isStrignLabelBtn ? <span>{LabelButton}</span> : <LabelButton />}
                            <ArrowIcon color="currentColor" className={`${!open && "rotate-90"}`} />
                        </Disclosure.Button>
                        {MenuBtn && <MenuBtn />}
                    </div>
                    <Disclosure.Panel className={classNamePanel} as="ul">
                        {children}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
