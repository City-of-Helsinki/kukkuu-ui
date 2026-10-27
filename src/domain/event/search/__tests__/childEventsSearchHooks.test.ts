import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useChildSelectOptions } from '../hooks/useChildSelectOptions';
import { useStickyChildSelect } from '../hooks/useStickyChildSelect';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

describe('ChildEventsSearch hooks', () => {
  describe('useChildSelectOptions', () => {
    const mockProfile = {
      children: {
        edges: [
          {
            node: {
              id: 'child-1',
              name: 'Malla',
              birthyear: 2020,
            },
          },
          {
            node: {
              id: 'child-2',
              name: 'Oona',
              birthyear: 2022,
            },
          },
        ],
      },
    } as any;

    it('creates child options with calculated age and finds selected option', () => {
      const { result } = renderHook(() =>
        useChildSelectOptions({
          profile: mockProfile,
          childId: 'child-1',
        })
      );

      expect(result.current.childrenOptions).toHaveLength(2);
      expect(result.current.childrenOptions[0].value).toBe('child-1');
      expect(result.current.childrenOptions[0].label).toContain('Malla');
      expect(result.current.selectedOptions).toHaveLength(1);
      expect(result.current.selectedOptions[0].value).toBe('child-1');
    });

    it('returns empty selectedOptions when childId does not match any child', () => {
      const { result } = renderHook(() =>
        useChildSelectOptions({
          profile: mockProfile,
          childId: 'non-existent',
        })
      );

      expect(result.current.selectedOptions).toEqual([]);
    });

    it('navigates when handleChildChange is invoked with a different child', () => {
      const { result } = renderHook(() =>
        useChildSelectOptions({
          profile: mockProfile,
          childId: 'child-1',
        })
      );

      result.current.handleChildChange({
        label: 'Oona',
        value: 'child-2',
      });

      expect(mockNavigate).toHaveBeenCalledWith({ search: '?child=child-2' });
    });

    it('does not navigate when handleChildChange is invoked with current child', () => {
      mockNavigate.mockClear();

      const { result } = renderHook(() =>
        useChildSelectOptions({
          profile: mockProfile,
          childId: 'child-1',
        })
      );

      result.current.handleChildChange({
        label: 'Malla',
        value: 'child-1',
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('useStickyChildSelect', () => {
    it('initializes with isSticky false and returns a ref', () => {
      const { result } = renderHook(() => useStickyChildSelect(10));

      expect(result.current.isSticky).toBe(false);
      expect(result.current.childSelectRef).toBeDefined();
    });

    it('updates isSticky based on scroll position and element bounds', () => {
      const { result } = renderHook(() => useStickyChildSelect(10));

      const mockDiv = document.createElement('div');
      vi.spyOn(mockDiv, 'getBoundingClientRect').mockReturnValue({
        top: 5,
        bottom: 45,
        left: 0,
        right: 100,
        width: 100,
        height: 40,
        x: 0,
        y: 5,
        toJSON: () => {},
      });

      (result.current.childSelectRef as any).current = mockDiv;

      Object.defineProperty(window, 'scrollY', {
        value: 150,
        writable: true,
        configurable: true,
      });

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isSticky).toBe(true);

      // Scroll back to top
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
        configurable: true,
      });

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isSticky).toBe(false);
    });
  });
});
