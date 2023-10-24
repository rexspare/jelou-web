import { render } from '@testing-library/react';
import DiffusionCampaigns from './diffusion-campaigns';
describe('DiffusionCampaigns', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiffusionCampaigns />);
    expect(baseElement).toBeTruthy();
  });
});
