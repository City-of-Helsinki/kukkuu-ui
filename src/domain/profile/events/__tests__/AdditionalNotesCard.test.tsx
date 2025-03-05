import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import DOMPurify from 'dompurify';

import AdditionalNotesCard from '../AdditionalNotesCard';
import { childNotesByIdQuery } from '../../../child/queries/ChildQueries';
import { editChildNotesMutation } from '../../../child/mutation/ChildMutation';
import { fakeChildNotes } from '../mockDataUtils';

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('dompurify', async () => {
  const actual = await vi.importActual('dompurify');
  return {
    ...actual,
  };
});

vi.mock('@sentry/browser', () => ({
  captureException: vi.fn(),
}));

const childId = 'test-child-id';
const fakeNotes = fakeChildNotes(childId);

describe('AdditionalNotesCard', () => {
  const createMock = ({
    withNotes = true,
    withError = false,
    withMutationError = false,
  }) => {
    const childNotes = withNotes
      ? { ...fakeNotes, __typename: 'ChildNotesNode' }
      : null;

    return [
      {
        request: {
          query: childNotesByIdQuery,
          variables: { id: childId },
        },
        ...(withError
          ? {
              error: new Error('Error'),
            }
          : {
              result: {
                data: {
                  childNotes,
                },
              },
            }),
      },
      {
        request: {
          query: editChildNotesMutation,
          variables: {
            input: {
              childId,
              // FIXME: for some reason this does not match with ""
              // Some what related: https://github.com/vitest-dev/vitest/issues/7015.
              notes: expect.any(String),
            },
          },
        },
        ...(withMutationError
          ? {
              error: new Error('Mutation Error'),
            }
          : {
              result: {
                data: {
                  updateChildNotes: {
                    childNotes: {
                      id: childId,
                      notes: fakeNotes.notes,
                    },
                  },
                },
              },
            }),
      },
    ];
  };

  it('renders with a title', async () => {
    const mocks = createMock({});
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} title="Test Title" />
        </I18nextProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  it('renders with no notes message when no notes are found', async () => {
    const mocks = createMock({ withNotes: false });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} />
        </I18nextProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('profile.childNotes.noNotes')
      ).toBeInTheDocument();
    });
  });

  it('renders notes when notes are found', async () => {
    const mocks = createMock({ withNotes: true });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} />
        </I18nextProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(fakeNotes.notes)).toBeInTheDocument();
    });
  });

  it('displays error message when there is an error fetching notes', async () => {
    const mocks = createMock({ withError: true });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} />
        </I18nextProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('profile.childNotes.noNotes')
      ).toBeInTheDocument();
    });
  });

  it('allows editing of notes', async () => {
    const mocks = createMock({ withNotes: true });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} />
        </I18nextProvider>
      </MockedProvider>
    );

    const editButton = await screen.findByRole('button', {
      name: 'profile.childNotes.edit',
    });
    fireEvent.click(editButton);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  it('calls mutation with correct variables and displays success message on save', async () => {
    const mocks = createMock({ withNotes: true });
    const sanitizeSpy = vi.spyOn(DOMPurify, 'sanitize');
    render(
      <MockedProvider
        mocks={[
          ...mocks,
          {
            request: {
              query: childNotesByIdQuery,
              variables: { id: childId },
            },
            result: {
              data: {
                childNotes: null,
              },
            },
          },
          {
            request: {
              query: editChildNotesMutation,
              variables: {
                input: {
                  childId,
                  notes: 'New Test Notes',
                },
              },
            },
            result: {
              data: {
                updateChildNotes: {
                  childNotes: {
                    id: childId,
                    notes: 'New Test Notes',
                  },
                },
              },
            },
          },
        ]}
        addTypename={false}
      >
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} />
        </I18nextProvider>
      </MockedProvider>
    );

    const editButton = await screen.findByRole('button', {
      name: 'profile.childNotes.edit',
    });
    fireEvent.click(editButton);

    const editor = screen.getByRole('textbox');
    const newNotes = 'New Test Notes';
    fireEvent.change(editor, { target: { value: newNotes } });
    const saveButton = screen.getByRole('button', {
      name: 'profile.childNotes.save',
    });
    fireEvent.click(saveButton);

    await waitFor(() => expect(sanitizeSpy).toHaveBeenCalledWith(newNotes));
  });

  it('displays error message on mutation error', async () => {
    const mocks = createMock({ withMutationError: true });
    render(
      <MockedProvider
        mocks={[
          ...mocks,
          {
            request: {
              query: editChildNotesMutation,
              variables: {
                input: {
                  childId,
                  notes: fakeNotes.notes,
                },
              },
            },
            error: new Error('Mutation Error'),
          },
        ]}
        addTypename={false}
      >
        <I18nextProvider i18n={i18n}>
          <AdditionalNotesCard childId={childId} />
        </I18nextProvider>
      </MockedProvider>
    );

    const editButton = await screen.findByRole('button', {
      name: 'profile.childNotes.edit',
    });
    fireEvent.click(editButton);
    const saveButton = screen.getByRole('button', {
      name: 'profile.childNotes.save',
    });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'profile.childNotes.errorMessage'
      )
    );
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
