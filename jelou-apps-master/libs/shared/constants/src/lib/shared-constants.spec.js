import { render } from '@testing-library/react';
import SharedConstants from './shared-constants';
describe('SharedConstants', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedConstants />);
    expect(baseElement).toBeTruthy();
  });
});
