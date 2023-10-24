import { render } from '@testing-library/react';
import ClientsProfile from './clients-profile';
describe('ClientsProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientsProfile />);
    expect(baseElement).toBeTruthy();
  });
});
