import { render } from '@testing-library/react';
import NewFilters from './new-filters';
describe('NewFilters', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewFilters />);
    expect(baseElement).toBeTruthy();
  });
});
