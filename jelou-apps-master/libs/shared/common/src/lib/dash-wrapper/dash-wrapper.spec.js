import { render } from '@testing-library/react';
import DashWrapper from './dash-wrapper';
describe('DashWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DashWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
