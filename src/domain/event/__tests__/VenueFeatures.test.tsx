import VenueFeatures from '../VenueFeatures';
import { render } from '../../../common/test/testingLibraryUtils';
import { OccurrenceVenue } from '../types/OccurrenceQueryTypes';

const venue: OccurrenceVenue = {
  id: 'auppss',
  name: 'Musiikkitalo',
  address: 'Urho Kekkosen katu 12',
  accessibilityInfo: 'a',
  additionalInfo: 'b',
  arrivalInstructions: 'zz jk ølk',
  wcAndFacilities: 'zup',
  wwwUrl: 'https://www.venue.com',
};

it('renders snapshot correctly', () => {
  const { container } = render(<VenueFeatures venue={venue} />);
  expect(container).toMatchSnapshot();
});
