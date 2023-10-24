import { render } from '@testing-library/react';
import PlatformRecoverPasswordForm from './RecoverPasswordForm';
describe('PlatformRecoverPasswordForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlatformRecoverPasswordForm />);
    expect(baseElement).toBeTruthy();
  });
});
