import { render } from '@testing-library/react';
import DiffusionHsmReports from './diffusion-hsm-reports';
describe('DiffusionHsmReports', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiffusionHsmReports />);
    expect(baseElement).toBeTruthy();
  });
});
