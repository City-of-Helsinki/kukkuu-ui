import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProfileHero from '../ProfileHero';
import { MyProfile } from '../../types/ProfileQueryTypes';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (key === 'profile.hero.titleWithGreeting') {
        return `Tili – Hei ${params?.firstName}!`;
      }
      if (key === 'profile.hero.title') return 'Tili';
      if (key === 'profile.hero.description') {
        return 'Täällä näet lastesi tulevat tapahtumat ja kutsukirjeet kausittain.';
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
  it('renders greeting title with first name when profile is provided', () => {
    render(<ProfileHero profile={mockProfile} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tili – Hei Maija!' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Täällä näet lastesi tulevat tapahtumat ja kutsukirjeet kausittain.')
    ).toBeInTheDocument();
  });

  it('renders default title when profile has no first name', () => {
    render(<ProfileHero profile={{ ...mockProfile, firstName: '' }} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tili' })
    ).toBeInTheDocument();
  });
});
