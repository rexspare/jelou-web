import { render } from '@testing-library/react';
import Textfilter from './textfilter';
describe('Textfilter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Textfilter />);
    expect(baseElement).toBeTruthy();
  });
});
