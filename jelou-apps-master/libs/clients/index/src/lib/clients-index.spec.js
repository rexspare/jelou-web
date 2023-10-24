import { render } from '@testing-library/react';
import ClientsIndex from './clients-index';
describe('ClientsIndex', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientsIndex />);
    expect(baseElement).toBeTruthy();
  });
});
