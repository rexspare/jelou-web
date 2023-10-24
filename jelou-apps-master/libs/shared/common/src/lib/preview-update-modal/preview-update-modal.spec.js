import { render } from '@testing-library/react';
import PreviewUpdateModal from './preview-update-modal';
describe('PreviewUpdateModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PreviewUpdateModal />);
    expect(baseElement).toBeTruthy();
  });
});
