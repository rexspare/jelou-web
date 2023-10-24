import { render } from '@testing-library/react';
import MetricsChart from './metrics-chart';
describe('MetricsChart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MetricsChart />);
    expect(baseElement).toBeTruthy();
  });
});
