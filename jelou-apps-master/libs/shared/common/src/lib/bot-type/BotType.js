import toUpper from 'lodash/toUpper';
import { withTranslation } from 'react-i18next';

import {
  WebIcon,
  MessengerIcon,
  TwitterColoredIcon,
  WhatsappColoredIcon,
  InstagramColoredIcon,
} from '@apps/shared/icons';

const BotType = (props) => {
  const { type, t } = props;
  try {
    switch (toUpper(type)) {
      case 'FACEBOOK':
        return (
          <MessengerIcon
            className="fill-current mr-2"
            width="1.563rem"
            height="1.563rem"
          />
        );
      case 'WHATSAPP':
        return (
          <WhatsappColoredIcon
            className="fill-current mr-2"
            width="1.563rem"
            height="1.563rem"
          />
        );
      case 'WEB':
        return (
          <WebIcon
            className="fill-current mr-2"
            width="1.563rem"
            height="1.563rem"
          />
        );
      case 'APP':
        return (
          <WebIcon
            className="fill-current mr-2"
            width="1.563rem"
            height="1.563rem"
          />
        );
      case 'TWITTER':
        return (
          <TwitterColoredIcon
            className="fill-current mr-2"
            width="1.563rem"
            height="1.563rem"
          />
        );
      case 'INSTAGRAM':
        return (
          <InstagramColoredIcon
            className="fill-current mr-2"
            width="1.563rem"
            height="1.563rem"
          />
        );
      default:
        return (
          <span className="ml-4 justify-center inline-flex items-center px-3 py-1 rounded-full text-xs font-medium leading-4 bg-yellow-200 text-yellow-800 uppercase">
            {t('Nuevo canal')}
          </span>
        );
    }
  } catch {
    return (
      <span className="ml-4 justify-center inline-flex items-center px-3 py-1 rounded-full text-xs font-medium leading-4 bg-yellow-200 text-yellow-800 uppercase">
        {t('Nuevo canal')}
      </span>
    );
  }
};

export default withTranslation()(BotType);
