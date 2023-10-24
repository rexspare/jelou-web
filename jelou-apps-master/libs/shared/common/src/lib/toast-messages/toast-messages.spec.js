import { render } from '@testing-library/react';
import ToastMessages from './toast-messages';
describe('ToastMessages', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToastMessages />);
    expect(baseElement).toBeTruthy();
  });
});
