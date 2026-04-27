import { screen } from '@testing-library/react';

import { customRender as render } from '../../../test/customRender';
import GiveFeedbackButton from '../GiveFeedbackButton';

describe('GiveFeedbackButton', () => {
  it('renders a link with the feedback label', () => {
    render(<GiveFeedbackButton />, []);

    const feedbackLink = screen.getByRole('link', {
      name: 'Anna palautetta Kulttuurin kummilapset -palvelusta',
    });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute(
      'href',
      'https://docs.google.com/forms/d/e/1FAIpQLSdqw2Lq3qooEeRdgr0sV0-Wv-4XcV7IZVzq1HuWoLRa2M7tEg/viewform?usp=pp_url&entry.1982410290=Kulttuurin+kummilapset'
    )
  });
});
