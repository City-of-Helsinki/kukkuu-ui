import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import AlertModal from '../AlertModal';

describe('AlertModal', () => {
  it('renders children and heading correctly', () => {
    render(
      <AlertModal
        isOpen={true}
        onClose={() => {}}
        heading="Test Heading"
        ok="OK"
      >
        <div>Test Content</div>
      </AlertModal>
    );

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('calls onClose when the OK button is clicked', () => {
    const onClose = vi.fn();
    render(
      <AlertModal
        isOpen={true}
        onClose={onClose}
        heading="Test Heading"
        ok="OK"
      >
        <div>Test Content</div>
      </AlertModal>
    );

    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(
      <AlertModal
        isOpen={false}
        onClose={() => {}}
        heading="Test Heading"
        ok="OK"
      >
        <div>Test Content</div>
      </AlertModal>
    );

    expect(screen.queryByText('Test Heading')).toBeNull();
    expect(screen.queryByText('Test Content')).toBeNull();
    expect(screen.queryByText('OK')).toBeNull();
  });

  it('calls onClose when the modal is closed via toggleModal', () => {
    const onClose = vi.fn();
    render(
      <AlertModal
        isOpen={true}
        onClose={onClose}
        heading="Test Heading"
        ok="OK"
      >
        <div>Test Content</div>
      </AlertModal>
    );
    const closeButton = screen.getByRole('button', { name: 'Sulje' });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
