import Switch from "react-switch";
import { useTranslation } from "react-i18next";

const TriggerSwitch = ({triggerChecked, handleSwitchTrigger}) => {
    const { t } = useTranslation();
    return (
        <div className="flex w-20 items-center mt-4 self-end justify-end">
            <p className={`mr-2 font-bold ${triggerChecked ? "text-primary-200" : "text-gray-400"}`}>
                {triggerChecked ? t('datum.triggers.card.switch.on') : t('datum.triggers.card.switch.off')}
            </p>
            <Switch
                width={41}
                height={22}
                onColor="#00B3C7"
                checkedIcon={false}
                uncheckedIcon={false}
                onHandleColor="#ffffff"
                className="react-switch"
                checked={triggerChecked}
                onChange={handleSwitchTrigger}
                boxShadow="0rem 0.063rem 0.313rem rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0rem 0rem 0.063rem 0.625rem rgba(0, 0, 0, 0.2)"
            />
        </div>
    )
}

export default TriggerSwitch