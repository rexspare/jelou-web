import { render } from '@testing-library/react';
import SelectBasic from './select-basic';
describe('SelectBasic', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectBasic />);
    expect(baseElement).toBeTruthy();
  });
});
