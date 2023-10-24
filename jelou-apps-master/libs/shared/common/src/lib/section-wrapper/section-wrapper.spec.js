import { render } from '@testing-library/react';
import SectionWrapper from './section-wrapper';
describe('SectionWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SectionWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
