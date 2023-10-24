import { render } from '@testing-library/react';
import Daterangepicker from './daterangepicker';
describe('Daterangepicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Daterangepicker />);
    expect(baseElement).toBeTruthy();
  });
});
