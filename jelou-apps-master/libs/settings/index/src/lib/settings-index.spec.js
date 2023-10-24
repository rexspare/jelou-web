import { render } from '@testing-library/react';
import SettingsIndex from './settings-index';
describe('SettingsIndex', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SettingsIndex />);
    expect(baseElement).toBeTruthy();
  });
});
