// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import EventCard from '../EventCard';

const defaultProps = {};
const renderEventCard = (props) =>
  render(<EventCard {...defaultProps} {...props} />);

describe('<EventCard />', () => {
  it('should show event name, short description and image', () => {
    const name = 'Event card title';
    const shortDescription = 'Event card description';
    const image = '/static/images/dog.jpg';
    const imageAltText = 'Image about something';
    renderEventCard({
      event: { name, shortDescription, image, imageAltText },
    });

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(shortDescription)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: imageAltText })).toBeInTheDocument();
  });

  it('should show primary action by default and it should map to action', () => {
    const actionText = 'Some action';
    const action = vi.fn();
    renderEventCard({
      event: {},
      action,
      actionText,
    });
    const buttons = screen.getAllByRole('button', { name: actionText });

    expect(buttons.length).toEqual(3);

    fireEvent.click(buttons[0]);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should allow for primary action to be toggled off', () => {
    const actionText = 'Some action';
    const action = vi.fn();
    renderEventCard({
      event: {},
      action,
      actionText,
      primaryAction: 'hidden',
    });
    const buttons = screen.getAllByRole('button', { name: actionText });

    expect(buttons.length).toEqual(1);
  });

  it('should show a placeholder image if none is provided', () => {
    renderEventCard({
      event: {},
    });
    expect(screen.queryAllByRole('img', { hidden: true }).length).toEqual(2);
  });

  it('should gives highest priority to custom imageElement', () => {
    const imageAltText = 'Test image';
    const image = '/static/image.jpg';
    const imageElementAlt = 'Test image element';
    const imageElement = <img src="/custom-image.jpg" alt={imageElementAlt} />;
    renderEventCard({
      event: { image, imageAltText },
      imageElement,
    });

    expect(screen.queryByRole('img', { name: imageAltText })).toBeFalsy();
    expect(screen.getByRole('img', { name: imageElementAlt })).toBeTruthy();
  });

  it('should show focal content', () => {
    const focalContent = <div>Content</div>;
    renderEventCard({
      event: {},
      focalContent,
    });

    expect(screen.getByText('Content')).toBeTruthy();
  });
});
