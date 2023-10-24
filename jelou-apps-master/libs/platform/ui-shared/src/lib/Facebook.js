import FacebookLogin from 'react-facebook-login';
import './index.css';
import { useTranslation } from 'react-i18next';

const Facebook = (props) => {
  let { handleSocialResponse, fanPageOrigin } = props;
  let fbContent;
  const { t } = useTranslation();

  const responseFacebook = (response) => {
    const profileObj = {
      names: response.name,
      email: response.email,
      socialId: response.id,
      type: 'FACEBOOK',
    };
    handleSocialResponse(profileObj);
  };

  fbContent = (
    <FacebookLogin
      appId="358763682688306"
      fields="name,email,picture"
      scope="public_profile,email,pages_show_list"
      autoLoad={false}
      cssClass={
        !fanPageOrigin
          ? 'social-btn facebook'
          : ' button-secondary font-medium w-50'
      }
      callback={responseFacebook}
      textButton={
        !fanPageOrigin
          ? t('componentFacebook.enterFb')
          : t('componentFacebook.initFb')
      }
      icon="fa-facebook mr-2"
    />
  );

  return <div className="">{fbContent}</div>;
};

export default Facebook;
