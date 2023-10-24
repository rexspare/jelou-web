import { render } from '@testing-library/react';
import UsersAdmin from './users-admin';
describe('UsersAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UsersAdmin />);
    expect(baseElement).toBeTruthy();
  });
});
