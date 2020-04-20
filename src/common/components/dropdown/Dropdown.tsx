import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button/Button';
import Icon from '../icon/Icon';
import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './dropdown.module.scss';

interface DropdownOption {
  id: string;
  label: string;
  icon?: string;
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
            aria-label={t(
              isOpen ? 'common.menu.closeMenuText' : 'common.menu.openMenuText'
            )}
            aria-expanded={isOpen}
            onClick={() => {
              toggleDropdown(!isOpen);
            }}
          >
            <span>{itemDisplayedOnNavbar.label}</span>
            <Icon
              src={itemDisplayedOnNavbar.icon ?? angleDownIcon}
              alt={t('navbar.menuButton.label')}
            />
          </Button>
          {isOpen && (
            <div className={styles.dropdownContent}>
              {options.slice(1).map((option, index) => {
                return (
                  <Button
                    id={option.id}
                    className={styles.dropdownContentOption}
                    key={index}
                    onClick={() => {
                      toggleDropdown(!isOpen);
                      option.onClick && option.onClick();
                    }}
                  >
                    <span>{option.label}</span>
                    {option.icon && <Icon src={option.icon} />}
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
          aria-label={itemDisplayedOnNavbar.label}
          onClick={() => {
            itemDisplayedOnNavbar?.onClick && itemDisplayedOnNavbar.onClick();
          }}
        >
          <span>{itemDisplayedOnNavbar.label}</span>
          <Icon
            src={itemDisplayedOnNavbar.icon ?? angleDownIcon}
            alt={t('navbar.menuButton.label')}
          />
        </Button>
      )}
    </div>
  );
};

export default Dropdown;
