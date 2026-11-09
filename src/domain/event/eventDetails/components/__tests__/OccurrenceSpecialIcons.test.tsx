import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../../common/test/customRender';
import { OccurrenceSpecialIcons } from '../OccurrenceSpecialIcons';

describe('OccurrenceSpecialIcons', () => {
  it('returns null when neither accessibilities nor speechless is present', () => {
    const { container } = render(
      <OccurrenceSpecialIcons accessibilities={[]} speechless={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders accessibility tooltip with listed items', async () => {
    const user = userEvent.setup();
    render(
      <OccurrenceSpecialIcons
        accessibilities={['Yliaistiherkkyys', 'Lorem ipsum']}
      />
    );

    const button = screen.getByRole('button', {
      name: 'Näytä saavutettavuustiedot',
    });
    expect(button).toBeInTheDocument();

    await user.hover(button);
    expect(screen.getByText('Yliaistiherkkyys')).toBeInTheDocument();
    expect(screen.getByText('Lorem ipsum')).toBeInTheDocument();
  });

  it('renders speechless icon with tooltip', async () => {
    const user = userEvent.setup();
    render(<OccurrenceSpecialIcons speechless />);

    const button = screen.getByRole('button', {
      name: 'Sanaton esitys',
    });
    expect(button).toBeInTheDocument();

    await user.hover(button);
    expect(screen.getByText('Sanaton esitys')).toBeInTheDocument();
  });

  it('renders non-interactive indicators without buttons when interactive is false', () => {
    render(
      <OccurrenceSpecialIcons
        accessibilities={['Yliaistiherkkyys']}
        speechless
        interactive={false}
      />
    );

    // No interactive buttons should be present (non-interactive mode)
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
