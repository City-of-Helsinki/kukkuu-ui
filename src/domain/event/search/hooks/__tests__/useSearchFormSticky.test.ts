import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useSearchFormSticky } from '../useSearchFormSticky';

describe('useSearchFormSticky', () => {
  it('initializes with searchFormRef and isSticky false', () => {
    const { result } = renderHook(() => useSearchFormSticky());

    expect(result.current.searchFormRef.current).toBeNull();
    expect(result.current.isSticky).toBe(false);
    expect(typeof result.current.focusChildSelector).toBe('function');
  });

  it('scrolls form into view and focuses selector button when focusChildSelector is invoked', () => {
    const { result } = renderHook(() => useSearchFormSticky());

    const mockForm = document.createElement('form');
    const mockButton = document.createElement('button');
    mockButton.id = 'child-selector';
    mockForm.appendChild(mockButton);

    const scrollSpy = vi.fn();
    mockForm.scrollIntoView = scrollSpy;
    const focusSpy = vi.spyOn(mockButton, 'focus');

    // Attach form element to ref
    (result.current.searchFormRef as React.MutableRefObject<HTMLFormElement | null>).current =
      mockForm;

    act(() => {
      result.current.focusChildSelector();
    });

    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(focusSpy).toHaveBeenCalled();
  });
});

