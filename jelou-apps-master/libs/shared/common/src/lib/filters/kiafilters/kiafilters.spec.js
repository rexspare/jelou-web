import { render } from '@testing-library/react';
import KIAFilters from './kiafilters';
describe('KIAFilters', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KIAFilters />);
    expect(baseElement).toBeTruthy();
  });
});
