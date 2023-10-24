import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { mockOnChangeEvent } from '@apps/shared/utils';
import 'rc-time-picker/assets/index.css';

const TimePickerComponent = (props) => {
  const { setOperatorProperties, name, defaultValue } = props;

  function handleTime(event) {
    const format = 'HH:mm';

    const hour = event === null ? null : event.format(format);

    setOperatorProperties(
      mockOnChangeEvent({
        value: hour,
        name,
      })
    );
  }

  return (
    <div className="mt-1 sm:mt-0 sm:col-span-2 input">
      <TimePicker
        showSecond={false}
        onChange={handleTime}
        value={defaultValue ? moment(defaultValue, 'HH:mm') : null}
      />
    </div>
  );
};

export default TimePickerComponent;
