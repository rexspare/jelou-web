import { render } from '@testing-library/react';
import RoomsLoading from './rooms-loading';
describe('RoomsLoading', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RoomsLoading />);
    expect(baseElement).toBeTruthy();
  });
});
