import { render } from '@testing-library/react';
import SingleDatePicker from './single-date-picker';
describe('SingleDatePicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SingleDatePicker />);
    expect(baseElement).toBeTruthy();
  });
});
