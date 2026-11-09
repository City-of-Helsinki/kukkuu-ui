import React, { useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';

import styles from './iconTooltip.module.scss';

export type IconTooltipProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
  tooltipClassName?: string;
};

/**
 * Accessible tooltip triggered by an icon button, complying with WCAG 1.4.13:
 * - Dismissible via Escape key without moving focus
 * - Pointer-hoverable (tooltip does not disappear when pointer moves over it)
 * - Persistent until blur or pointer leaves
 */
export const IconTooltip: React.FC<IconTooltipProps> = ({
  icon,
  label,
  children,
  className,
  tooltipClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.tooltipWrapper, className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          // If relatedTarget is within the wrapper (e.g. tooltip content), keep open
          if (
            wrapperRef.current &&
            wrapperRef.current.contains(e.relatedTarget as Node)
          ) {
            return;
          }
          setIsOpen(false);
        }}
        className={styles.triggerButton}
      >
        {icon}
      </button>

      {isOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          className={classNames(styles.tooltipContent, tooltipClassName)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default IconTooltip;
