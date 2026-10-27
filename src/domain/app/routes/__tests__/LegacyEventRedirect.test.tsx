import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { customRender as render } from '../../../../common/test/customRender';
import LegacyEventRedirect from '../LegacyEventRedirect';

describe('LegacyEventRedirect', () => {
  it('redirects to the event details page with ticket-system-section hash', () => {
    window.history.pushState(
      {},
      '',
      '/fi/profile/child/child-123/event/event-456/redirect'
    );

    render(
      <Routes>
        <Route
          path="/fi/profile/child/:childId/event/:eventId/redirect"
          element={<LegacyEventRedirect />}
        />
        <Route
          path="/profile/child/child-123/event/event-456"
          element={<div>Unified Event Details Destination</div>}
        />
      </Routes>
    );

    expect(
      screen.getByText('Unified Event Details Destination')
    ).toBeInTheDocument();
    expect(window.location.hash).toBe('#ticket-system-section');
  });

  it('redirects to home if childId or eventId is missing', () => {
    window.history.pushState({}, '', '/fi/profile/child/event/redirect');

    render(
      <Routes>
        <Route
          path="/fi/profile/child/event/redirect"
          element={<LegacyEventRedirect />}
        />
        <Route path="/" element={<div>Home Destination</div>} />
      </Routes>
    );

    expect(screen.getByText('Home Destination')).toBeInTheDocument();
  });

  it('redirects to the event details page without hash when hash="" is provided', () => {
    window.history.pushState(
      {},
      '',
      '/fi/profile/child/child-123/event/event-456/occurrence/occ-789/enrol'
    );

    render(
      <Routes>
        <Route
          path="/fi/profile/child/:childId/event/:eventId/occurrence/:occurrenceId/enrol"
          element={<LegacyEventRedirect hash="" />}
        />
        <Route
          path="/profile/child/child-123/event/event-456"
          element={<div>Unified Event Details Destination</div>}
        />
      </Routes>
    );

    expect(
      screen.getByText('Unified Event Details Destination')
    ).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });
});
