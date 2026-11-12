import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import i18n from 'i18next';

import {
  isCimodeActive,
  isCimodeIndicatorRequested,
  setCimodeActive,
  setCimodeIndicatorRequested,
  CIMODE_SEARCH_PARAM,
  CIMODE_CHANGE_EVENT,
  CIMODE_INDICATOR_ELEMENT_ID,
} from './cimodeUtils';
import styles from './cimodeIndicator.module.scss';

/**
 * Floating indicator widget anchored at the bottom-right corner of the viewport.
 *
 * Displays current CIMODE status (whether translation keys or normal text are rendered)
 * and provides action controls:
 * - A toggle button to enable or disable CIMODE translation mode dynamically.
 * - A dismiss button to close/hide the widget from view.
 *
 * Note: texts in this widget are kept directly in English rather than passing through
 * i18next t() so that they remain readable when CIMODE is active (which would otherwise
 * replace the widget's own UI text with translation keys).
 *
 * The widget is rendered when CIMODE is active (e.g. via `?cimode=true` in the URL)
 * or when explicitly requested via the translation tool button in the footer.
 */
export const CimodeIndicator: React.FC = () => {
  const [active, setActive] = React.useState(isCimodeActive);
  const [indicatorRequested, setIndicatorRequested] = React.useState(
    isCimodeIndicatorRequested
  );
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleCimodeChange = () => {
      setActive(isCimodeActive());
      setIndicatorRequested(isCimodeIndicatorRequested());
    };

    window.addEventListener(CIMODE_CHANGE_EVENT, handleCimodeChange);
    i18n.on('languageChanged', handleCimodeChange);
    handleCimodeChange();

    return () => {
      window.removeEventListener(CIMODE_CHANGE_EVENT, handleCimodeChange);
      i18n.off('languageChanged', handleCimodeChange);
    };
  }, [location.search]);

  if (!indicatorRequested) {
    return null;
  }

  const handleToggle = () => {
    const nextState = !active;
    setCimodeActive(nextState);

    // If disabling and search param is present in URL, clean it up
    if (!nextState) {
      const params = new URLSearchParams(location.search);
      if (params.has(CIMODE_SEARCH_PARAM)) {
        params.delete(CIMODE_SEARCH_PARAM);
        const newSearch = params.toString();
        navigate(
          {
            pathname: location.pathname,
            search: newSearch ? `?${newSearch}` : '',
            hash: location.hash,
          },
          { replace: true }
        );
      }
    }
  };

  const handleClose = () => {
    setCimodeIndicatorRequested(false);

    const params = new URLSearchParams(location.search);
    if (params.has(CIMODE_SEARCH_PARAM)) {
      params.delete(CIMODE_SEARCH_PARAM);
      const newSearch = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: newSearch ? `?${newSearch}` : '',
          hash: location.hash,
        },
        { replace: true }
      );
    }
  };

  return (
    <div
      id={CIMODE_INDICATOR_ELEMENT_ID}
      className={styles.indicatorContainer}
      role="status"
      aria-live="polite"
      data-testid="cimode-indicator"
    >
      <span className={styles.indicatorText}>
        <span
          className={
            active ? styles.indicatorTagActive : styles.indicatorTagInactive
          }
        >
          CIMODE
        </span>
        <span>
          {active ? 'Showing translation keys' : 'Normal translations'}
        </span>
      </span>
      <button
        type="button"
        className={styles.actionButton}
        onClick={handleToggle}
        data-testid="cimode-toggle-button"
      >
        {active ? 'Disable' : 'Enable'}
      </button>
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close CIMODE widget"
        title="Close CIMODE widget"
        data-testid="cimode-close-button"
      >
        ✕
      </button>
    </div>
  );
};

export default CimodeIndicator;
