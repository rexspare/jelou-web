import get from 'lodash/get';
import 'tippy.js/dist/tippy.css';
import Switch from 'react-switch';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

// import Input from "../Component/Common/Input";
import { Input } from '@apps/shared/common';
import CircularProgress from "@builder/common/CircularProgressbar";

const TeamFields = (props) => {
  const {
    handleChange,
    handleCancel,
    errorsObj,
    t,
    loading,
    team,
    updatePermission,
    renderErrors,
    errors,
    teamState,
    setTeamState,
    inactiveTeam,
    teamName
  } = props;
  const lang = get(localStorage, 'lang', 'es');
  const MINIMUM_CHARACTERS = 2;
  const MAXIMUM_CHARACTERS = 70;

  const isValidTeamName = teamName && (teamName.length >= 2 && teamName.length <= 70);
  const showError = (teamName && teamName.length > 0) && !isValidTeamName;

  useEffect(() => {
    setTeamState(get(team, 'state', true));
  }, [team]);

  const handleChangeSwState = (checked) => {
    setTeamState(checked);
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row items-center space-x-6 w-full">
          <label htmlFor="Nombre" className="flex-1 max-w-xxxs">
            <div className="text-sm block mb-1 text-gray-400 text-opacity-75 font-bold">
              {t('teamsForm.name')}
            </div>
          </label>
          <div className={showError ? 'flex flex-col w-full': ' flex flex-col w-full items-end'}>
            <Input
              className={`flex-1 rounded-xs h-34 px-2 !text-15 outline-none text-gray-400 w-full bg-primary-700 ring-transparent focus:ring-transparent  ${showError ? 'border-semantic-error focus:border-red-500' : 'focus:border-transparent border-transparent'}`}
              id="nombre"
              type="text"
              key={`${team ? 't-' + team.id : 't-0'}`}
              required={true}
              name="name"
              onChange={handleChange}
              defaultValue={team ? team.name : ''}
              maxLength={MAXIMUM_CHARACTERS}
            />
            <div className="flex items-center justify-between mt-1">
              {showError && (
                <p className="w-full break-words text-xs text-semantic-error">
                    {`${t("common.mustHaveAlLeast")} ${MINIMUM_CHARACTERS} ${t("common.characters")}`}
                </p>
              )}
              <CircularProgress
                  MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                  MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS}
                  countFieldLength={teamName ? teamName.length : 0}
                  showProgressbar={true}
                  showError={showError}
              />
            </div>
          </div>
        </div>
        {!isEmpty(get(errorsObj, 'name', [])) && (
          <div className="text-right">
            {errorsObj.name.map((err) => renderErrors(`${err[lang]} `))}
          </div>
        )}
        <div className="flex items-center space-x-6 w-full">
          <label htmlFor="status" className="flex-1 max-w-xxxs">
            <div className="text-sm block mb-1 text-gray-400 text-opacity-75 font-bold">
              {t('AdminFilters.state')}
            </div>
          </label>
          <Switch
            checked={teamState}
            onChange={handleChangeSwState}
            onColor="#00B3C7"
            onHandleColor="#ffffff"
            // handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={22}
            width={41}
            className="flex-1 react-switch"
          />
        </div>
      </div>

      {!isEmpty(errors) && (
        <div className="mt-2 text-right">{renderErrors(errors)}</div>
      )}
      {updatePermission && (
        <div className="w-full flex flex-row justify-end mt-10">
          <div className="inline-flex justify-end w-full text-center mt-6 md:mt-0">
            <button
              type="submit"
              className="font-bold bg-gray-10 rounded-20 text-gray-400 focus:outline-none text-base w-32 p-2 border-1 border-transparent"
              disabled={loading}
              onClick={handleCancel}
            >
              {t('teamsForm.cancel')}
            </button>
            <button
              type="submit"
              className="button-primary w-32 ml-4"
              disabled={loading || inactiveTeam || !isValidTeamName}
            >
              {loading ? (
                <BeatLoader color={'white'} size={'0.625rem'} />
              ) : (
                `${t('teamsForm.save')}`
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamFields;
