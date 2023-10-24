import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const TriggerActionsText = ({ subscriptions }) => {
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang);

    return (
        <p className='text-justify mt-1'>
            {t("datum.triggers.card.text.when")}
            {
                subscriptions.map((sub, index) => {
                    return <span className='font-bold lowercase' key={sub.id}>
                        {sub.displayNames[lang]}
                        {
                            index === subscriptions.length - 2 ? t("datum.triggers.card.text.and") : ', '
                        }
                    </span>
                })
            }
            {t("datum.triggers.card.text.call")}
            <span className='font-bold'>URL</span>
        </p>
    )
}

export default TriggerActionsText