import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';

import { customRender as render } from '../../../../common/test/customRender';
import SearchRedirect from '../SearchRedirect';

describe('SearchRedirect', () => {
  it('redirects /search to /events preserving query parameters', () => {
    window.history.pushState({}, '', '/fi/search?child=child-1&page=2');

    render(
      <Routes>
        <Route path="/fi/search" element={<SearchRedirect />} />
        <Route path="/events" element={<div>Events Search Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Events Search Page')).toBeInTheDocument();
    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get('child')).toBe('child-1');
    expect(searchParams.get('page')).toBe('2');
  });

  it('redirects clean /search to clean /events without query params', () => {
    window.history.pushState({}, '', '/fi/search');

    render(
      <Routes>
        <Route path="/fi/search" element={<SearchRedirect />} />
        <Route path="/events" element={<div>Events Search Page</div>} />
      </Routes>
    );

    expect(screen.getByText('Events Search Page')).toBeInTheDocument();
    expect(window.location.search).toBe('');
  });
});
