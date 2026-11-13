import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApolloClient, InMemoryCache } from '@apollo/client';

import { useCmsCacheRevalidation } from '../useCmsCacheRevalidation';
import * as clientModule from '../../client';

describe('useCmsCacheRevalidation', () => {
  it('calls revalidateStaleCmsCache with provided Apollo client on mount', () => {
    const revalidateSpy = vi.spyOn(clientModule, 'revalidateStaleCmsCache');
    const mockClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    renderHook(() => useCmsCacheRevalidation(mockClient));

    expect(revalidateSpy).toHaveBeenCalledWith(mockClient);
  });
});
