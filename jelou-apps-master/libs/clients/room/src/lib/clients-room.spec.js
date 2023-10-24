import { render } from '@testing-library/react';
import ClientsRoom from './clients-room';
describe('ClientsRoom', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientsRoom />);
    expect(baseElement).toBeTruthy();
  });
});
