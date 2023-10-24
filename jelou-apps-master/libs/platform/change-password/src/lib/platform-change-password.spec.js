import { render } from '@testing-library/react';
import PlatformChangePassword from './ChangePassword';
describe('PlatformChangePassword', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlatformChangePassword />);
    expect(baseElement).toBeTruthy();
  });
});
