import { Switch } from "@builder/common/Headless/conditionalRendering";
import { useContact } from "./hooks/useContact";
import { ContactForm } from "./views/Contact";
import { FieldView } from "./views/Field";

type ContactBlockPanelProps = {
    nodeId: string;
    messageId: string;
};

export const ContactBlockPanel = ({ messageId, nodeId }: ContactBlockPanelProps) => {
    const { contactView, contactBlock, isContactView, handleReturnView, handleChangeView, handleChangeInputs, handleSaveContactBlock } = useContact({
        nodeId,
        messageId,
    });

    return (
        <Switch>
            <Switch.Case condition={isContactView}>
                <div className="space-y-2 px-6 pb-4">
                    <ContactForm contact={contactBlock} handleChangeView={handleChangeView} handleChangeInputs={handleChangeInputs} />
                </div>
            </Switch.Case>
            <Switch.Case condition={!isContactView}>
                <FieldView type={contactView} contact={contactBlock} handleReturnView={handleReturnView} handleSaveContactBlock={handleSaveContactBlock} />
            </Switch.Case>
        </Switch>
    );
};
