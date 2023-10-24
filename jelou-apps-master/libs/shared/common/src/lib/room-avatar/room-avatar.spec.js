import { render } from '@testing-library/react';
import Roomavatar from './roomavatar';
describe('Roomavatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Roomavatar />);
    expect(baseElement).toBeTruthy();
  });
});
