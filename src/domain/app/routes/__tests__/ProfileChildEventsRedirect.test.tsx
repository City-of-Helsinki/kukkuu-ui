import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';

import { customRender as render } from '../../../../common/test/customRender';
import ProfileChildEventsRedirect from '../ProfileChildEventsRedirect';

describe('ProfileChildEventsRedirect', () => {
  it('redirects to the events page with child query param', () => {
    window.history.pushState({}, '', '/fi/profile/child/123/events');

    render(
      <Routes>
        <Route
          path="/fi/profile/child/:childId/events"
          element={<ProfileChildEventsRedirect />}
        />
        <Route path="/events" element={<div>Events Search Destination</div>} />
      </Routes>
    );

    expect(screen.getByText('Events Search Destination')).toBeInTheDocument();
    expect(window.location.search).toBe('?child=123');
  });

  it('preserves existing query parameters such as page when redirecting', () => {
    window.history.pushState({}, '', '/fi/profile/child/456/events?page=3');

    render(
      <Routes>
        <Route
          path="/fi/profile/child/:childId/events"
          element={<ProfileChildEventsRedirect />}
        />
        <Route path="/events" element={<div>Events Search Destination</div>} />
      </Routes>
    );

    expect(screen.getByText('Events Search Destination')).toBeInTheDocument();
    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get('child')).toBe('456');
    expect(searchParams.get('page')).toBe('3');
  });
});
