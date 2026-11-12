import * as React from 'react';
import { MockedResponse } from '@apollo/client/testing';
import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Footer from '../Footer';
import { customRender as render } from '../../../../common/test/customRender';
import { footerMenuMock } from '../__mocks__/footerMenuMock';
import { languagesMock } from '../__mocks__/languagesMock';
import AppConfig from '../../AppConfig';
import {
  isCimodeIndicatorRequested,
  setCimodeIndicatorRequested,
} from '../../../../common/translation/cimode/cimodeUtils';

vi.mock('hds-react', async () => {
  const actual = await vi.importActual('hds-react');

  const MockFooter = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <footer className={className} role="contentinfo">
      {children}
    </footer>
  );

  const MockFooterBase = ({
    children,
    backToTopLabel,
    onBackToTopClick,
    copyrightHolder,
  }: {
    children: React.ReactNode;
    backToTopLabel?: string;
    onBackToTopClick?: () => void;
    copyrightHolder?: string;
  }) => (
    <div>
      <button type="button" onClick={onBackToTopClick}>
        {backToTopLabel}
      </button>
      <span>{copyrightHolder}</span>
      {children}
    </div>
  );

  const MockFooterLink = ({
    href,
    label,
    onClick,
    as: Component = 'a',
    ...props
  }: {
    href?: string;
    label: React.ReactNode;
    onClick?: () => void;
    as?: React.ElementType;
    [key: string]: unknown;
  }) => {
    if (typeof Component !== 'string') {
      return <Component {...props} />;
    }
    if (Component === 'button') {
      return (
        <button type="button" onClick={onClick} {...props}>
          {label}
        </button>
      );
    }
    if (Component === 'div') {
      return <div {...props}>{label}</div>;
    }
    return (
      <a href={href} onClick={onClick} {...props}>
        {label}
      </a>
    );
  };

  const MockLogo = ({ alt }: { alt?: string }) => <img alt={alt} />;

  MockFooter.Base = MockFooterBase;
  MockFooter.Link = MockFooterLink;

  return {
    ...actual,
    Footer: MockFooter,
    Logo: MockLogo,
    logoFi: 'mocked hds-react logoFi',
  };
});

const mocks: MockedResponse[] = [{ ...footerMenuMock }, { ...languagesMock }];

it('Footer matches snapshot', async () => {
  window.sessionStorage.clear();
  setCimodeIndicatorRequested(false);

  render(<Footer />, mocks);
  await screen.findByText('Saavutettavuusseloste');
  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toMatchSnapshot();
});

it('toggles CIMODE indicator when clicking CIMODE button in footer', async () => {
  const user = userEvent.setup();
  window.sessionStorage.clear();
  setCimodeIndicatorRequested(false);

  render(<Footer />, mocks);
  const cimodeButton = screen.getByTestId('footer-cimode-button');
  expect(cimodeButton).toHaveTextContent('Käännöstyökalu');
  expect(cimodeButton).toHaveAttribute(
    'aria-label',
    'Käännöstyökalu, avaa työkalun ruudun oikeaan alakulmaan'
  );
  expect(cimodeButton).toHaveAttribute('aria-expanded', 'false');

  await user.click(cimodeButton);
  expect(isCimodeIndicatorRequested()).toBe(true);
  expect(cimodeButton).toHaveTextContent('Piilota käännöstyökalu');
  expect(cimodeButton).toHaveAttribute(
    'aria-label',
    'Piilota käännöstyökalu ruudun oikeasta alakulmasta'
  );
  expect(cimodeButton).toHaveAttribute('aria-expanded', 'true');

  await user.click(cimodeButton);
  expect(isCimodeIndicatorRequested()).toBe(false);
  expect(cimodeButton).toHaveTextContent('Käännöstyökalu');
  expect(cimodeButton).toHaveAttribute('aria-expanded', 'false');
});

it('does not render CIMODE button in footer when translationToolEnabled is false', async () => {
  vi.spyOn(AppConfig, 'translationToolEnabled', 'get').mockReturnValue(false);

  render(<Footer />, mocks);
  await screen.findByText('Saavutettavuusseloste');

  expect(screen.queryByTestId('footer-cimode-button')).not.toBeInTheDocument();
});
