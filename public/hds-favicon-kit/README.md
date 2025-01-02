<!-- DOCTOC SKIP -->

# HDS Favicon kit

Here are the favicons to be used on desktop and mobile web browsers. If you need the Helsinki-logo for general use instead it is available on [the Helsinki brand site](https://brand.hel.fi/tunnus/).

The favicons are available in the following sizes and formats:

- favicon-32x32.ico (32x32px)

- favicon.svg (512x512px, dark mode support)

- apple-touch-icon.png (180x180px)

- favicon-192x192.png (192x192px, webmanifest)

- favicon-512x512.png (512x512px, webmanifest)

Note that [SVG favicon support](https://caniuse.com/link-icon-svg) for dynamic dark mode is not supported by all browsers like Safari.

#### How to use favicons

1. Deploy the favicon image and manifest files to your CDN. The files can be downloaded from [latest release on GitHub](https://github.com/City-of-Helsinki/helsinki-design-system/releases/latest).

2. Add the tags to your index.html between the <head> tags and update image file paths if needed.

<link rel="icon" href="./favicon-32x32.ico" sizes="any">
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="./apple-touch-icon.png">
<link rel="manifest" href="./manifest.webmanifest">
