import { render } from '@testing-library/react';
import ClientsBubbles from './clients-bubbles';
describe('ClientsBubbles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientsBubbles />);
    expect(baseElement).toBeTruthy();
  });
});
