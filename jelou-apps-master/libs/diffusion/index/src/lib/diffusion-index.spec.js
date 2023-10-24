import { render } from '@testing-library/react';
import DiffusionIndex from './diffusion-index';
describe('DiffusionIndex', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiffusionIndex />);
    expect(baseElement).toBeTruthy();
  });
});
