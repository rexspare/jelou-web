import { render } from '@testing-library/react';
import ProfileModal from './profile-modal';
describe('ProfileModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileModal />);
    expect(baseElement).toBeTruthy();
  });
});
