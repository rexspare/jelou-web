import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';

const Vocablos = (props) => {
  const { bot, customStyles } = props;
  const [options, setOptions] = useState(
    () => get(bot, 'operatorView.cancelExpressions') || []
  );
  const { t } = useTranslation();

  return (
    <CreatableSelect
      isClearable
      value={options}
      isMulti
      styles={customStyles}
      placeholder={t('botsSettingsCategoriesSidebarElement.addValues')}
      onChange={(options) => {
        setOptions(options);
      }}
    />
  );
};

export default Vocablos;
