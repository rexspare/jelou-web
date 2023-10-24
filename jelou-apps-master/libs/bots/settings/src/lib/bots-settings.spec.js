import { render } from '@testing-library/react';
import BotsSettings from './bots-settings';
describe('BotsSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BotsSettings />);
    expect(baseElement).toBeTruthy();
  });
});
