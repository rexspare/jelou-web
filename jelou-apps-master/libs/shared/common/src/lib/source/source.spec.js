import { render } from '@testing-library/react';
import Source from './source';
describe('Source', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Source />);
    expect(baseElement).toBeTruthy();
  });
});
