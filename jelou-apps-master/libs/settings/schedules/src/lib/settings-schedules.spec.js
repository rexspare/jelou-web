import { render } from '@testing-library/react';
import SettingsSchedules from './settings-schedules';
describe('SettingsSchedules', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SettingsSchedules />);
    expect(baseElement).toBeTruthy();
  });
});
