import { render } from '@testing-library/react';
import ClientsSidebar from './clients-sidebar';
describe('ClientsSidebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientsSidebar />);
    expect(baseElement).toBeTruthy();
  });
});
