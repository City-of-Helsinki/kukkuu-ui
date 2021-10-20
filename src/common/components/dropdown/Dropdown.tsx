import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button/Button';
import Icon from '../icon/Icon';
import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './dropdown.module.scss';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string;
  // If the icon is something else than decorative, a label should be
  // provided for it that can be used to communicate its meaning to
  // screen readers.
  iconLabel?: string;
  onClick?: () => void;
}

type DropdownOptions = DropdownOption[];

interface DropdownProps {
  options: DropdownOptions;
}

const Dropdown: FunctionComponent<DropdownProps> = ({
  children,
  options,
  ...rest
}) => {
  const { t } = useTranslation();

  // If we only have one option we render a button, else we render a dropdown.
  const isDropdown = options.length > 1;
  const itemDisplayedOnNavbar = options[0];

  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, toggleDropdown] = useState(false);
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      toggleDropdown(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  return (
    <div className={styles.dropdownWrapper} {...rest} ref={ref}>
      {/* The button text is the first item in the option list */}
      {isDropdown && (
        <>
          <Button
            className={styles.dropdownButton}
            variant="supplementary"
            iconRight={
              <Icon
                src={itemDisplayedOnNavbar.icon ?? angleDownIcon}
                alt={t('navbar.menuButton.label')}
              />
            }
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label={`${itemDisplayedOnNavbar.label} ${
              itemDisplayedOnNavbar.iconLabel || ''
            }`}
            onClick={() => {
              toggleDropdown(!isOpen);
            }}
          >
            {itemDisplayedOnNavbar.label}
          </Button>
          {isOpen && (
            <div className={styles.dropdownContent}>
              {options.slice(1).map((option, index) => {
                return (
                  <Button
                    id={option.id}
                    variant="supplementary"
                    className={styles.dropdownContentOption}
                    key={index}
                    iconRight={
                      option.icon ? <Icon src={option.icon} /> : undefined
                    }
                    onClick={() => {
                      toggleDropdown(!isOpen);
                      option.onClick && option.onClick();
                    }}
                  >
                    <span>{option.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </>
      )}
      {/* We only have one option, show it as a simple button */}
      {!isDropdown && (
        <Button
          id={itemDisplayedOnNavbar.id}
          className={styles.dropdownButton}
          aria-label={itemDisplayedOnNavbar.label}
          variant="supplementary"
          iconRight={
            itemDisplayedOnNavbar.icon ? (
              <Icon
                src={itemDisplayedOnNavbar.icon}
                alt={t('navbar.menuButton.label')}
              />
            ) : undefined
          }
          onClick={() => {
            itemDisplayedOnNavbar?.onClick && itemDisplayedOnNavbar.onClick();
          }}
        >
          {itemDisplayedOnNavbar.label}
        </Button>
      )}
    </div>
  );
};

export default Dropdown;
