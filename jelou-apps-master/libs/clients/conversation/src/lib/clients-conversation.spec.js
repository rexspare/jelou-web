import { render } from '@testing-library/react';
import ClientsConversation from './clients-conversation';
describe('ClientsConversation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientsConversation />);
    expect(baseElement).toBeTruthy();
  });
});
