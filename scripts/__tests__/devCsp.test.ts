import { describe, expect, it } from 'vitest';
import type { IndexHtmlTransformHook } from 'vite';

import { devCsp } from '../../vite.config';

describe('devCsp', () => {
  it('configures apply: serve so it runs only during development server', () => {
    const plugin = devCsp();
    expect(plugin.apply).toBe('serve');
  });

  it('injects localhost and 127.0.0.1 into img-src and media-src', () => {
    const plugin = devCsp();
    const transform = plugin.transformIndexHtml as IndexHtmlTransformHook;

    const sampleHtml = `
    <meta http-equiv="Content-Security-Policy" content="
      img-src 'self' data: blob: *.hel.fi;
      media-src 'self' *.hel.fi;
    " />
    `;

    const transformed = transform.call(
      {} as any,
      sampleHtml,
      {} as any
    ) as string;

    expect(transformed).toContain(
      "img-src 'self' data: blob: *.hel.fi localhost:* 127.0.0.1:*;"
    );
    expect(transformed).toContain(
      "media-src 'self' *.hel.fi localhost:* 127.0.0.1:*;"
    );
  });

  it('does not duplicate loopback sources if already present', () => {
    const plugin = devCsp();
    const transform = plugin.transformIndexHtml as IndexHtmlTransformHook;

    const sampleHtml = `
      img-src 'self' localhost:* 127.0.0.1:*;
      media-src 'self' localhost:* 127.0.0.1:*;
    `;

    const transformed = transform.call(
      {} as any,
      sampleHtml,
      {} as any
    ) as string;

    expect(transformed).toBe(sampleHtml);
  });
});

