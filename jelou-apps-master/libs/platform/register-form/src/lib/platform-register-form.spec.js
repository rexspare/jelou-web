import { render } from '@testing-library/react';
import PlatformRegisterForm from './RegisterForm';
describe('PlatformRegisterForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlatformRegisterForm />);
    expect(baseElement).toBeTruthy();
  });
});
