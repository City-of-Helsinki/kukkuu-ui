import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import ProfileHero from '../ProfileHero';
import { MyProfile } from '../../types/ProfileQueryTypes';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'fi' },
    t: (key: string, params?: Record<string, string>) => {
      if (key === 'profile.hero.titleWithGreeting') {
        return `Tili – Hei ${params?.firstName}!`;
      }
      if (key === 'profile.hero.title') return 'Tili';
      if (key === 'profile.hero.description') {
        return 'Täällä näet lastesi tulevat tapahtumat ja kutsukirjeet kausittain.';
      }
      if (key === 'profile.events.searchButton') {
        return 'Etsi tapahtumia';
      }
      return key;
    },
  }),
}));

const mockProfile: MyProfile = {
  id: 'profile-1',
  firstName: 'Maija',
  lastName: 'Meikäläinen',
  email: 'maija@example.com',
  phoneNumber: '0401234567',
  language: 'fi' as any,
  hasAcceptedCommunication: true,
  children: { edges: [], __typename: 'ChildNodeConnection' },
  languagesSpokenAtHome: { edges: [], __typename: 'LanguageNodeConnection' },
};

describe('ProfileHero', () => {
  it('renders greeting title with first name when profile is provided without custom title', () => {
    render(
      <MemoryRouter>
        <ProfileHero profile={mockProfile} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tili – Hei Maija!' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Täällä näet lastesi tulevat tapahtumat ja kutsukirjeet kausittain.'
      )
    ).toBeInTheDocument();
  });

  it('renders custom title and description when provided from CMS', () => {
    render(
      <MemoryRouter>
        <ProfileHero
          profile={mockProfile}
          title="Kulttuurilapset-profiili"
          description="CMS-muokattu ingressi"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Kulttuurilapset-profiili',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('CMS-muokattu ingressi')).toBeInTheDocument();
  });

  it('renders empty description without fallback when empty description is provided', () => {
    render(
      <MemoryRouter>
        <ProfileHero
          profile={mockProfile}
          title="Kulttuurilapset-profiili"
          description=""
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Kulttuurilapset-profiili',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Täällä näet lastesi tulevat tapahtumat ja kutsukirjeet kausittain.'
      )
    ).not.toBeInTheDocument();
  });

  it('renders default title when profile has no first name and no custom title', () => {
    render(
      <MemoryRouter>
        <ProfileHero profile={{ ...mockProfile, firstName: '' }} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tili' })
    ).toBeInTheDocument();
  });

  it('renders "Etsi tapahtumia" search link button pointing to /events when guardian has children', () => {
    const profileWithChildren: MyProfile = {
      ...mockProfile,
      children: {
        edges: [
          {
            node: {
              id: 'child-1',
              name: 'Lapsi 1',
            } as any,
          },
        ],
        __typename: 'ChildNodeConnection',
      },
    };

    render(
      <MemoryRouter>
        <ProfileHero profile={profileWithChildren} />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('link', { name: /Etsi tapahtumia/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute('href', '/events');
  });

  it('hides "Etsi tapahtumia" search link button when guardian has no children', () => {
    render(
      <MemoryRouter>
        <ProfileHero profile={mockProfile} />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('link', { name: /Etsi tapahtumia/i })
    ).not.toBeInTheDocument();
  });
});
