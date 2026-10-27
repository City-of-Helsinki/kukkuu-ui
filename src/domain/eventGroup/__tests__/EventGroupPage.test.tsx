import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';

import { customRender as render } from '../../../common/test/customRender';
import EventGroupPage from '../EventGroupPage';

describe('EventGroupPage', () => {
  it('redirects to the profile page with child query param', () => {
    window.history.pushState(
      {},
      '',
      '/fi/profile/child/123/event-group/group-456'
    );

    render(
      <Routes>
        <Route
          path="/fi/profile/child/:childId/event-group/:eventGroupId"
          element={<EventGroupPage />}
        />
        <Route path="/profile" element={<div>Profile Page Destination</div>} />
      </Routes>
    );

    expect(screen.getByText('Profile Page Destination')).toBeInTheDocument();
    expect(window.location.search).toBe('?child=123');
  });

  it('redirects to profile without query param when childId is missing', () => {
    window.history.pushState({}, '', '/fi/event-group/group-456');

    render(
      <Routes>
        <Route
          path="/fi/event-group/:eventGroupId"
          element={<EventGroupPage />}
        />
        <Route path="/profile" element={<div>Profile Page Destination</div>} />
      </Routes>
    );

    expect(screen.getByText('Profile Page Destination')).toBeInTheDocument();
    expect(window.location.search).toBe('');
  });
});
