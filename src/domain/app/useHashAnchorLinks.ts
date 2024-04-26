import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// I couldn't find any non-intrusive "default" way to support this
// behavior.
function useHashAnchorLinks() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, assume that it links to an element on the page
    // by id.
    if (hash !== '') {
      // Timing out pushes the code searching for the element to pushed
      // in the next event loop. This allows the content of the page to
      // render before we make searches to the DOM. Note that async
      // content may still not be ready for consumption. This linking
      // only works on pages where the element that is linked to exists
      // during the initial render.
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [hash, pathname]);
}

export default useHashAnchorLinks;
