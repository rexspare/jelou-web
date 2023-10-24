import { render } from '@testing-library/react';
import ReportsDashboard from './reports-dashboard';
describe('ReportsDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReportsDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
