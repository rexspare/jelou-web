import { render } from '@testing-library/react';
import BotsUiShared from './Modal';
describe('BotsUiShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BotsUiShared />);
    expect(baseElement).toBeTruthy();
  });
});
