import { render } from '@testing-library/react';
import MultiCheckboxSelect from './multi-checkbox-select';
describe('MultiCheckboxSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MultiCheckboxSelect />);
    expect(baseElement).toBeTruthy();
  });
});
