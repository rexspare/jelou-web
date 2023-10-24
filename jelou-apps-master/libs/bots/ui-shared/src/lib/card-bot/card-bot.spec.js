import { render } from '@testing-library/react';
import CardBot from './card-bot';
describe('CardBot', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardBot />);
    expect(baseElement).toBeTruthy();
  });
});
