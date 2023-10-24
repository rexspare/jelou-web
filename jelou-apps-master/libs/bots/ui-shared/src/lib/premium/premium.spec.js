import { render } from '@testing-library/react';
import Premium from './premium';
describe('Premium', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Premium />);
    expect(baseElement).toBeTruthy();
  });
});
