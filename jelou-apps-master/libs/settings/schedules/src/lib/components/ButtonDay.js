import React from 'react';

const ButtonDay = (props) => {
  const { day, t, activateDay, index, disabledDays, disableClick } = props;
  const { id, label, active } = day;

  const disableDay = disabledDays.some((day) => day === id) && !active;

  return (
    <button
      id={id}
      type="button"
      disabled={disableDay || disableClick}
      className={`${
        disableClick && 'cursor-not-allowed'
      } outline-none flex h-12  w-12 items-center justify-center  rounded-full border-1 border-transparent  text-center align-middle font-bold ${
        !active && !disableDay
          ? 'bg-primary-700 bg-opacity-[1] text-[#727C94] text-opacity-35 '
          : disableDay
          ? 'cursor-not-allowed bg-primary-700 bg-opacity-40 text-[#727C94] text-opacity-25'
          : 'bg-[#00B3C7] text-white'
      }`}
      onClick={() => activateDay(id, index, !active)}
    >
      {t(`weekDetail.${label}`)}
    </button>
  );
};

export default ButtonDay;
