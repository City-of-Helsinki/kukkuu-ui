// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { fireEvent, render } from '../../../../common/test/testingLibraryUtils';
import EventCard from '../EventCard';

const defaultProps = {};
const getWrapper = (props) =>
  render(<EventCard {...defaultProps} {...props} />);

describe('<EventCard />', () => {
  it('should show event name, short description and image', () => {
    const name = 'Event card title';
    const shortDescription = 'Event card description';
    const image = '/static/images/dog.jpg';
    const imageAltText = 'Image about something';
    const { getByText, getByRole } = getWrapper({
      event: { name, shortDescription, image, imageAltText },
    });

    expect(getByText(name)).toBeTruthy();
    expect(getByText(shortDescription)).toBeTruthy();
    expect(getByRole('img', { name: imageAltText }));
  });

  it('should show primary action by default and it should map to action', () => {
    const actionText = 'Some action';
    const action = vi.fn();
    const { getAllByRole } = getWrapper({
      event: {},
      action,
      actionText,
    });
    const buttons = getAllByRole('button', { name: actionText });

    expect(buttons.length).toEqual(2);

    fireEvent.click(buttons[0]);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should allow for primary action to be toggled off', () => {
    const actionText = 'Some action';
    const action = vi.fn();
    const { getAllByRole } = getWrapper({
      event: {},
      action,
      actionText,
      primaryAction: 'hidden',
    });
    const buttons = getAllByRole('button', { name: actionText });

    expect(buttons.length).toEqual(1);
  });

  it('should show a placeholder image if none is provided', () => {
    const { queryAllByRole } = getWrapper({
      event: {},
    });
    expect(queryAllByRole('img', { hidden: true }).length).toEqual(2);
  });

  it('should gives highest priority to custom imageElement', () => {
    const imageAltText = 'Test image';
    const image = '/static/image.jpg';
    const imageElementAlt = 'Test image element';
    const imageElement = <img src="/custom-image.jpg" alt={imageElementAlt} />;
    const { queryByRole, getByRole } = getWrapper({
      event: { image, imageAltText },
      imageElement,
    });

    expect(queryByRole('img', { name: imageAltText })).toBeFalsy();
    expect(getByRole('img', { name: imageElementAlt })).toBeTruthy();
  });

  it('should show focal content', () => {
    const focalContent = <div>Content</div>;
    const { getByText } = getWrapper({
      event: {},
      focalContent,
    });

    expect(getByText('Content')).toBeTruthy();
  });
});
