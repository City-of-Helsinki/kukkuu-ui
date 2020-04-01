import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import VenueFeatures from '../VenueFeatures';
import { occurrenceQuery_occurrence_venue as VenueType } from '../../api/generatedTypes/occurrenceQuery';

const venue: VenueType = {
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
  const element = shallow(<VenueFeatures venue={venue} />);
  expect(toJson(element)).toMatchSnapshot();
});
