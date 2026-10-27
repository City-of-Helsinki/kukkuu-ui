import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';

import { customRender as render } from '../../../../common/test/customRender';
import ProfileChildRedirect from '../ProfileChildRedirect';

describe('ProfileChildRedirect', () => {
  it('redirects to the profile page with child query param', () => {
    window.history.pushState({}, '', '/fi/profile/child/123');

    render(
      <Routes>
        <Route
          path="/fi/profile/child/:childId"
          element={<ProfileChildRedirect />}
        />
        <Route path="/profile" element={<div>Profile Page Destination</div>} />
      </Routes>
    );

    expect(screen.getByText('Profile Page Destination')).toBeInTheDocument();
    expect(window.location.search).toBe('?child=123');
  });
});
