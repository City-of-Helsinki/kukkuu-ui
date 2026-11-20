import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../../../common/translation/i18n/i18nInit';
import InvitationLetterModal from '../InvitationLetterModal';

describe('InvitationLetterModal', () => {
  it('returns null when invitationMessage is missing or empty', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <InvitationLetterModal
          isOpen={true}
          onClose={vi.fn()}
          eventGroup={{
            id: 'eg-1',
            name: 'Syksy 2026',
            invitationMessage: null,
          }}
        />
      </I18nextProvider>
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole('heading', { name: 'Kutsukirje: Syksy 2026' })
    ).not.toBeInTheDocument();
  });

  it('renders plain-text invitationMessage with first line as h3 heading and closes on button click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <InvitationLetterModal
          isOpen={true}
          onClose={onClose}
          eventGroup={{
            id: 'eg-1',
            name: 'Syksy 2026',
            invitationMessage: [
              'Kutsu kulttuurin kummilapselle!',
              'Hei Kulttuurin kummilapsi!',
              'Tervetuloa syksyn tapahtumiin.',
            ].join('\n'),
          }}
        />
      </I18nextProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Kutsukirje: Syksy 2026' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Kutsu kulttuurin kummilapselle!',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hei Kulttuurin kummilapsi!')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Tervetuloa syksyn tapahtumiin.')
    ).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: 'Sulje' });
    await user.click(closeButtons[closeButtons.length - 1]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders HTML invitationMessage when HTML tags are present', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <InvitationLetterModal
          isOpen={true}
          onClose={vi.fn()}
          eventGroup={{
            id: 'eg-2',
            name: null,
            invitationMessage:
              '<h1>Hei Kulttuurin kummilapsi!</h1>' +
              '<p>Tämä on API:sta tuleva kevään kutsukirje.</p>' +
              '<h2>Kulttuurin kummilapset</h2>' +
              '<address><a href="https://kummilapset.hel.fi">kummilapset.hel.fi</a></address>',
          }}
        />
      </I18nextProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Kutsukirje' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Hei Kulttuurin kummilapsi!' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Kulttuurin kummilapset' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Tämä on API:sta tuleva kevään kutsukirje.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'kummilapset.hel.fi' })
    ).toHaveAttribute('href', 'https://kummilapset.hel.fi');
  });

  it('displays character references literally in plain-text single-line and multi-line messages', () => {
    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <InvitationLetterModal
          isOpen={true}
          onClose={vi.fn()}
          eventGroup={{
            id: 'eg-plain-single',
            name: 'Syksy 2026',
            invitationMessage: 'Taide &amp; Kulttuuri &lt;3',
          }}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('Taide &amp; Kulttuuri &lt;3')).toBeInTheDocument();

    rerender(
      <I18nextProvider i18n={i18n}>
        <InvitationLetterModal
          isOpen={true}
          onClose={vi.fn()}
          eventGroup={{
            id: 'eg-plain-multi',
            name: 'Syksy 2026',
            invitationMessage: [
              'Otsikko &amp; kutsu',
              'Sisältö &lt;b&gt;kirjaimellisesti&lt;/b&gt;',
            ].join('\n'),
          }}
        />
      </I18nextProvider>
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Otsikko &amp; kutsu' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sisältö &lt;b&gt;kirjaimellisesti&lt;/b&gt;')
    ).toBeInTheDocument();
  });

  it('restores focus to the opener element when closed', async () => {
    const user = userEvent.setup();

    const ModalHarness = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <I18nextProvider i18n={i18n}>
          <button type="button" onClick={() => setIsOpen(true)}>
            Avaa kutsukirje
          </button>
          <InvitationLetterModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            eventGroup={{
              id: 'eg-focus',
              name: 'Syksy 2026',
              invitationMessage: 'Tervetuloa!',
            }}
          />
        </I18nextProvider>
      );
    };

    render(<ModalHarness />);

    const openerButton = screen.getByRole('button', {
      name: 'Avaa kutsukirje',
    });
    await user.click(openerButton);

    expect(
      screen.getByRole('heading', { name: 'Kutsukirje: Syksy 2026' })
    ).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: 'Sulje' });
    await user.click(closeButtons[closeButtons.length - 1]);

    expect(openerButton).toHaveFocus();
  });
});
