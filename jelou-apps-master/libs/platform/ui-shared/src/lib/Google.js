import GoogleLogin from 'react-google-login';
import './index.css';
import { useTranslation } from 'react-i18next';

const Google = (props) => {
  let { handleSocialResponse } = props;
  let googleContent;
  const { t } = useTranslation();

  const responseGoogle = (response) => {
    const { profileObj } = response;
    const obj = {
      names: profileObj.givenName + ' ' + profileObj.familyName,
      email: profileObj.email,
      socialId: profileObj.googleId,
      type: 'GOOGLE',
    };
    handleSocialResponse(obj);
  };

  const badResponse = (response) => {
    console.log('error', response);
  };

  googleContent = (
    <GoogleLogin
      clientId="732493070681-dokeukq7bvd56eodmri8a74dh7he9f9s.apps.googleusercontent.com"
      buttonText={t('componentGoogle.enterGoogle')}
      onSuccess={responseGoogle}
      onFailure={badResponse}
      className={'social-btn google'}
      icon={false}
      cookiePolicy={'single_host_origin'}
    />
  );

  return <div className="">{googleContent}</div>;
};

export default Google;
