import { render } from '@testing-library/react';
import MultiCombobox from './multi-combobox';
describe('MultiCombobox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MultiCombobox />);
    expect(baseElement).toBeTruthy();
  });
});
