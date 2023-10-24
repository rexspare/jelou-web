import { render } from '@testing-library/react';
import Guide from './guide';
describe('Guide', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Guide />);
    expect(baseElement).toBeTruthy();
  });
});
